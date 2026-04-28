import Link from 'next/link';
import { Habit } from '@/lib/types';
import { Card } from './Card';
import { Button } from './Button';

type HabitCardProps = {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  totalCompletedDays: number;
  onComplete: (habitId: string) => Promise<void>;
  loadingHabitId: string | null;
};

export function HabitCard({
  habit,
  completedToday,
  streak,
  totalCompletedDays,
  onComplete,
  loadingHabitId
}: HabitCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/habits/${habit.id}`} className="text-base font-semibold text-slate-900">
            {habit.name}
          </Link>
          {habit.description ? <p className="mt-1 text-sm text-slate-600">{habit.description}</p> : null}
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">🔥 {streak}d</span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <p className="rounded-full bg-slate-100 px-3 py-1">Total completions: {totalCompletedDays}</p>
      </div>

      <Button
        onClick={() => onComplete(habit.id)}
        isLoading={loadingHabitId === habit.id}
        disabled={completedToday}
        className={completedToday ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
      >
        {completedToday ? 'Completed today' : 'Mark complete'}
      </Button>
    </Card>
  );
}
