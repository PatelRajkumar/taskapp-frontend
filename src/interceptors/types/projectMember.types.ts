/**
 * Project Member API Types
 * These types match the backend DTOs exactly
 */

import { ProjectSummary, UserSummary } from './project.types';

/**
 * Project role enum (matches backend)
 */
export enum ProjectRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    VIEWER = 'VIEWER',
}

/**
 * Add member request (matches backend ProjectMemberAddRequestDTO)
 */
export interface ProjectMemberAddRequest {
    userId: string;
    role?: ProjectRole; // Optional, defaults to MEMBER on backend
}

/**
 * Update member role request (matches backend ProjectMemberUpdateRoleRequestDTO)
 */
export interface ProjectMemberUpdateRoleRequest {
    role: ProjectRole; // Cannot be OWNER - use transferOwnership instead
}

/**
 * Transfer ownership request (matches backend TransferOwnershipRequestDTO)
 */
export interface TransferOwnershipRequest {
    newOwnerUserId: string;
}

/**
 * Project member summary (matches backend ProjectMemberSummaryDTO)
 */
export interface ProjectMemberSummary {
    id: string;
    user: UserSummary;
    role: ProjectRole;
    joinedAt: string;
    roleDisplayName: string;
    permissions: MemberPermissions;
}

/**
 * Project member response with permissions (matches backend ProjectMemberResponseDTO)
 */
export interface ProjectMemberResponse {
    id: string;
    user: UserSummary;
    role: ProjectRole;
    roleDisplayName: string;
    joinedAt: string;
    project: ProjectSummary;
    permissions: MemberPermissions;
}

/**
 * Member permissions (matches backend MemberPermissionsDTO)
 */
export interface MemberPermissions {
    canDelete: boolean;
    canManageMembers: boolean;
    canEditProject: boolean;
    canCreateIssues: boolean;
    canViewProject: boolean;
    canArchiveProject: boolean;
    canTransferOwnership: boolean;
}