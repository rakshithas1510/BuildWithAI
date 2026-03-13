import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

const JOB_ROLES = [
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'DevOps Engineer',
  'UX Designer',
  'Mobile Developer',
  'Machine Learning Engineer',
];

interface JobRoleStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobRoleStep({ value, onChange }: JobRoleStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto">
          <Briefcase className="text-neon" size={24} />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">What's your target role?</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Choose the job role you're working toward. We'll tailor your study plan accordingly.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Target Job Role</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-surface-2 border-border text-foreground h-12 focus:ring-neon focus:border-neon">
            <SelectValue placeholder="Select a job role..." />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            {JOB_ROLES.map((role) => (
              <SelectItem
                key={role}
                value={role}
                className="text-foreground hover:bg-neon/10 focus:bg-neon/10 focus:text-neon cursor-pointer"
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {value && (
        <div className="p-4 rounded-xl bg-neon/5 border border-neon/20">
          <p className="text-sm text-neon font-medium">✓ Great choice!</p>
          <p className="text-xs text-muted-foreground mt-1">
            We'll build a personalized study plan for <strong className="text-foreground">{value}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
