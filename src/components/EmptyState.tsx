import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-white/70 p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-lg bg-campus/10 text-campus">
        <Icon size={24} aria-hidden />
      </div>
      <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/65">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
