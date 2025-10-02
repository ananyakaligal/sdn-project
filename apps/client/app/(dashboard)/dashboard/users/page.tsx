"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { MetricChart } from '@/components/dashboard/MetricChart';

export default function UsersPage() {
  const { data, isLoading, error } = useSWR('/api/metrics/users', fetcher, { refreshInterval: 5000 });
  if (isLoading) return <div className="h-24 rounded bg-muted animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const m = data ?? {};
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <StatCard title="Active Users" value={m.active ?? 0} />
        <StatCard title="Auth Success %" value={m.authSuccessRate ?? 0} />
        <StatCard title="Auth Failure %" value={m.authFailureRate ?? 0} />
        <StatCard title="Avg Login ms" value={m.avgLoginResponseMs ?? 0} />
        <StatCard title="Profile Updates" value={m.profileUpdateRate ?? 0} />
      </div>
      <MetricChart title="Active Users vs Orders" seriesAKey="users" seriesBKey="orders" />
    </div>
  );
}

