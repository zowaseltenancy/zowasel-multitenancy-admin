import { Lock, ShieldAlert, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PermissionsStatsCardsProps {
  totalScopes: number;
  sensitiveCount: number;
  categoriesCount: number;
  rolesCount: number;
}

export function PermissionsStatsCards({
  totalScopes,
  sensitiveCount,
  categoriesCount,
  rolesCount,
}: PermissionsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="bg-card border rounded-xl shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Scopes
            </p>
            <p className="text-2xl font-bold mt-1">{totalScopes}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border rounded-xl shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sensitive Keys
            </p>
            <p className="text-2xl font-bold text-destructive mt-1">{sensitiveCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border rounded-xl shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
            <p className="text-2xl font-bold mt-1">{categoriesCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border rounded-xl shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Roles Defined
            </p>
            <p className="text-2xl font-bold mt-1">{rolesCount}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}