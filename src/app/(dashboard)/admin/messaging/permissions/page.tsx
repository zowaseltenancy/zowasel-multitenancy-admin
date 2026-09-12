"use client";
import { useMemo, useState } from 'react';
import { Shield, Plus, Trash2, Pencil, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useWhatsApp } from '@/context/whatsappContext';
import {
  ALL_WHATSAPP_PERMISSIONS,
  SCOPE_LEVEL_LABELS,
} from '@/lib/whatsapp/permissions';
import { Permission, ScopeLevel, WhatsAppRole } from '@/lib/whatsapp/types';

export default function WhatsAppPermissionsPage() {
  const { repo, refresh } = useWhatsApp();
  const [roles, setRoles] = useState<WhatsAppRole[]>(repo.getRoles());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WhatsAppRole | null>(null);
  const [form, setForm] = useState<{ name: string; scopeLevel: ScopeLevel; permissions: Permission[] }>({
    name: '',
    scopeLevel: 'staff',
    permissions: [],
  });

  const grouped = useMemo(() => {
    const g: Record<string, typeof ALL_WHATSAPP_PERMISSIONS> = {};
    ALL_WHATSAPP_PERMISSIONS.forEach((p) => {
      if (!g[p.group]) g[p.group] = [];
      g[p.group].push(p);
    });
    return g;
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', scopeLevel: 'staff', permissions: [] });
    setOpen(true);
  };

  const openEdit = (r: WhatsAppRole) => {
    setEditing(r);
    setForm({ name: r.name, scopeLevel: r.scopeLevel, permissions: [...r.permissions] });
    setOpen(true);
  };

  const togglePerm = (p: Permission) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(p)
        ? f.permissions.filter((x) => x !== p)
        : [...f.permissions, p],
    }));
  };

  const save = () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (editing) {
      repo.updateRole(editing.id, { ...editing, ...form });
      toast.success('Role updated');
    } else {
      repo.addRole({
        id: `wa-role-${Date.now()}`,
        name: form.name,
        scopeLevel: form.scopeLevel,
        permissions: form.permissions,
      });
      toast.success('Role created');
    }
    setRoles(repo.getRoles());
    refresh();
    setOpen(false);
  };

  const remove = (id: string) => {
    if (id.startsWith('wa-role-super')) return toast.error('Cannot delete Super Admin');
    repo.deleteRole(id);
    setRoles(repo.getRoles());
    refresh();
    toast.success('Role deleted');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/messaging"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Inbox</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WhatsApp Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Define what each role can do inside the messaging workspace
          </p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Role</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" /> {r.name}
                </CardTitle>
                <Badge variant="outline" className="mt-2">
                  {SCOPE_LEVEL_LABELS[r.scopeLevel]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {r.permissions.length} permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {r.permissions.slice(0, 3).map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">
                    {p.replace('whatsapp:', '')}
                  </Badge>
                ))}
                {r.permissions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{r.permissions.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => remove(r.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Role' : 'Create Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Support Lead"
                />
              </div>
              <div>
                <Label>Scope Level</Label>
                <Select
                  value={form.scopeLevel}
                  onValueChange={(v) => setForm({ ...form, scopeLevel: v as ScopeLevel })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(SCOPE_LEVEL_LABELS).map(([k, label]) => (
                      <SelectItem key={k} value={k}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-5">
              {Object.entries(grouped).map(([group, perms]) => (
                <div key={group}>
                  <h4 className="font-semibold text-sm mb-2">{group}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm transition-colors ${
                          form.permissions.includes(p.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(p.id)}
                          onChange={() => togglePerm(p.id)}
                          className="h-4 w-4"
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}