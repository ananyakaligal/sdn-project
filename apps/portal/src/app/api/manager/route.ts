import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// In Kubernetes, agents are reached via service DNS names
const AGENT_SERVICES: { [key: string]: string } = {
  inventory: 'inventory-agent-service',
  orders: 'orders-agent-service',
  payments: 'payments-agent-service',
  users: 'users-agent-service',
  notifications: 'notifications-agent-service'
};

function buildExtendIndexFromName(name: string) {
  const bytes = Buffer.from(name, 'utf8');
  const parts = [bytes.length, ...bytes];
  return parts.join('.');
}

function buildExtendValueOid(name: string) {
  const baseOid = '1.3.6.1.4.1.8072.1.3.2.3.1.1';
  return `${baseOid}.${buildExtendIndexFromName(name)}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get('service');
  const key = searchParams.get('key');

  if (!service || !key) {
    return NextResponse.json({ error: 'Missing service or key parameter' }, { status: 400 });
  }

  const agentService = AGENT_SERVICES[service];
  if (!agentService) {
    return NextResponse.json({ error: `Unknown service: ${service}` }, { status: 400 });
  }

  try {
    const name = `${service}_${key}`;
    const oid = buildExtendValueOid(name);
    // Query agent via SNMP to the Kubernetes service
    const getCmd = `snmpget -v2c -c public -m '' -On ${agentService} ${oid}`;
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
    return NextResponse.json({ 
      error: 'Failed to query metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
