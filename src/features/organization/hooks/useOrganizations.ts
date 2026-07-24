"use client";

import { useState } from "react";

import { TeamMemberRole } from "@/types/organization";

import { mockOrganizations } from "../data/mockOrganizations";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState(
    mockOrganizations
  );

  const approveKyb = (organizationId: string) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          kybStatus: "approved",
          kybApprovedAt: new Date().toISOString(),
          kybRejectionReason: null,
          kybDocuments: organization.kybDocuments.map(
            (document) => ({
              ...document,
              status: "verified",
            })
          ),
        };
      })
    );
  };

  const rejectKyb = (
    organizationId: string,
    reason: string
  ) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          kybStatus: "rejected",
          kybRejectionReason: reason,
          kybDocuments: organization.kybDocuments.map(
            (document) => ({
              ...document,
              status: "rejected",
            })
          ),
        };
      })
    );
  };

  const updateTeamMember = (
    organizationId: string,
    memberId: string,
    updates: {
      role?: TeamMemberRole;
      isActive?: boolean;
    }
  ) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          teamMembers: organization.teamMembers.map(
            (member) =>
              member.id === memberId
                ? { ...member, ...updates }
                : member
          ),
        };
      })
    );
  };

  const removeTeamMember = (
    organizationId: string,
    memberId: string
  ) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          teamMembers: organization.teamMembers.filter(
            (member) => member.id !== memberId
          ),
        };
      })
    );
  };

  return {
    organizations,
    approveKyb,
    rejectKyb,
    updateTeamMember,
    removeTeamMember,
  };
}
