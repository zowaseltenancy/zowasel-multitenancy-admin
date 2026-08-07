'use client';

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  DollarSign,
  Eye,
  Info,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useModules } from '../hooks/useModules';
import { CATEGORY_ICONS, CATEGORY_STYLES } from './ModuleCard';

import { usePageHeader } from '@/components/layout/PageHeaderContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ModuleDetailViewProps {
  moduleId: string;
}

export default function ModuleDetailView({ moduleId }: ModuleDetailViewProps) {
  const {
    getModuleDetail,
    toggleModuleStatus,
    updateModulePricing,
    createSubModule,
  } = useModules();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'submodules' | 'tenants'
  >('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subRequiresKyb, setSubRequiresKyb] = useState(false);

  const detailData = getModuleDetail(moduleId);

  useEffect(() => {
    // Syncs the editable price field from the record whenever pricing is
    // saved elsewhere (e.g. the paid/free checkbox) — a legitimate
    // prop-to-local-state sync, same justified exception as DashboardLayout.
    if (detailData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriceInput(detailData.module.pricePerMonth.toString());
    }
  }, [detailData]);

  usePageHeader(
    detailData?.module.name ?? 'Module Detail',
    detailData?.module.description
  );

  if (!detailData) {
    return (
      <Card className="bg-card">
        <CardContent className="p-12 text-center text-muted-foreground space-y-4">
          <Package className="h-10 w-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-base font-semibold text-foreground">
            Module not found
          </h3>
          <Link href="/admin/modules">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Modules
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { module, parentModule, subModules, tenants } = detailData;
  const isCore = module.parentId === null;
  const isEnabled = module.enabled !== false;

  const IconComponent = CATEGORY_ICONS[module.category] || Package;
  const style = CATEGORY_STYLES[module.category] || {
    bg: 'bg-primary/10',
    text: 'text-primary',
  };

  const handleToggleStatus = (checked: boolean) => {
    toggleModuleStatus(module.id, checked);
    toast.success(
      `Module "${module.name}" ${checked ? 'enabled' : 'disabled'} globally`
    );
  };

  const handleSavePricing = (isPaid: boolean, price: number) => {
    updateModulePricing(module.id, { isPaid, pricePerMonth: price });
    toast.success(`Pricing configuration updated for "${module.name}"`);
  };

  const handleCreateSubModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      toast.error('Sub-module name is required');
      return;
    }
    createSubModule({
      name: subName,
      description: subDescription,
      requiresKyb: subRequiresKyb,
      parentId: module.id,
    });
    toast.success(`Sub-module "${subName}" added under ${module.name}`);
    setSubName('');
    setSubDescription('');
    setSubRequiresKyb(false);
    setIsAddSubOpen(false);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.owner_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl ${style.bg} ${style.text}`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {module.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      module.isPaid
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {module.isPaid
                      ? `$${module.pricePerMonth}/mo`
                      : 'Free Module'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isEnabled
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                    }`}
                  >
                    {isEnabled ? 'Enabled Globally' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                  {module.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="capitalize">
                      {module.category.replace(/_/g, ' ')}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {tenants.length} tenants using
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Refreshed')}
                className="gap-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Info className="h-3.5 w-3.5" /> Overview & Pricing
        </button>

        {isCore && (
          <button
            onClick={() => setActiveTab('submodules')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'submodules'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="h-3.5 w-3.5" /> Sub-Modules ({subModules.length}
            )
          </button>
        )}

        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tenants'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> Tenants Using ({tenants.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metadata Card */}
          <Card className="bg-card">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Module Specification
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Module ID</span>
                  <code className="font-mono text-foreground">{module.id}</code>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Hierarchy Type</span>
                  <span className="font-semibold text-foreground">
                    {isCore ? 'Core Module' : 'Sub-Module'}
                  </span>
                </div>
                {!isCore && parentModule && (
                  <div className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">
                      Parent Core Module
                    </span>
                    <span className="font-semibold text-primary">
                      {parentModule.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Category</span>
                  <span className="capitalize text-foreground">
                    {module.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">
                    Requires KYB Approval
                  </span>
                  <span>
                    {module.requiresKyb ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Activation Controls Card */}
          <Card className="bg-card">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" /> Global
                Activation & Pricing
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-accent/20">
                  <div>
                    <span className="text-xs font-semibold text-foreground">
                      Global Enable Status
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      When disabled, this module is hidden from all tenant
                      dashboards.
                    </p>
                  </div>
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={(c) => handleToggleStatus(!!c)}
                  />
                </div>

                {isCore && (
                  <div className="p-4 rounded-lg border space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        Pricing Tier
                      </span>
                      <Checkbox
                        checked={module.isPaid}
                        onCheckedChange={(c) =>
                          handleSavePricing(!!c, module.pricePerMonth)
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">
                        Price Per Month (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          disabled={!module.isPaid}
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          onBlur={(e) =>
                            handleSavePricing(
                              module.isPaid,
                              Number(e.target.value) || 0
                            )
                          }
                          className="pl-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sub-Modules Tab */}
      {activeTab === 'submodules' && isCore && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Sub-Modules ({subModules.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddSubOpen(true)}
              className="gap-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Sub-Module
            </Button>
          </div>

          {subModules.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="p-8 text-center text-muted-foreground space-y-2">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/60" />
                <p className="text-xs font-medium">
                  No sub-modules added yet under {module.name}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subModules.map((sub) => (
                <Card
                  key={sub.id}
                  className="bg-card hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-foreground">
                        {sub.name}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        Inherits Pricing
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {sub.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tenants Using Tab */}
      {activeTab === 'tenants' && (
        <Card className="bg-card">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenants by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {filteredTenants.length} tenants active
              </span>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 font-semibold text-muted-foreground uppercase">
                      Organization
                    </th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">
                      Owner Contact
                    </th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">
                      KYB Status
                    </th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase">
                      Subscription Date
                    </th>
                    <th className="p-3 font-semibold text-muted-foreground uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No active tenant subscriptions found for this module.
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((t) => (
                      <tr
                        key={t.org_id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 font-semibold text-foreground">
                          <Link
                            href={`/admin/organizations/${t.org_id}`}
                            className="hover:text-primary hover:underline transition-colors"
                          >
                            {t.org_name}
                          </Link>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {t.owner_email}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className="capitalize text-[10px]"
                          >
                            {t.kyb_status}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(t.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/admin/organizations/${t.org_id}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                            title="View Organization Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Sub-module Dialog */}
      <Dialog open={isAddSubOpen} onOpenChange={setIsAddSubOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" /> Add Sub-Module under{' '}
              {module.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sub-modules inherit pricing and billing rules from {module.name}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubModuleSubmit}
            className="space-y-4 py-2"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Sub-Module Name *
              </label>
              <Input
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Soil Sampling Tests"
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Description
              </label>
              <Textarea
                value={subDescription}
                onChange={(e) => setSubDescription(e.target.value)}
                placeholder="What this sub-module capability offers..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="subKyb"
                checked={subRequiresKyb}
                onCheckedChange={(c) => setSubRequiresKyb(!!c)}
              />
              <label
                htmlFor="subKyb"
                className="text-xs font-medium cursor-pointer"
              >
                Requires KYB Approval
              </label>
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddSubOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Sub-Module
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
