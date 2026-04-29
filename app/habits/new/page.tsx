'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';

export default function NewHabitPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth');
      }
    };

    checkUser();
  }, [router]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/auth');
      return;
    }

    const { error: createError } = await supabase.from('habits').insert({
      user_id: user.id,
      name,
      description: description || null
    });

    if (createError) {
      setError(createError.message);
      setLoading(false);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 pt-2">
      <Link href="/dashboard" className="text-sm font-medium text-slate-500">
        ← Back
      </Link>
      <Card className="space-y-4">
        <h1 className="text-xl font-semibold">Create habit</h1>
        <form className="space-y-3" onSubmit={handleCreate}>
          <Input
            label="Habit name"
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Read 10 pages"
          />
          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              maxLength={200}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="When and how you want to complete it"
            />
          </div>
          {error ? <p className="rounded-2xl bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}
          <Button type="submit" isLoading={loading}>
            Save habit
          </Button>
        </form>
      </Card>
    </div>
  );
}
