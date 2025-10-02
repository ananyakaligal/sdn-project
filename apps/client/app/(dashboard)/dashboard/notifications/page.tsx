"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

export default function NotificationsPage() {
  const { data, isLoading, error } = useSWR('/api/metrics/notifications', fetcher, { refreshInterval: 5000 });
  if (isLoading) return <div className="h-24 rounded bg-muted animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const m = data ?? {};
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
      <StatCard title="Notifications / min" value={m.perMin ?? 0} />
      <StatCard title="Failure %" value={m.notificationFailureRate ?? m.failureRate ?? 0} />
      <StatCard title="Avg Delivery ms" value={m.avgDeliveryMs ?? 0} />
      <StatCard title="Active Queues" value={m.activeQueues ?? 0} />
      <StatCard title="Retries" value={m.retryCount ?? 0} />
    </div>
  );
}

