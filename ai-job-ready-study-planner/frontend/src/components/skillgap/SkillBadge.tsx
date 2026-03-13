import { Plus } from 'lucide-react';

interface SkillBadgeProps {
  name: string;
  matched: boolean;
  onAdd?: () => void;
  isAdding?: boolean;
}

export default function SkillBadge({ name, matched, onAdd, isAdding }: SkillBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
        matched
          ? 'bg-neon/10 border-neon/30 text-neon'
          : 'bg-destructive/10 border-destructive/30 text-destructive'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${matched ? 'bg-neon' : 'bg-destructive'}`}
      />
      <span className="flex-1">{name}</span>
      {!matched && onAdd && (
        <button
          onClick={onAdd}
          disabled={isAdding}
          className="ml-1 p-0.5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50"
          aria-label={`Add ${name} to skills`}
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
}
