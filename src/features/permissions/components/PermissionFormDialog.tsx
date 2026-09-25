"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPermission: (values: { key: string; description?: string }) => void;
  /** Existing catalogue keys — a duplicate is a 409 from the server. */
  existingKeys: string[];
  isSubmitting?: boolean;
}

// The catalogue's shape is a convention, not a free-form string: every key the
// platform enforces is `resource:action`, lower case, and that is what the
// permission middleware matches on. Validating it here turns a 422 round-trip
// into an inline message, and keeps operator-added scopes grouped under the
// resource they belong to in the matrix.
const KEY_PATTERN = /^[a-z][a-z0-9_]*:[a-z][a-z0-9_]*$/;

export default function PermissionFormDialog({
  open,
  onOpenChange,
  onSubmitPermission,
  existingKeys,
  isSubmitting = false,
}: PermissionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {/* The form is a child of DialogContent, which Radix unmounts while the
            dialog is closed — so each open starts from empty state naturally,
            with no effect resetting fields after a render. */}
        <ScopeForm
          onOpenChange={onOpenChange}
          onSubmitPermission={onSubmitPermission}
          existingKeys={existingKeys}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

function ScopeForm({
  onOpenChange,
  onSubmitPermission,
  existingKeys,
  isSubmitting,
}: Omit<PermissionFormDialogProps, "open"> & { isSubmitting: boolean }) {
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = key.trim().toLowerCase();

    if (!KEY_PATTERN.test(trimmed)) {
      setError(
        "Use the resource:action form — lower case, e.g. analytics:export.",
      );
      return;
    }
    if (existingKeys.includes(trimmed)) {
      setError(`${trimmed} is already in the catalogue.`);
      return;
    }

    setError(null);
    onSubmitPermission({
      key: trimmed,
      description: description.trim() || undefined,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <KeyRound className="h-5 w-5 text-primary" />
          Add Permission Scope
        </DialogTitle>
        <DialogDescription>
          Adds a capability to the platform catalogue so roles can grant it.
          Creating a scope grants nothing on its own — tick it for a role in the
          matrix below.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-1.5">
          <label
            htmlFor="permission-key"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Scope Key <span className="text-destructive">*</span>
          </label>
          <Input
            id="permission-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. analytics:export"
            className="font-mono text-sm"
            autoComplete="off"
            disabled={isSubmitting}
          />
          <p className="text-[11px] text-muted-foreground">
            <code className="font-mono">resource:action</code> — the form the
            permission checks match on. A scope whose resource is not a known
            category appears under Custom Scopes.
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="permission-description"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Description
          </label>
          <Textarea
            id="permission-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this scope allows, in one line."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}

        {/* Stated rather than discovered through a 403: the endpoint is
              restricted to SUPER_ADMIN, a harder gate than the roles:write
              permission that governs everything else on this screen. */}
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] font-medium text-amber-700 dark:text-amber-400">
          Only a Super Admin can extend the catalogue.
        </p>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Scope
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
