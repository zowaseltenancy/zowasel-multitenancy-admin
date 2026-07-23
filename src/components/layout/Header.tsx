"use client";

import { Menu } from "lucide-react";

import Breadcrumbs from "./Breadcrumbs";
import UserMenu from "./UserMenu";

interface Props {
  onToggle: () => void;
}

export default function Header({ onToggle }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="rounded-lg border border-border p-2 transition hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumbs />
      </div>

      <UserMenu />
    </header>
  );
}