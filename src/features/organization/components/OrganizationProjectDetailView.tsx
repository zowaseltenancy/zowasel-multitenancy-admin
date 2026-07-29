import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Organization } from '@/types/organization';
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  FolderTree,
  MapPin,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { OrganizationProject } from '../data/mockOrganizationProjects';
import { OrganizationProjectFarmer } from '../data/mockProjectFarmers';

interface Props {
  organization: Organization;
  project: OrganizationProject;
  farmers: OrganizationProjectFarmer[];
}

export default function OrganizationProjectDetailView({
  organization,
  project,
  farmers,
}: Props) {
  const statusStyles = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    suspended: 'bg-destructive/10 text-destructive border-destructive/20',
    completed: 'bg-slate-100 text-slate-900 border-slate-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/organizations/${organization.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to {organization.name}
            </Link>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {organization.name}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            statusStyles[project.status]
          }`}
        >
          {project.status}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <MapPin className="h-4 w-4" /> Location
            </div>
            <p className="text-sm font-semibold">{project.location}</p>
            <p className="text-xs text-muted-foreground">
              Crop focus: {project.cropFocus}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Users className="h-4 w-4" /> Project Team
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-muted-foreground text-[11px] uppercase">
                  Farmers
                </p>
                <p>{project.farmers}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-muted-foreground text-[11px] uppercase">
                  Agents
                </p>
                <p>{project.agents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> Timeline
            </div>
            <div className="grid gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-[11px] uppercase">
                  Start
                </p>
                <p>{project.startDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase">
                  End
                </p>
                <p>{project.endDate ?? 'Ongoing'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card lg:col-span-2">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Activity className="h-4 w-4" /> Project Summary
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <FolderTree className="h-4 w-4" /> Farmer Records
            </div>
            <p className="text-sm font-semibold">
              {farmers.length} farmer accounts
            </p>
            <p className="text-xs text-muted-foreground">
              Sample farmer enrollment data for this project.
            </p>
            <Button asChild size="sm" className="w-full">
              <Link href="#farmers">View farmers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card" id="farmers">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold">Farmer Records</h2>
              <p className="text-xs text-muted-foreground">
                Showing enrolled farmers for {project.name}.
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-semibold px-3 py-1 rounded-full"
            >
              {farmers.length} records
            </Badge>
          </div>

          {farmers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-muted/60 p-8 text-center text-sm text-muted-foreground">
              No farmer records are available for this project yet.
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Village</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {farmers.map((farmer) => (
                    <tr
                      key={farmer.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {farmer.firstName} {farmer.lastName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {farmer.village}
                      </td>
                      <td className="px-4 py-3 capitalize">{farmer.status}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {farmer.lastVisit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
