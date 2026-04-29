'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Habit, HabitLog } from '@/lib/types';
import { getTodayDateString } from '@/lib/date';
import { calculateStats, hasCompletionOnDate } from '@/lib/streak';
import { HabitCard } from '@/components/HabitCard';
import { Card } from '@/components/Card';
import { ProgressCircle } from '@/components/ProgressCircle';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);

  const today = getTodayDateString();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/auth');
      return;
    }

    setUserId(user.id);

    const [habitResponse, logResponse] = await Promise.all([
      supabase.from('habits').select('*').order('created_at', { ascending: false }),
      supabase.from('habit_logs').select('*').order('completed_on', { ascending: false })
    ]);

    if (habitResponse.error || logResponse.error) {
      setError(habitResponse.error?.message ?? logResponse.error?.message ?? 'Failed to fetch habits.');
      setLoading(false);
      return;
    }

    setHabits(habitResponse.data as Habit[]);
    setLogs(logResponse.data as HabitLog[]);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logsByHabit = useMemo(() => {
    return logs.reduce<Record<string, HabitLog[]>>((acc, log) => {
      acc[log.habit_id] = acc[log.habit_id] ? [...acc[log.habit_id], log] : [log];
      return acc;
    }, {});
  }, [logs]);

  const completedTodayCount = useMemo(() => {
    return habits.filter((habit) => (logsByHabit[habit.id] ?? []).some((log) => log.completed_on === today)).length;
  }, [habits, logsByHabit, today]);

  const handleCompleteHabit = async (habitId: string) => {
    if (!userId) return;

    setLoadingHabitId(habitId);
    setError(null);

    const existingDates = (logsByHabit[habitId] ?? []).map((log) => log.completed_on);

    if (hasCompletionOnDate(existingDates, today)) {
      setError('Habit is already completed for today.');
      setLoadingHabitId(null);
      return;
    }

    const { error: insertError } = await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: userId,
      completed_on: today
    });

    if (insertError) {
      setError(insertError.message.includes('duplicate') ? 'Habit is already completed for today.' : insertError.message);
      setLoadingHabitId(null);
      return;
    }

    await fetchData();
    setLoadingHabitId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  if (loading) {
    return <p className="pt-10 text-center text-sm text-slate-600">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-4 pb-4">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Today</h1>
          <button
            type="button"
            onClick={signOut}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
          >
            Sign out
          </button>
        </div>

        <Card className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Daily progress</p>
            <p className="mt-1 text-sm text-slate-600">
              {completedTodayCount} of {habits.length} completed
            </p>
            <Link href="/habits/new" className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              + New habit
            </Link>
          </div>
          <ProgressCircle value={completedTodayCount} total={habits.length} />
        </Card>
      </header>

      {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      {habits.length === 0 ? (
        <Card className="space-y-2 py-8 text-center">
          <p className="text-3xl">🌱</p>
          <p className="text-sm font-semibold text-slate-900">No habits yet</p>
          <p className="text-sm text-slate-600">Start with one small daily action and build your streak.</p>
          <Link href="/habits/new" className="mx-auto mt-2 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            Create your first habit
          </Link>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {habits.map((habit) => {
            const habitLogs = logsByHabit[habit.id] ?? [];
            const completedToday = habitLogs.some((log) => log.completed_on === today);
            const stats = calculateStats(habitLogs.map((log) => log.completed_on));

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                completedToday={completedToday}
                streak={stats.streak}
                totalCompletedDays={stats.totalCompletedDays}
                onComplete={handleCompleteHabit}
                loadingHabitId={loadingHabitId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
