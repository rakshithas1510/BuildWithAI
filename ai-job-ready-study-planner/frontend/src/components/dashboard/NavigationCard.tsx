import { Link } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

export default function NavigationCard({
  to,
  icon: Icon,
  title,
  description,
  stat,
  statLabel,
}: NavigationCardProps) {
  return (
    <Link
      to={to}
      className="group block p-5 rounded-2xl bg-surface border border-border hover:border-neon/40 hover:shadow-neon-sm transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
          <Icon className="text-neon" size={18} />
        </div>
        {stat && (
          <div className="text-right">
            <div className="text-xl font-display font-bold text-neon">{stat}</div>
            {statLabel && <div className="text-xs text-muted-foreground">{statLabel}</div>}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-neon transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
    </Link>
  );
}
