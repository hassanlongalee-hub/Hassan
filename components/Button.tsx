import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function Button({ className, isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70',
        className
      )}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
