"use client";
const mockEvents = [
  { id: 'e1', ts: new Date().toISOString(), message: 'User login succeeded', level: 'info' },
  { id: 'e2', ts: new Date().toISOString(), message: 'Order created', level: 'info' },
  { id: 'e3', ts: new Date().toISOString(), message: 'Payment processed', level: 'info' },
  { id: 'e4', ts: new Date().toISOString(), message: 'Notification retried', level: 'warn' },
];

export function EventsTable() {
  return (
    <div className="rounded border">
      <div className="p-3 font-medium">Recent events</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Level</th>
              <th className="px-3 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(e.ts).toLocaleString()}</td>
                <td className="px-3 py-2 uppercase text-xs">{e.level}</td>
                <td className="px-3 py-2">{e.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

