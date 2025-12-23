/**
 * Project Member API Functions
 * All endpoints under /api/projects/{projectId}/members
 */

import apiClient, { isAxiosError } from '@/api/client';
import { ApiErrorResponse } from '../types/auth.types';
import {
    ProjectMemberAddRequest,
    ProjectMemberResponse,
    ProjectMemberSummary,
    ProjectMemberUpdateRoleRequest,
    TransferOwnershipRequest,
} from '../types/projectMember.types';

/**
 * Extract error message from API error response
 */
const getErrorMessage = (error: any): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        if (data?.message) {
            return data.message;
        }

        if (data?.details) {
            // Combine field validation errors
            const fieldErrors = Object.values(data.details).join(', ');
            return fieldErrors || 'Validation error occurred';
        }

        // Member-specific error codes
        if (error.response?.status === 400) {
            return 'Invalid member data';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to manage members';
        }

        if (error.response?.status === 404) {
            return 'Project or member not found';
        }

        if (error.response?.status === 409) {
            return 'User is already a project member';
        }

        if (error.response?.status === 500) {
            return 'Server error. Please try again later';
        }

        if (error.message === 'Network Error') {
            return 'Unable to connect to server';
        }
    }

    return 'An unexpected error occurred';
};

/**
 * Get all members of a project
 * GET /api/projects/{projectId}/members
 * Requires project membership
 */
export const getProjectMembers = async (
    projectId: string,
): Promise<ProjectMemberSummary[]> => {
    try {
        const response = await apiClient.get<ProjectMemberSummary[]>(
            `/projects/${projectId}/members`
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Get specific member details
 * GET /api/projects/{projectId}/members/{userId}
 * Requires project membership
 */
export const getProjectMember = async (
    projectId: string,
    userId: string
): Promise<ProjectMemberResponse> => {
    try {
        const response = await apiClient.get<ProjectMemberResponse>(
            `/projects/${projectId}/members/${userId}`
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Add a member to project
 * POST /api/projects/{projectId}/members
 * Only OWNER and ADMIN can add members
 */
export const addProjectMember = async (
    projectId: string,
    data: ProjectMemberAddRequest
): Promise<ProjectMemberResponse> => {
    try {
        const response = await apiClient.post<ProjectMemberResponse>(
            `/projects/${projectId}/members`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Update member's role
 * PUT /api/projects/{projectId}/members/{userId}/role
 * Only OWNER and ADMIN can update roles
 * Cannot assign OWNER role (use transferOwnership instead)
 */
export const updateMemberRole = async (
    projectId: string,
    userId: string,
    data: ProjectMemberUpdateRoleRequest
): Promise<ProjectMemberResponse> => {
    try {
        const response = await apiClient.put<ProjectMemberResponse>(
            `/projects/${projectId}/members/${userId}/role`,
            data
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Remove member from project
 * DELETE /api/projects/{projectId}/members/{userId}
 * Only OWNER and ADMIN can remove members
 * Cannot remove last OWNER
 */
export const removeMember = async (
    projectId: string,
    userId: string
): Promise<void> => {
    try {
        await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

/**
 * Transfer project ownership to another member
 * POST /api/projects/{projectId}/transfer-ownership
 * Only current OWNER can transfer ownership
 * Current owner becomes ADMIN after transfer
 */
export const transferOwnership = async (
    projectId: string,
    data: TransferOwnershipRequest
): Promise<void> => {
    try {
        await apiClient.post(`/projects/${projectId}/transfer-ownership`, data);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const leaveProject = async (projectId: string): Promise<void> => {
    try {
        await apiClient.post(`/projects/${projectId}/leave`);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};