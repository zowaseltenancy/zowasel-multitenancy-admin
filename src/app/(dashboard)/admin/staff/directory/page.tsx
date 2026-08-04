"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, Search, Globe2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/features/users/hooks/useUsers";
import UserStatusBadge from "@/features/users/components/UserStatusBadge";
import UserAvatar from "@/components/shared/UserAvatar";
import { StaffDepartment } from "@/types/user";

const DEPARTMENTS: StaffDepartment[] = [
  "Executive",
  "Technology",
  "Programs",
  "Fintech",
  "Sales",
  "Finance",
  "Administration",
  "Compliance",
  "Regional Operations",
];

function jurisdictionLabel(staff: { geographicScopeLevel?: string; countryName?: string; subRegion?: string; continent?: string }) {
  if (staff.geographicScopeLevel === "continent") return "All of Africa";
  if (staff.geographicScopeLevel === "sub_region") return staff.countryName ?? staff.subRegion ?? "—";
  if (staff.geographicScopeLevel === "country") return staff.countryName ?? "—";
  return null;
}

export default function StaffDirectoryPage() {
  return (
    <Suspense fallback={null}>
      <StaffDirectoryContent />
    </Suspense>
  );
}

function StaffDirectoryContent() {
  const { users } = useUsers();
  const searchParams = useSearchParams();
  const initialDepartment = searchParams.get("department") as StaffDepartment | null;

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<StaffDepartment | "all">(
    initialDepartment && DEPARTMENTS.includes(initialDepartment) ? initialDepartment : "all"
  );

  const staffMembers = useMemo(() => {
    return users
      .filter((user) => user.userCategory === "staff")
      .filter((staff) => departmentFilter === "all" || staff.department === departmentFilter)
      .filter((staff) => {
        const query = search.toLowerCase().trim();
        return (
          query === "" ||
          staff.firstName.toLowerCase().includes(query) ||
          staff.lastName.toLowerCase().includes(query) ||
          staff.email.toLowerCase().includes(query) ||
          (staff.position && staff.position.toLowerCase().includes(query))
        );
      });
  }, [users, search, departmentFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal Zowasel staff, organized by department.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDepartmentFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              departmentFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Departments
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                departmentFilter === dept
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {staffMembers.length === 0 ? (
        <Card className="border shadow-2xs">
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No staff members match this filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="border shadow-2xs hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <UserAvatar
                  avatarUrl={staff.avatarUrl}
                  firstName={staff.firstName}
                  lastName={staff.lastName}
                  className="h-12 w-12 text-lg"
                />
                <div className="space-y-1 overflow-hidden">
                  <CardTitle className="text-base font-bold truncate">
                    {staff.firstName} {staff.lastName}
                  </CardTitle>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {staff.position || staff.role}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{staff.department ?? "Unassigned"}</span>
                </div>

                {jurisdictionLabel(staff) && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Globe2 className="h-3 w-3" /> Jurisdiction:
                    </span>
                    <span className="font-semibold text-foreground">{jurisdictionLabel(staff)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{staff.phone}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                  <span className="text-muted-foreground">Account Status:</span>
                  <UserStatusBadge status={staff.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
