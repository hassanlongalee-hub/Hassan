'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const action = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (action.error) {
      setError(action.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md space-y-4 pt-10">
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-slate-500">Habit Tracker</p>
        <h1 className="text-2xl font-bold text-slate-900">{isSignUp ? 'Create account' : 'Welcome back'}</h1>
      </div>

      <Card className="space-y-4">
        <p className="text-sm text-slate-600">Sign in with email to track your habits and streaks.</p>
        <form className="space-y-3" onSubmit={handleAuth}>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />
          {error ? <p className="rounded-2xl bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}
          <Button type="submit" isLoading={loading}>
            {isSignUp ? 'Create account' : 'Sign in'}
          </Button>
        </form>
        <button
          type="button"
          className="w-full text-center text-sm font-medium text-slate-600"
          onClick={() => setIsSignUp((current) => !current)}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </button>
      </Card>
    </div>
  );
}
