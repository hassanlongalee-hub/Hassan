type ProgressCircleProps = {
  value: number;
  total: number;
};

export function ProgressCircle({ value, total }: ProgressCircleProps) {
  const safeTotal = total === 0 ? 1 : total;
  const percentage = Math.round((value / safeTotal) * 100);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90">
        <circle cx="44" cy="44" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          stroke="#0f172a"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-bold text-slate-900">{percentage}%</p>
        <p className="text-[10px] text-slate-500">today</p>
      </div>
    </div>
  );
}
