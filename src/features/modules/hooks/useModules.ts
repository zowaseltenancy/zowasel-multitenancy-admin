"use client";

import { useState, useMemo } from "react";
import { Module, ModuleCategory, ModuleDetailData } from "@/types/module";
import { MOCK_MODULES, MOCK_TENANTS_USING } from "../data/mockModules";

export function useModules() {
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const coreModules = useMemo(() => {
    return modules.filter((m) => m.parentId === null);
  }, [modules]);

  const filteredCoreModules = useMemo(() => {
    return coreModules.filter((mod) => {
      const matchesSearch =
        !searchQuery.trim() ||
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || mod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [coreModules, searchQuery, selectedCategory]);

  const getSubModulesForCore = (coreId: string) => {
    return modules.filter((m) => m.parentId === coreId);
  };

  const getFamilyTenantCount = (core: Module) => {
    const familyIds = new Set([
      core.id,
      ...modules.filter((m) => m.parentId === core.id).map((m) => m.id),
    ]);

    const tenantOrgs = new Set<string>();
    familyIds.forEach((id) => {
      const tenants = MOCK_TENANTS_USING[id] || [];
      tenants.forEach((t) => tenantOrgs.add(t.org_id));
    });

    return tenantOrgs.size;
  };

  const getModuleDetail = (moduleId: string): ModuleDetailData | null => {
    const targetModule = modules.find((m) => m.id === moduleId);
    if (!targetModule) return null;

    const parentModule = targetModule.parentId
      ? modules.find((m) => m.id === targetModule.parentId) || null
      : null;

    const subModules = modules.filter((m) => m.parentId === targetModule.id);
    const tenants = MOCK_TENANTS_USING[targetModule.id] || MOCK_TENANTS_USING["module_farmer_database"] || [];

    return {
      module: targetModule,
      parentModule: parentModule ? { id: parentModule.id, name: parentModule.name } : null,
      subModules,
      tenants,
    };
  };

  const createCoreModule = (data: {
    name: string;
    description: string;
    category: ModuleCategory;
    requiresKyb: boolean;
    isPaid: boolean;
    pricePerMonth: number;
  }) => {
    const newModule: Module = {
      id: `module_${Date.now()}`,
      name: data.name,
      description: data.description,
      category: data.category,
      featureKey: data.name.toLowerCase().replace(/\s+/g, "_"),
      parentId: null,
      enabled: true,
      isPaid: data.isPaid,
      pricePerMonth: data.isPaid ? data.pricePerMonth : 0,
      requiresKyb: data.requiresKyb,
      billingState: data.isPaid ? "paid" : "free",
      submodule_count: 0,
      tenant_count: 0,
      createdBy: "admin",
      updatedAt: new Date().toISOString(),
    };

    setModules((prev) => [...prev, newModule]);
    return newModule;
  };

  const createSubModule = (data: {
    name: string;
    description: string;
    requiresKyb: boolean;
    parentId: string;
  }) => {
    const parent = modules.find((m) => m.id === data.parentId);
    if (!parent) throw new Error("Parent module not found");

    const newSubModule: Module = {
      id: `sub_${Date.now()}`,
      name: data.name,
      description: data.description,
      category: parent.category,
      featureKey: data.name.toLowerCase().replace(/\s+/g, "_"),
      parentId: data.parentId,
      enabled: parent.enabled,
      isPaid: parent.isPaid,
      pricePerMonth: 0, // inherits from parent
      requiresKyb: data.requiresKyb,
      updatedAt: new Date().toISOString(),
    };

    setModules((prev) => {
      // Update parent submodule_count
      const updated = prev.map((m) =>
        m.id === data.parentId
          ? { ...m, submodule_count: (m.submodule_count || 0) + 1 }
          : m
      );
      return [...updated, newSubModule];
    });

    return newSubModule;
  };

  const toggleModuleStatus = (moduleId: string, enable: boolean) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          return { ...m, enabled: enable, updatedAt: new Date().toISOString() };
        }
        // Cascade disable sub-modules if core module is disabled
        if (m.parentId === moduleId && !enable) {
          return { ...m, enabled: false, updatedAt: new Date().toISOString() };
        }
        return m;
      })
    );
  };

  const updateModulePricing = (
    moduleId: string,
    pricing: { isPaid: boolean; pricePerMonth: number }
  ) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            isPaid: pricing.isPaid,
            pricePerMonth: pricing.isPaid ? pricing.pricePerMonth : 0,
            billingState: pricing.isPaid ? "paid" : "free",
            updatedAt: new Date().toISOString(),
          };
        }
        // Sync sub-modules
        if (m.parentId === moduleId) {
          return {
            ...m,
            isPaid: pricing.isPaid,
            updatedAt: new Date().toISOString(),
          };
        }
        return m;
      })
    );
  };

  return {
    modules,
    coreModules,
    filteredCoreModules,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getSubModulesForCore,
    getFamilyTenantCount,
    getModuleDetail,
    createCoreModule,
    createSubModule,
    toggleModuleStatus,
    updateModulePricing,
  };
}
