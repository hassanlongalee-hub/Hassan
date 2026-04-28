'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { supabase } from '@/lib/supabase';
import { Habit, HabitLog } from '@/lib/types';
import { calculateStats } from '@/lib/streak';

export default function HabitDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHabit = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth');
        return;
      }

      const [habitResponse, logsResponse] = await Promise.all([
        supabase.from('habits').select('*').eq('id', params.id).single(),
        supabase.from('habit_logs').select('*').eq('habit_id', params.id).order('completed_on', { ascending: false })
      ]);

      if (habitResponse.error || logsResponse.error) {
        setError(habitResponse.error?.message ?? logsResponse.error?.message ?? 'Failed to load habit details.');
        setLoading(false);
        return;
      }

      setHabit(habitResponse.data as Habit);
      setLogs(logsResponse.data as HabitLog[]);
      setLoading(false);
    };

    loadHabit();
  }, [params.id, router]);

  const stats = useMemo(() => calculateStats(logs.map((log) => log.completed_on)), [logs]);

  if (loading) {
    return <p className="pt-10 text-center text-sm text-slate-600">Loading habit...</p>;
  }

  if (!habit) {
    return <p className="pt-10 text-center text-sm text-slate-600">Habit not found.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-4 pt-2">
      <Link href="/dashboard" className="text-sm font-medium text-slate-500">
        ← Back
      </Link>

      <Card className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">{habit.name}</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">🔥 {stats.streak}d streak</span>
        </div>
        {habit.description ? <p className="text-sm text-slate-600">{habit.description}</p> : null}
      </Card>

      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <Card className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Progress</h2>
        <p className="text-sm text-slate-600">✅ Total completed days: {stats.totalCompletedDays}</p>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Completion history</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-600">No completions yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {log.completed_on}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
