"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

type Props = { title: string; seriesAKey: 'users' | 'orders'; seriesBKey: 'users' | 'orders' };

export function MetricChart({ title, seriesAKey, seriesBKey }: Props) {
  const { data } = useSWR('/api/metrics', fetcher, { refreshInterval: 5000 });
  const [history, setHistory] = useState<{ ts: number; users: number; orders: number }[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    const point = {
      ts: Date.now(),
      users: data?.users?.active ?? 0,
      orders: data?.orders?.perMin ?? 0,
    };
    setHistory((prev) => {
      const next = [...prev, point].slice(-30);
      return next;
    });
  }, [data]);

  const chartData = useMemo(
    () =>
      history.map((p) => ({
        time: new Date(p.ts).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
        users: p.users,
        orders: p.orders,
      })),
    [history],
  );

  return (
    <div className="rounded border p-4">
      <div className="font-medium mb-2">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={seriesAKey} stroke="#3b82f6" fill="url(#colorA)" name="Users" />
            <Area type="monotone" dataKey={seriesBKey} stroke="#10b981" fill="url(#colorB)" name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

