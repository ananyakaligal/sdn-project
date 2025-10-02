import Link from 'next/link';

const sections = [
  { href: '/dashboard/users', label: 'User' },
  { href: '/dashboard/orders', label: 'Order' },
  { href: '/dashboard/inventory', label: 'Inventory' },
  { href: '/dashboard/payments', label: 'Payment' },
  { href: '/dashboard/notifications', label: 'Notification' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-muted p-4 space-y-2">
        <div className="font-semibold text-lg mb-3">SNMP Dashboard</div>
        <Link href="/dashboard" className="block px-2 py-1 rounded hover:bg-muted">Overview</Link>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="block px-2 py-1 rounded hover:bg-muted">
            {s.label}
          </Link>
        ))}
      </aside>
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">Service Health</div>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}

function ThemeToggle() {
  return (
    <button
      className="px-3 py-1.5 rounded border hover:bg-muted"
      onClick={() => {
        if (typeof document === 'undefined') return;
        document.documentElement.classList.toggle('dark');
      }}
    >
      Toggle theme
    </button>
  );
}

