// No changes needed; the code is already clean and optimized.
"use client";

import { useMemo } from "react";

type Service = "inventory" | "orders" | "payments" | "users" | "notifications";


import React, { useState, useEffect } from "react";

const ServiceIcons: { [key: string]: React.ReactNode } = {
  inventory: <span role="img" aria-label="Inventory">📦</span>,
  orders: <span role="img" aria-label="Orders">📝</span>,
  payments: <span role="img" aria-label="Payments">💳</span>,
  users: <span role="img" aria-label="Users">👤</span>,
  notifications: <span role="img" aria-label="Notifications">🔔</span>,
};

const AGENT_STATUS: { [key: string]: "online" | "offline" } = {
  inventory: "online",
  orders: "online",
  payments: "offline",
  users: "online",
  notifications: "online",
};

const STATUS_COLORS: { [key: string]: string } = {
  online: "bg-green-500",
  offline: "bg-red-500",
};

const services = [
  "inventory",
  "orders",
  "payments",
  "users",
  "notifications",
];
const metrics: { [key: string]: string[] } = {
  inventory: [
    "avgStockQueryMs",
    "inventorySyncErrors",
    "stockLevel",
    "stockOutEvents",
    "stockUpdateRate",
  ],
  orders: [
    "activeOrders",
    "avgOrderProcessingMs",
    "orderFailureRate",
    "ordersPerMin",
    "orderUpdateRate",
  ],
  payments: [
    "activePaymentSessions",
    "avgPaymentProcessingMs",
    "paymentFailureRate",
    "paymentsPerMin",
    "refundRate",
  ],
  users: [
    "activeUsers",
    "authFailureRate",
    "authSuccessRate",
    "avgLoginResponseMs",
    "profileUpdateRate",
  ],
  notifications: [
    "activeQueues",
    "avgDeliveryMs",
    "notificationFailureRate",
    "notificationsPerMin",
    "retryCount",
  ],
};

const API_BASE = "/api/manager";


export default function Home() {
  const [service, setService] = useState("inventory");
  const [metric, setMetric] = useState("avgStockQueryMs");
  const [result, setResult] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [theme, setTheme] = useState("dark");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [history, setHistory] = useState<any[]>([]); // For chart
  // Hydration-safe state for uptime and last response
  const [uptime, setUptime] = useState<number>(0);
  const [lastResponse, setLastResponse] = useState<string>("");

  useEffect(() => {
    // Only run on client
    setUptime(Math.floor(Math.random() * 100));
    setLastResponse(new Date().toLocaleTimeString());
  }, [service]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(() => fetchMetric(), 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [autoRefresh, service, metric]);

  const fetchMetric = async () => {
    try {
      const res = await fetch(
        `${API_BASE}?service=${service}&metric=${metric}`
      );
      const data = await res.json();
      const entry = { ...data, service, metric, time: new Date() };
      setResult(entry);
      setRecent([entry, ...recent.slice(0, 4)]);
      setHistory([...history.slice(-19), entry]);
    } catch (e) {
      // Optionally show error notification
    }
  };

  // Simple chart stub (replace with a real chart library like recharts or chart.js)
  const Chart = () => (
    <div className="h-40 w-full flex items-end gap-1 bg-gray-800 rounded-lg p-2 mt-2">
      {history.length > 1 ? (
        history.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-blue-500 rounded"
            style={{ height: `${Math.max(10, Math.min(100, Number(h.value)))}px` }}
            title={`${h.value} at ${h.time.toLocaleTimeString()}`}
          ></div>
        ))
      ) : (
        <div className="text-gray-400 mx-auto">No data yet</div>
      )}
    </div>
  );

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex"
          : "min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 flex"
      }
    >
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-gray-950 bg-opacity-90 flex flex-col gap-8 border-r border-gray-800 min-h-screen">
        <div>
          <h1 className="text-3xl font-bold mb-2">SNMP Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor your agents in real time.</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800 font-semibold bg-gray-800/60">Dashboard</button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800">Agents</button>
          <button className="text-left px-3 py-2 rounded hover:bg-gray-800">Settings</button>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-sm">Theme:</span>
          <button
            className={
              theme === "dark"
                ? "bg-gray-700 text-white px-2 py-1 rounded"
                : "bg-gray-200 text-gray-900 px-2 py-1 rounded"
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10 flex flex-col gap-8">
        {/* Top controls */}
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="block mb-1 font-semibold">Service</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{ServiceIcons[service]}</span>
              <select
                className="w-40 p-2 rounded bg-gray-700 text-white"
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setMetric(metrics[e.target.value][0]);
                }}
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              {/* Agent status */}
              <span
                className={`ml-2 w-3 h-3 rounded-full inline-block ${STATUS_COLORS[AGENT_STATUS[service]]}`}
                title={AGENT_STATUS[service]}
              ></span>
              <span className="ml-1 text-xs text-gray-400">{AGENT_STATUS[service]}</span>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Metric</label>
            <select
              className="w-56 p-2 rounded bg-gray-700 text-white"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              {metrics[service].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded text-lg font-semibold shadow-lg"
            onClick={fetchMetric}
          >
            Fetch Metric
          </button>
          <label className="flex items-center gap-2 ml-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="accent-blue-600"
            />
            <span className="text-sm">Auto-refresh (5s)</span>
          </label>
        </div>

        {/* Agent details card */}
        <div className="flex gap-6 mb-2">
          <div className="bg-gray-700/80 rounded-xl p-6 flex flex-col gap-2 w-72 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{ServiceIcons[service]}</span>
              <span className="text-lg font-bold">{service.charAt(0).toUpperCase() + service.slice(1)} Agent</span>
              <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[AGENT_STATUS[service]]}`}></span>
            </div>
            <div className="text-sm text-gray-300">Status: <span className="font-semibold">{AGENT_STATUS[service]}</span></div>
            <div className="text-sm text-gray-300">IP: <span className="font-mono">192.168.1.{services.indexOf(service) + 10}</span></div>
            <div className="text-sm text-gray-300">Uptime: <span className="font-mono">{uptime}h</span></div>
            <div className="text-sm text-gray-300">Last response: <span className="font-mono">{lastResponse}</span></div>
          </div>
          {/* Metric chart */}
          <div className="flex-1 bg-gray-700/80 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold">{metric}</span>
              <span className="text-xs text-gray-400">(last 20 queries)</span>
            </div>
            <Chart />
          </div>
        </div>

        {/* Results and recent queries */}
        <div className="flex gap-8">
          <div className="flex-1 bg-gray-600 bg-opacity-60 rounded-xl p-8 mb-8 shadow-lg">
            <h2 className="text-3xl font-light mb-4">Result</h2>
            {result ? (
              <div>
                <div className="mb-2">
                  <span className="text-gray-300">Service</span>
                  <span className="ml-2 font-semibold">{result.service}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-300">Metric</span>
                  <span className="ml-2 font-semibold">{result.metric}</span>
                </div>
                <div className="mb-2 flex items-end gap-2">
                  <span className="text-gray-300">Value</span>
                  <span className="ml-2 text-4xl font-bold animate-pulse">{result.value}</span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-300">Time</span>
                  <span className="ml-2 font-mono">
                    {result.time.toLocaleString()}
                  </span>
                </div>
                <button className="mt-4 px-4 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold">Export as CSV</button>
              </div>
            ) : (
              <div className="text-gray-400">No result yet. Fetch a metric!</div>
            )}
          </div>
          <div className="flex-1 bg-gray-600 bg-opacity-60 rounded-xl p-8 mb-8 shadow-lg">
            <h2 className="text-3xl font-light mb-4">Recent queries</h2>
            <div className="grid grid-cols-4 gap-2 text-gray-300 mb-2">
              <div>Time</div>
              <div>Service</div>
              <div>Metric</div>
              <div>Value</div>
            </div>
            {recent.length ? (
              recent.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 border-b border-gray-500/30 py-1 hover:bg-gray-700/40 rounded"
                >
                  <div className="font-mono text-sm">{r.time.toLocaleTimeString()}</div>
                  <div>{r.service}</div>
                  <div>{r.metric}</div>
                  <div>{r.value}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 col-span-4">No recent queries.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
// ...existing code...
