import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface StudyHoursStepProps {
  value: number;
  onChange: (value: number) => void;
}

const HOUR_OPTIONS = [5, 10, 15, 20, 30, 40];

export default function StudyHoursStep({ value, onChange }: StudyHoursStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto">
          <Clock className="text-neon" size={24} />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">How much time can you commit?</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Tell us your weekly study hours so we can create a realistic, achievable schedule.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Weekly Study Hours</Label>
        <div className="relative">
          <Input
            type="number"
            min={1}
            max={80}
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder="e.g. 10"
            className="bg-surface-2 border-border text-foreground placeholder:text-muted-foreground focus:ring-neon focus:border-neon h-12 text-lg pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            hrs/wk
          </span>
        </div>
      </div>

      {/* Quick select */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Quick Select</Label>
        <div className="grid grid-cols-3 gap-2">
          {HOUR_OPTIONS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onChange(h)}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                value === h
                  ? 'bg-neon/10 border-neon text-neon shadow-neon-sm'
                  : 'bg-surface-2 border-border text-muted-foreground hover:border-neon/40 hover:text-foreground'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {value > 0 && (
        <div className="p-4 rounded-xl bg-neon/5 border border-neon/20">
          <p className="text-sm text-neon font-medium">
            ✓ {value} hours/week — {value >= 20 ? 'Excellent commitment!' : value >= 10 ? 'Great pace!' : 'Good start!'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            That's approximately {Math.round(value / 7 * 10) / 10} hours per day.
          </p>
        </div>
      )}
    </div>
  );
}
