"use client";

import { useState } from "react";
import { Plus, Search, RefreshCw, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import { useModules } from "../hooks/useModules";
import ModuleStatsCards from "./ModuleStatsCards";
import ModuleCard from "./ModuleCard";
import CreateModuleDialog from "./CreateModuleDialog";
import { CreateModuleFormValues } from "@/schemas/module.schema";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ModulesOverviewView() {
  const {
    coreModules,
    filteredCoreModules,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getFamilyTenantCount,
    createCoreModule,
  } = useModules();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const totalCore = coreModules.length;
  const enabledCount = coreModules.filter((m) => m.enabled !== false).length;
  const disabledCount = totalCore - enabledCount;
  const totalTenantUsage = coreModules.reduce(
    (sum, m) => sum + getFamilyTenantCount(m),
    0
  );

  const handleCreateModule = (values: CreateModuleFormValues) => {
    createCoreModule(values);
  };

  const categories = [
    { id: "all", label: "All Modules" },
    { id: "croppilot", label: "CropPilot Core" },
    { id: "marketplace", label: "Marketplace" },
    { id: "analytics", label: "Analytics" },
    { id: "export_management", label: "Export Management" },
    { id: "supply_chain", label: "Supply Chain" },
    { id: "carbon_sustainability", label: "Carbon & Sustainability" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <ModuleStatsCards
        totalCore={totalCore}
        enabledCount={enabledCount}
        disabledCount={disabledCount}
        totalTenantUsage={totalTenantUsage}
      />

      {/* Header Actions & Filter Controls */}
      <Card className="bg-card">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Modules refreshed")}
                className="gap-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="gap-2 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Core Module
              </Button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? totalCore
                  : coreModules.filter((m) => m.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Module Grid View */}
      {filteredCoreModules.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="p-12 text-center text-muted-foreground space-y-3">
            <LayoutGrid className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <h3 className="text-base font-semibold text-foreground">No modules found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No platform modules match your active filter or search query. Try adjusting your filters or creating a new core module.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoreModules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              tenantCount={getFamilyTenantCount(mod)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog Modal */}
      <CreateModuleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmitModule={handleCreateModule}
      />
    </div>
  );
}
