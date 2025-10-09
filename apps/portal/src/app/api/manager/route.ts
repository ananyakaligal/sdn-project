import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const AGENT_PORTS = {
  inventory: 161,
  orders: 1161,
  payments: 2161,
  users: 3161,
  notifications: 4161,
};

function buildExtendIndexFromName(name: string) {
  const bytes = Buffer.from(name, 'utf8');
  const parts = [bytes.length, ...bytes];
  return parts.join('.');
}

function buildExtendValueOid(name: string) {
  const baseOid = '1.3.6.1.4.1.8072.1.3.2.3.1.1'; // nsExtendOutput1Line OID
  return `${baseOid}.${buildExtendIndexFromName(name)}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get('service');
  const key = searchParams.get('key');

  if (!service || !key) {
    return NextResponse.json({ error: 'Missing service or key parameter' }, { status: 400 });
  }

  const port = AGENT_PORTS[service as keyof typeof AGENT_PORTS];
  if (!port) {
    return NextResponse.json({ error: `Unknown service: ${service}` }, { status: 400 });
  }

  const containerName = `agent-${service}`;

  try {
    const name = `${service}_${key}`;
    const oid = buildExtendValueOid(name);
    const getCmd = `docker exec ${containerName} sh -lc "snmpget -v2c -c public -m '' -On localhost ${oid}"`;
    const { stdout } = await execAsync(getCmd);

    let value = null;
    const mString = stdout.match(/STRING:\s*\"([^\"]+)\"/);
    const mInteger = stdout.match(/INTEGER:\s*(\d+)/);
    if (mString) value = mString[1];
    else if (mInteger) value = mInteger[1];

    if (value === null || value === undefined) {
      return NextResponse.json({ error: `Value not found for ${name}` }, { status: 404 });
    }

    return NextResponse.json({
      service,
      key,
      value: Number.isNaN(parseInt(value, 10)) ? value : parseInt(value, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error querying metrics:', error);
    return NextResponse.json({ error: 'Failed to query metrics' }, { status: 500 });
  }
}
