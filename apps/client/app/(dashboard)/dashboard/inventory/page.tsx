"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';

export default function InventoryPage() {
  const { data, isLoading, error } = useSWR('/api/metrics/inventory', fetcher, { refreshInterval: 5000 });
  if (isLoading) return <div className="h-24 rounded bg-muted animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const m = data ?? {};
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
      <StatCard title="Stock Level" value={m.stockLevel ?? 0} />
      <StatCard title="Stock Updates" value={m.stockUpdateRate ?? 0} />
      <StatCard title="Stock-outs" value={m.stockOutEvents ?? 0} />
      <StatCard title="Sync Errors" value={m.inventorySyncErrors ?? 0} />
      <StatCard title="Avg Query ms" value={m.avgStockQueryMs ?? 0} />
    </div>
  );
}

