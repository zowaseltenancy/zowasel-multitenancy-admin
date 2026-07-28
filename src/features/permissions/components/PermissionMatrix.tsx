"use client";

import { Badge, ShieldAlert } from "lucide-react";
import { Role, PermissionCategoryGroup } from "@/types/permissions";
import { Checkbox } from "@/components/ui/checkbox";

interface PermissionMatrixProps {
  roles: Role[];
  selectedRole: Role;
  filteredGroups: PermissionCategoryGroup[];
  onTogglePermission: (roleId: string, permissionCode: string) => void;
}

export default function PermissionMatrix({
  roles,
  selectedRole,
  filteredGroups,
  onTogglePermission,
}: PermissionMatrixProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider w-80 min-w-[280px]">
                Permission Scope / Category
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className={`p-4 font-semibold text-center min-w-[140px] max-w-[180px] border-l ${
                    role.id === selectedRole.id ? "bg-primary/5 border-primary/30" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-foreground text-xs leading-tight">
                        {role.name}
                      </span>
                      {role.isSystemRole && (
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {role.permissions.length} scopes active
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length === 0 ? (
              <tr>
                <td
                  colSpan={roles.length + 1}
                  className="p-8 text-center text-muted-foreground"
                >
                  No permission scopes match your search or filter.
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => {
                return (
                  <tr key={group.category} className="border-b">
                    <td colSpan={roles.length + 1} className="p-0">
                      <div className="bg-accent/40 px-4 py-2.5 flex items-center justify-between border-b">
                        <div>
                          <span className="font-semibold text-xs text-foreground">
                            {group.label}
                          </span>
                          <span className="ml-2 text-[11px] text-muted-foreground hidden sm:inline">
                            ({group.description})
                          </span>
                        </div>
                      </div>

                      <table className="w-full text-left text-xs">
                        <tbody>
                          {group.permissions.map((permission) => (
                            <tr
                              key={permission.code}
                              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                            >
                              <td className="p-3.5 w-80 min-w-[280px]">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground text-xs">
                                      {permission.name}
                                    </span>
                                    <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                      {permission.code}
                                    </code>
                                    {permission.isSensitive && (
                                      <Badge
                                        className="text-[9px] px-1 py-0 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                      >
                                        Sensitive
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </td>

                              {roles.map((role) => {
                                const isGranted = role.permissions.includes(permission.code);
                                const isSelectedColumn = role.id === selectedRole.id;

                                return (
                                  <td
                                    key={role.id}
                                    className={`p-3 text-center border-l min-w-[140px] max-w-[180px] align-middle ${
                                      isSelectedColumn ? "bg-primary/5" : ""
                                    }`}
                                  >
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={isGranted}
                                        disabled={role.isSystemRole}
                                        onCheckedChange={() =>
                                          onTogglePermission(role.id, permission.code)
                                        }
                                        className="h-4 w-4"
                                      />
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
