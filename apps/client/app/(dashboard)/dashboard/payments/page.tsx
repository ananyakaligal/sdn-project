"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

export default function PaymentsPage() {
  const { data, isLoading, error } = useSWR('/api/metrics/payments', fetcher, { refreshInterval: 5000 });
  if (isLoading) return <div className="h-24 rounded bg-muted animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const m = data ?? {};
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
      <StatCard title="Payments / min" value={m.perMin ?? 0} />
      <StatCard title="Failure %" value={m.failureRate ?? 0} />
      <StatCard title="Avg Process ms" value={m.avgPaymentProcessingMs ?? 0} />
      <StatCard title="Active Sessions" value={m.activePaymentSessions ?? 0} />
      <StatCard title="Refund %" value={m.refundRate ?? 0} />
    </div>
  );
}

