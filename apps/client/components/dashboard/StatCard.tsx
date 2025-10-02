"use client";
type Props = { title: string; value: number | string; hint?: string };
export function StatCard({ title, value, hint }: Props) {
  return (
    <div className="rounded border p-4 bg-card text-card-foreground">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold leading-tight">{value}</div>
      {hint ? <div className="text-xs text-muted-foreground mt-1">{hint}</div> : null}
    </div>
  );
}

