"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { consumeFlashToast } from "@/lib/flashToast";

export function useFlashToast() {
  useEffect(() => {
    const flash = consumeFlashToast();

    if (!flash) return;

    if (flash.type === "error") {
      toast.error(flash.message);
    } else {
      toast.success(flash.message);
    }
  }, []);
}
