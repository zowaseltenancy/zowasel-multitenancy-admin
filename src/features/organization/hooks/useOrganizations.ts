"use client";

import { useState } from "react";

import { AssignedStaffMember, Organization, TeamMemberRole } from "@/types/organization";

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

  const markKybPending = (organizationId: string) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          kybStatus: "pending",
          kybSubmittedAt:
            organization.kybSubmittedAt ?? new Date().toISOString(),
          kybApprovedAt: null,
          kybRejectionReason: null,
          kybDocuments: organization.kybDocuments.map(
            (document) => ({
              ...document,
              status: "pending",
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

  const toggleKeyOfficerStatus = (
    organizationId: string,
    officerId: string
  ) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          keyOfficers: (organization.keyOfficers ?? []).map((officer) =>
            officer.id === officerId
              ? { ...officer, isActive: officer.isActive === false }
              : officer
          ),
        };
      })
    );
  };

  const addOrganization = (organization: Organization) => {
    setOrganizations((current) => [organization, ...current]);
  };

  const assignStaff = (
    organizationId: string,
    slot: "primary" | "secondary",
    staff: AssignedStaffMember | null
  ) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          assignedStaff: {
            ...organization.assignedStaff,
            [slot]: staff ?? undefined,
          },
        };
      })
    );
  };

  const swapAssignedStaff = (organizationId: string) => {
    setOrganizations((current) =>
      current.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          assignedStaff: {
            primary: organization.assignedStaff?.secondary,
            secondary: organization.assignedStaff?.primary,
          },
        };
      })
    );
  };

  return {
    organizations,
    approveKyb,
    rejectKyb,
    markKybPending,
    updateTeamMember,
    removeTeamMember,
    toggleKeyOfficerStatus,
    addOrganization,
    assignStaff,
    swapAssignedStaff,
  };
}
