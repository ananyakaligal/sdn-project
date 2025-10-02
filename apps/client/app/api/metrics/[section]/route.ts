import { NextRequest } from 'next/server';
import { config } from '@/lib/config';

const mock = {
  users: { active: 42, authSuccessRate: 98, authFailureRate: 2, avgLoginResponseMs: 180, profileUpdateRate: 5 },
  orders: { perMin: 17, orderUpdateRate: 24, orderFailureRate: 1, avgOrderProcessingMs: 220, activeOrders: 3 },
  inventory: { stockOutEvents: 1, stockUpdateRate: 12, avgStockQueryMs: 90 },
  payments: { perMin: 9, failureRate: 1, avgPaymentProcessingMs: 480, activePaymentSessions: 1, refundRate: 2 },
  notifications: { perMin: 33, failureRate: 3, avgDeliveryMs: 140, activeQueues: 2, retryCount: 5 },
};

export async function GET(_req: NextRequest, ctx: { params: { section: string } }) {
  const section = ctx.params.section as keyof typeof mock;
  if (process.env.USE_MOCKS === 'true') {
    const data = mock[section] ?? {};
    return Response.json(data);
  }
  const url = `${config.apiBase}/api/metrics/${section}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

