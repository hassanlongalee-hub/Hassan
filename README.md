# Habit Tracker (Next.js + Supabase)

A mobile-first habit tracking app with email auth, daily completion logging, streak tracking, and completion history.

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)

## Features

- Email/password authentication with Supabase Auth.
- Dashboard showing today's habits.
- Create new habits.
- Habit detail page with completion history.
- Mark a habit as complete once per day.
- Streak and total completed days statistics.
- Basic loading and error states.
- Minimal mobile-first UI.

## Supabase setup

1. Create a new Supabase project.
2. In Supabase SQL Editor, run:

   ```sql
   -- paste contents of supabase/schema.sql
   ```

3. In **Authentication > Providers**, ensure **Email** provider is enabled.
4. Optional: disable email confirmation for faster local testing in **Authentication > Settings**.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create env file:

   ```bash
   cp .env.example .env.local
   ```

3. Fill `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start dev server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

6. Run streak utility tests:

   ```bash
   npm run test
   ```


## App routes

- `/` — landing page
- `/auth` — sign in/sign up
- `/dashboard` — today's habits
- `/habits/new` — create habit
- `/habits/[id]` — habit detail + history

## Notes

- Daily completion is enforced by a unique constraint on `(habit_id, user_id, completed_on)`.
- RLS policies ensure users can only access their own habits and logs.
