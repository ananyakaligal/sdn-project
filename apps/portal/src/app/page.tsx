// No changes needed; the code is already clean and optimized.
"use client";

import { useMemo, useState } from "react";

type Service = "inventory" | "orders" | "payments" | "users" | "notifications";

const SERVICE_KEYS: Record<Service, string[]> = {
  inventory: [
    "stockLevel",
    "stockOutEvents",
    "avgStockQueryMs",
    "stockUpdateRate",
    "inventorySyncErrors",
  ],
  orders: [
    "activeOrders",
    "ordersPerMin",
    "orderUpdateRate",
    "orderFailureRate",
    "avgOrderProcessingMs",
  ],
  payments: [
    "activePaymentSessions",
    "paymentsPerMin",
    "paymentFailureRate",
    "refundRate",
    "avgPaymentProcessingMs",
  ],
  users: [
    "activeUsers",
    "authSuccessRate",
    "authFailureRate",
    "profileUpdateRate",
    "avgLoginResponseMs",
  ],
  notifications: [
    "notificationsPerMin",
    "activeQueues",
    "notificationFailureRate",
    "retryCount",
    "avgDeliveryMs",
  ],
};

const API_BASE = "/api/manager";

export default function Home() {
  const [service, setService] = useState<Service>("inventory");
  const keys = useMemo(() => SERVICE_KEYS[service], [service]);
  const [key, setKey] = useState<string>(keys[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const fetchMetric = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
  const url = `${API_BASE}?service=${encodeURIComponent(service)}&key=${encodeURIComponent(key)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      setData(json);
      setHistory((h) => [{
        ts: new Date().toLocaleTimeString(),
        service: json.service,
        key: json.key,
        value: json.value,
      }, ...h].slice(0, 10));
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">SNMP Metrics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Query your agents through the Manager API.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Service</label>
            <select
              className="rounded-md border border-gray-300 bg-white/80 dark:bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={service}
              onChange={(e) => {
                const s = e.target.value as Service;
                setService(s);
                const firstKey = SERVICE_KEYS[s][0];
                setKey(firstKey);
              }}
            >
              {Object.keys(SERVICE_KEYS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Metric</label>
            <select
              className="rounded-md border border-gray-300 bg-white/80 dark:bg-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            >
              {keys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchMetric}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-4 py-2 h-[42px] shadow-sm transition-colors"
            >
              {loading ? "Fetching..." : "Fetch Metric"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200/60 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5">
            <h2 className="text-lg font-medium mb-3">Result</h2>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            {!error && !data && (
              <div className="text-sm text-gray-500">No data yet. Choose a metric and click Fetch.</div>
            )}
            {data && (
              <div className="text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Service</div>
                  <div className="col-span-2">{data.service}</div>
                  <div className="text-gray-500">Metric</div>
                  <div className="col-span-2">{data.key}</div>
                  <div className="text-gray-500">Value</div>
                  <div className="col-span-2 text-2xl font-semibold">{String(data.value)}</div>
                  <div className="text-gray-500">Time</div>
                  <div className="col-span-2">{new Date(data.timestamp).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200/60 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5">
            <h2 className="text-lg font-medium mb-3">Recent queries</h2>
            {history.length === 0 ? (
              <div className="text-sm text-gray-500">No queries yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th className="py-1 pr-4">Time</th>
                      <th className="py-1 pr-4">Service</th>
                      <th className="py-1 pr-4">Metric</th>
                      <th className="py-1 pr-0">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200/50 dark:border-white/10">
                        <td className="py-2 pr-4 whitespace-nowrap">{row.ts}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{row.service}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{row.key}</td>
                        <td className="py-2 pr-0 whitespace-nowrap font-medium">{String(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
