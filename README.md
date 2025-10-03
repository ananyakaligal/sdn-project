# SDN Project - SNMP Monitoring System

A complete SNMP monitoring system with microservice agents, manager API, and web dashboard.

## Architecture

- **SNMP Agents**: 5 microservices (inventory, orders, payments, users, notifications) exposing metrics via SNMP
- **SNMP Manager**: Node.js API that queries agents and serves metrics via REST
- **Web Client**: Next.js dashboard for querying and visualizing metrics

## Quick Start

### 1. Start SNMP Agents
```bash
docker compose up -d --build
```

### 2. Start Manager API
```bash
cd apps/manager
npm install
npm start
```

### 3. Start Web Client
```bash
cd apps/client
npm install
npm run dev
```

Open http://localhost:3000 to access the dashboard.

## API Endpoints

- `GET /health` - Health check
- `GET /metrics?service={service}&key={key}` - Get metric value

### Available Services & Metrics

**Inventory**: stockLevel, stockOutEvents, avgStockQueryMs, stockUpdateRate, inventorySyncErrors
**Orders**: activeOrders, ordersPerMin, orderUpdateRate, orderFailureRate, avgOrderProcessingMs
**Payments**: activePaymentSessions, paymentsPerMin, paymentFailureRate, refundRate, avgPaymentProcessingMs
**Users**: activeUsers, authSuccessRate, authFailureRate, profileUpdateRate, avgLoginResponseMs
**Notifications**: notificationsPerMin, activeQueues, notificationFailureRate, retryCount, avgDeliveryMs

## Configuration

Set `NEXT_PUBLIC_MANAGER_URL` in `apps/client/.env.local` if manager API is not on localhost:3001.

## Testing

Test agents directly:
```bash
docker exec agent-inventory sh -lc "snmpwalk -v2c -c public -m '' -On localhost 1.3.6.1.4.1.8072.1.3.2.3.1.1"
```

Test manager API:
```bash
curl "http://localhost:3001/metrics?service=inventory&key=stockLevel"
```
