import { Button } from '@/components/ui/button';
import { Department, StaffMember } from '@/types/staff';

interface DepartmentHeadInfoProps {
  dept: Department;
  head: StaffMember | null;
  onEdit: (dept: Department) => void;
}

export function DepartmentHeadInfo({ dept, head, onEdit }: DepartmentHeadInfoProps) {
  const headInitials = head
    ? `${head.firstName?.[0] || ''}${head.lastName?.[0] || ''}`.toUpperCase()
    : null;

  return (
    <div className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-1">
      <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
        Department Head
      </p>

      {head ? (
        <div className="flex items-center gap-2.5 pt-0.5">
          {head.avatarUrl ? (
            <img
              src={head.avatarUrl}
              alt={head.firstName}
              className="h-7 w-7 rounded-full object-cover border shrink-0"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-muted-foreground/10 text-foreground font-semibold text-[11px] flex items-center justify-center shrink-0 border">
              {headInitials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">
              {head.firstName} {head.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{head.email}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-muted-foreground italic">No Head Appointed</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] px-2 text-foreground hover:bg-muted"
            onClick={() => onEdit(dept)}
          >
            Appoint
          </Button>
        </div>
      )}
    </div>
  );
}