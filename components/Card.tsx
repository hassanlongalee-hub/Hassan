import clsx from 'clsx';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section className={clsx('rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]', className)}>
      {children}
    </section>
  );
}
