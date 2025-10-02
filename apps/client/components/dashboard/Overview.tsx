"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from './StatCard';
import { MetricChart } from './MetricChart';
import { EventsTable } from './EventsTable';

export default function Overview() {
  const { data, isLoading, error } = useSWR('/api/metrics', fetcher, {
    refreshInterval: 5000,
  });

  if (isLoading) return <div className="grid gap-4 grid-cols-1 md:grid-cols-5">{[...Array(5)].map((_,i)=>(<div key={i} className="h-24 rounded bg-muted animate-pulse" />))}</div>;
  if (error) return <div className="text-red-600">Failed to load metrics</div>;

  const usersActive = data?.users?.active ?? 0;
  const ordersPerMin = data?.orders?.perMin ?? 0;
  const paymentsPerMin = data?.payments?.perMin ?? 0;
  const notificationsPerMin = data?.notifications?.perMin ?? 0;
  const inventoryStockOut = data?.inventory?.stockOutEvents ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <StatCard title="Active Users" value={usersActive} />
        <StatCard title="Orders / min" value={ordersPerMin} />
        <StatCard title="Payments / min" value={paymentsPerMin} />
        <StatCard title="Notifications / min" value={notificationsPerMin} />
        <StatCard title="Stock-outs" value={inventoryStockOut} />
      </div>

      <MetricChart title="Users & Orders" seriesAKey="users" seriesBKey="orders" />

      <EventsTable />
    </div>
  );
}

