const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;

const AGENT_PORTS = {
  inventory: 161,
  orders: 1161,
  payments: 2161,
  users: 3161,
  notifications: 4161
};


app.use(cors());
app.use(express.json());

function buildExtendIndexFromName(name) {
  const bytes = Buffer.from(name, 'utf8');
  const parts = [bytes.length, ...bytes];
  return parts.join('.');
}


function buildExtendValueOid(name) {
  const baseOid = '1.3.6.1.4.1.8072.1.3.2.3.1.1'; // nsExtendOutput1Line OID
  return `${baseOid}.${buildExtendIndexFromName(name)}`;
}

app.get('/metrics', async (req, res) => {
  const { service, key } = req.query;
  
  if (!service || !key) {
    return res.status(400).json({ error: 'Missing service or key parameter' });
  }
  
  const port = AGENT_PORTS[service];
  if (!port) {
    return res.status(400).json({ error: `Unknown service: ${service}` });
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
      return res.status(404).json({ error: `Value not found for ${name}` });
    }

    res.json({
      service,
      key,
      value: Number.isNaN(parseInt(value, 10)) ? value : parseInt(value, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error querying metrics:', error);
    res.status(500).json({ error: 'Failed to query metrics' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SNMP Manager API running on port ${PORT}`);
  console.log(`Available services: ${Object.keys(AGENT_PORTS).join(', ')}`);
});
