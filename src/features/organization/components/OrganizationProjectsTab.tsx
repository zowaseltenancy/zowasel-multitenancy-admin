"use client";

import { FolderTree, MapPin, Users, Leaf } from "lucide-react";
import { Organization } from "@/types/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  organization: Organization;
}

export default function OrganizationProjectsTab({ organization }: Props) {
  // Rich Farm Projects dataset matching Emmanuel's reference model
  const mockProjects = [
    {
      id: "proj_001",
      name: "Oyo Cassava Outgrower Scheme",
      location: "Oyo State, Nigeria",
      agents: 8,
      farmers: 320,
      cropFocus: "Cassava",
      status: "active",
    },
    {
      id: "proj_002",
      name: "Kano Rice Value Chain",
      location: "Kano State, Nigeria",
      agents: 5,
      farmers: 210,
      cropFocus: "Rice",
      status: "active",
    },
    {
      id: "proj_003",
      name: "Benue Yam Cluster Initiative",
      location: "Benue State, Nigeria",
      agents: 3,
      farmers: 95,
      cropFocus: "Yam",
      status: "pending",
    },
    {
      id: "proj_004",
      name: "Kaduna Maize Expansion Program",
      location: "Kaduna State, Nigeria",
      agents: 6,
      farmers: 180,
      cropFocus: "Maize",
      status: "active",
    },
    {
      id: "proj_005",
      name: "Ogun Poultry & Grain Program",
      location: "Ogun State, Nigeria",
      agents: 2,
      farmers: 40,
      cropFocus: "Poultry Feed & Grains",
      status: "suspended",
    },
  ];

  return (
    <Card className="bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Agro Projects & Initiatives ({mockProjects.length})</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Farm outgrower programs managed by {organization.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProjects.map((project) => (
            <Card key={project.id} className="bg-card border hover:border-primary/50 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-primary" /> {project.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] capitalize ${
                      project.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : project.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" /> {project.cropFocus}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      {project.agents} agents
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" /> {project.farmers} farmers
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
