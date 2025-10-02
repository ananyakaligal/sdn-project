"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

export default function OrdersPage() {
  const { data, isLoading, error } = useSWR('/api/metrics/orders', fetcher, { refreshInterval: 5000 });
  if (isLoading) return <div className="h-24 rounded bg-muted animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const m = data ?? {};
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
      <StatCard title="Orders / min" value={m.perMin ?? 0} />
      <StatCard title="Order Updates" value={m.orderUpdateRate ?? 0} />
      <StatCard title="Order Failures %" value={m.orderFailureRate ?? 0} />
      <StatCard title="Avg Process ms" value={m.avgOrderProcessingMs ?? 0} />
      <StatCard title="Active Orders" value={m.activeOrders ?? 0} />
    </div>
  );
}

