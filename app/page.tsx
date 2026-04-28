import Link from 'next/link';
import { Card } from '@/components/Card';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-16">
      <Card className="space-y-4 text-center">
        <p className="text-sm font-medium text-slate-500">Habit Tracker</p>
        <h1 className="text-3xl font-bold text-slate-900">Build better days, one check-in at a time.</h1>
        <p className="text-sm text-slate-600">Simple daily habits, streaks, and progress that feels rewarding.</p>
        <Link
          href="/auth"
          className="block rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Get started
        </Link>
      </Card>
    </div>
  );
}
