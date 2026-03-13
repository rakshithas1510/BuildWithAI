import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus, Zap } from 'lucide-react';
import type { Skill } from '../../backend';

interface SkillsStepProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export default function SkillsStep({ skills, onChange }: SkillsStepProps) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const id = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (skills.some((s) => s.id === id)) {
      setInputValue('');
      return;
    }
    const newSkill: Skill = { id, name: trimmed, level: BigInt(1) };
    onChange([...skills, newSkill]);
    setInputValue('');
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const SUGGESTED = ['JavaScript', 'Python', 'React', 'SQL', 'Git', 'TypeScript', 'CSS', 'Node.js'];
  const unusedSuggestions = SUGGESTED.filter(
    (s) => !skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto">
          <Zap className="text-neon" size={24} />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">What skills do you have?</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Add your current skills so we can identify gaps and personalize your plan.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Add a Skill</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. JavaScript, Python, SQL..."
            className="bg-surface-2 border-border text-foreground placeholder:text-muted-foreground focus:ring-neon focus:border-neon flex-1"
          />
          <Button
            type="button"
            onClick={addSkill}
            disabled={!inputValue.trim()}
            className="bg-neon text-charcoal hover:bg-neon/90 font-semibold px-4"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Current Skills */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Your Skills ({skills.length})</Label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-2 border border-border min-h-[60px]">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon/10 border border-neon/30 text-neon text-sm font-medium"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="hover:text-foreground transition-colors ml-0.5"
                  aria-label={`Remove ${skill.name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Quick Add</Label>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const id = s.toLowerCase().replace(/\s+/g, '-');
                  onChange([...skills, { id, name: s, level: BigInt(1) }]);
                }}
                className="px-3 py-1.5 rounded-full bg-surface-2 border border-border text-muted-foreground text-sm hover:border-neon/40 hover:text-neon transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
