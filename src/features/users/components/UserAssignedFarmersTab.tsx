import { MapPin, Users, FileSpreadsheet, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentMetaData } from "@/types/user";

interface Props {
  agentMeta?: AgentMetaData;
}

export default function UserAssignedFarmersTab({ agentMeta }: Props) {
  if (!agentMeta) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          This user does not have field agent or agronomist assignment metadata.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Coverage Area
          </CardTitle>
          <MapPin className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{agentMeta.coverageArea}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {agentMeta.specialization}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Assigned Farmers
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentMeta.assignedFarmersCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Registered under agent</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Surveys Submitted
          </CardTitle>
          <FileSpreadsheet className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentMeta.totalSurveysSubmitted}</div>
          <p className="text-xs text-muted-foreground mt-1">Total field data entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Assigned Projects
          </CardTitle>
          <FolderKanban className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentMeta.assignedProjectsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Active field initiatives</p>
        </CardContent>
      </Card>
    </div>
  );
}
