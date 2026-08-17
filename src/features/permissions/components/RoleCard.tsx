"use client";

import { Shield, ShieldAlert, Users, CheckCircle2 } from "lucide-react";
import { Role } from "@/types/permissions";
import { Card, CardContent } from "@/components/ui/card";
import { ALL_PERMISSIONS } from "@/constants/permissions";

interface RoleCardProps {
  role: Role;
  isSelected: boolean;
  onSelect: (roleId: string) => void;
}

export default function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
  const totalSystemPermissions = ALL_PERMISSIONS.length;
  const assignedCount = role.permissions.length;
  const coveragePercentage = Math.round((assignedCount / totalSystemPermissions) * 100);

  return (
    <Card
      onClick={() => onSelect(role.id)}
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border-2 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-primary/50 hover:bg-accent/40"
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                role.isSystemRole
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {role.isSystemRole ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <Shield className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight truncate">{role.name}</h3>
              {role.isSystemRole ? (
                <span className="inline-block mt-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  System Role
                </span>
              ) : (
                <span className="inline-block mt-0.5 text-[11px] font-medium text-muted-foreground">
                  Custom Role
                </span>
              )}
            </div>
          </div>

          {isSelected && (
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
          {role.description}
        </p>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{role.userCount} users</span>
          </div>

          <div className="font-medium">
            <span className="text-foreground">{assignedCount}</span> / {totalSystemPermissions} scopes ({coveragePercentage}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
