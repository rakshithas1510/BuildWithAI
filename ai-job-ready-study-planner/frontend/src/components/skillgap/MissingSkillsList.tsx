import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import SkillBadge from './SkillBadge';
import type { Skill } from '../../backend';

interface MissingSkillsListProps {
  missingSkills: Skill[];
  onAddSkill: (skill: Skill) => Promise<void>;
}

export default function MissingSkillsList({ missingSkills, onAddSkill }: MissingSkillsListProps) {
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = async (skill: Skill) => {
    setAddingIds((prev) => new Set(prev).add(skill.id));
    try {
      await onAddSkill(skill);
      setAddedIds((prev) => new Set(prev).add(skill.id));
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(skill.id);
        return next;
      });
    }
  };

  if (missingSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="text-neon mb-3" size={32} />
        <p className="text-foreground font-medium">No skill gaps!</p>
        <p className="text-muted-foreground text-sm mt-1">You have all required skills for this role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {missingSkills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-3">
          {addedIds.has(skill.id) ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neon/30 bg-neon/10 text-neon text-sm font-medium flex-1">
              <CheckCircle2 size={14} />
              <span>{skill.name}</span>
              <span className="text-xs ml-auto">Added!</span>
            </div>
          ) : (
            <div className="flex-1">
              <SkillBadge
                name={skill.name}
                matched={false}
                onAdd={() => handleAdd(skill)}
                isAdding={addingIds.has(skill.id)}
              />
            </div>
          )}
          {addingIds.has(skill.id) && (
            <Loader2 size={14} className="text-muted-foreground animate-spin flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
