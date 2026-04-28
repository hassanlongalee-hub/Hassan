export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_on: string;
  created_at: string;
};
