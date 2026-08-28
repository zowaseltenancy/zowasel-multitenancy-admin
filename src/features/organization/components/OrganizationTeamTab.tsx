'use client';

import { useMemo, useState } from 'react';
import { UserCheck, ShieldCheck, Users, Filter, Power } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Organization } from '@/types/organization';
import { statusBadgeClass, statusDotClass } from '@/lib/statusTone';
import GenderBadge from '@/components/shared/GenderBadge';
import TeamMembersCard from './TeamMembersCard';

interface Props {
  organization: Organization;

  onToggleOfficerStatus: (organizationId: string, officerId: string) => void;
}

export default function OrganizationTeamTab({
  organization,
  onToggleOfficerStatus,
}: Props) {
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  const keyOfficers = organization.keyOfficers ?? [];
  const teamMembers = organization.teamMembers ?? [];

  const availablePositions = useMemo(() => {
    const positions = keyOfficers.map((officer) => officer.position);
    return Array.from(new Set(positions));
  }, [keyOfficers]);

  const filteredOfficers = useMemo(() => {
    return keyOfficers.filter((officer) => {
      const matchesGender = genderFilter === 'all' || officer.gender === genderFilter;
      const matchesPosition = positionFilter === 'all' || officer.position === positionFilter;
      return matchesGender && matchesPosition;
    });
  }, [keyOfficers, genderFilter, positionFilter]);

  return (
    <div className="space-y-6">
      {/* The accounts with a login on this business. */}
      <TeamMembersCard members={teamMembers} />

      {/* Account Owner & Agent Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span>Primary Promoter & Account Owner</span>
            {organization.onboardedByAgent && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <UserCheck className="h-3.5 w-3.5" />
                Onboarded by {organization.onboardedByAgent.name}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">{organization.owner.name}</p>
            <p className="text-sm text-muted-foreground">{organization.owner.email}</p>
            <p className="text-xs text-muted-foreground">{organization.owner.phone}</p>
          </div>

          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Business Promoter
          </span>
        </CardContent>
      </Card>

      {/* Governance & Leadership Structure */}
      {organization.governanceStructure && (
        <Card className="border shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                {organization.type === 'cooperative'
                  ? 'Cooperative Governance Structure'
                  : 'Corporate Ownership & Board Structure'}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            {organization.governanceStructure.chairman && (
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Cooperative Chairman / Head</p>
                <p className="mt-1 font-medium">{organization.governanceStructure.chairman}</p>
              </div>
            )}

            {organization.governanceStructure.secretary && (
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-semibold uppercase">General Secretary</p>
                <p className="mt-1 font-medium">{organization.governanceStructure.secretary}</p>
              </div>
            )}

            {organization.governanceStructure.boardOfTrustees && (
              <div className="p-3 rounded-lg border bg-muted/20 md:col-span-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Board of Trustees</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {organization.governanceStructure.boardOfTrustees.map((trustee, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-foreground border">
                      {trustee}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {organization.governanceStructure.directors && (
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Directors</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {organization.governanceStructure.directors.map((director, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      {director}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {organization.governanceStructure.shareholders && (
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Shareholders</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {organization.governanceStructure.shareholders.map((shareholder, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {shareholder}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Officers & Staff Directory */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Key Officers & Staff Directory</span>
          </CardTitle>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Position:</span>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="rounded border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="all">All Positions</option>
                {availablePositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-muted-foreground font-medium">Gender:</span>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                className="rounded border border-input bg-background px-2 py-1 text-xs"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredOfficers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No staff members match the selected position/gender criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Officer Name</th>
                    <th className="px-4 py-3 font-medium">Position / Role</th>
                    <th className="px-4 py-3 font-medium">Gender</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOfficers.map((officer) => {
                    const isActive = officer.isActive !== false;

                    return (
                      <tr key={officer.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{officer.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            {officer.position}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <GenderBadge gender={officer.gender} />
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p>{officer.email}</p>
                          <p className="text-muted-foreground">{officer.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={statusBadgeClass(isActive ? "success" : "neutral")}>
                            <span className={statusDotClass(isActive ? "success" : "neutral")} />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onToggleOfficerStatus(organization.id, officer.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                          >
                            <Power className="h-3.5 w-3.5" />
                            {isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
