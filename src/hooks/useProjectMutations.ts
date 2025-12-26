/**
 * Project Mutation Hooks
 * Handles all write operations (POST, PUT, DELETE) for projects
 * Uses TanStack Query mutations with automatic cache invalidation
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
} from '@/interceptors/endpoints/project.api';
import {
    addProjectMember,
    updateMemberRole,
    removeMember,
    transferOwnership,
    leaveProject,
} from '@/interceptors/endpoints/projectMember.api';
import type {
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectResponse,
} from '@/interceptors/types/project.types';
import type {
    ProjectMemberAddRequest,
    ProjectMemberUpdateRoleRequest,
    TransferOwnershipRequest,
    ProjectMemberResponse,
} from '@/interceptors/types/projectMember.types';
import { projectKeys } from './useProjects';

/**
 * Mutation options interface for customization
 */
interface MutationOptions<TData = unknown, TVariables = unknown> {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
}

/**
 * Create a new project
 * Creator automatically becomes OWNER
 *
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: create, isPending } = useCreateProject({
 *   onSuccess: (project) => {
 *     console.log('Created:', project.name);
 *     navigate(`/projects/${project.id}`);
 *   }
 * });
 *
 * create({ name: 'My Project', visibility: 'PRIVATE' });
 */
export const useCreateProject = (
    options?: MutationOptions<ProjectResponse, CreateProjectRequest>
): UseMutationResult<ProjectResponse, Error, CreateProjectRequest> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createProject,
        onSuccess: (data, variables) => {
            // Invalidate project lists to show new project
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
                
            // Show success toast
            toast.success(`Project "${data.name}" created successfully!`);

            // Navigate to new project
            navigate(`/projects/${data.id}`);

            // Call custom onSuccess if provided
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            // Show error toast
            toast.error(error.message || 'Failed to create project');

            // Call custom onError if provided
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Update project details
 * Only OWNER and ADMIN can update
 *
 * @param projectId - Project ID to update
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: update, isPending } = useUpdateProject(projectId, {
 *   onSuccess: () => toast.success('Project updated!')
 * });
 *
 * update({ name: 'New Name', description: 'New description' });
 */
export const useUpdateProject = (
    projectId: string,
    options?: MutationOptions<ProjectResponse, UpdateProjectRequest>
): UseMutationResult<ProjectResponse, Error, UpdateProjectRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateProject(projectId, data),
        onSuccess: (data, variables) => {
            // Invalidate specific project
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            // Invalidate project lists (name might have changed)
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

            toast.success('Project updated successfully!');
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to update project');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Delete project permanently
 * Only OWNER can delete
 *
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: deleteProj, isPending } = useDeleteProject({
 *   onSuccess: () => navigate('/projects')
 * });
 *
 * deleteProj(projectId);
 */
export const useDeleteProject = (
    options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: (data, projectId) => {
            // Invalidate all project queries   // Remove deleted project from cache (doesn't exist)
            queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
            queryClient.removeQueries({ queryKey: projectKeys.members(projectId) });

            // Invalidate lists (project removed, lists changed)
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.archived() });

            toast.success('Project deleted successfully');
            navigate('/projects');
            options?.onSuccess?.(data, projectId);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to delete project');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Archive project
 * Only OWNER can archive
 *
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: archive, isPending } = useArchiveProject();
 * archive(projectId);
 */
export const useArchiveProject = (
    options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: archiveProject,
        onSuccess: (data, projectId) => {
            // Invalidate project detail
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            // Invalidate both active and archived lists
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.archived() });

            toast.success('Project archived successfully');
            options?.onSuccess?.(data, projectId);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to archive project');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Restore archived project
 * Only OWNER can restore
 *
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: restore, isPending } = useRestoreProject();
 * restore(projectId);
 */
export const useRestoreProject = (
    options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restoreProject,
        onSuccess: (data, projectId) => {
            // Invalidate project detail
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            // Invalidate both active and archived lists
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.archived() });

            toast.success('Project restored successfully');
            options?.onSuccess?.(data, projectId);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to restore project');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Add member to project
 * Only OWNER and ADMIN can add members
 *
 * @param projectId - Project ID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: addMember, isPending } = useAddMember(projectId);
 * addMember({ userId: 'user-123', role: 'MEMBER' });
 */
export const useAddMember = (
    projectId: string,
    options?: MutationOptions<ProjectMemberResponse, ProjectMemberAddRequest>
): UseMutationResult<ProjectMemberResponse, Error, ProjectMemberAddRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => addProjectMember(projectId, data),
        onSuccess: (data, variables) => {
            // Invalidate members list
            queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });

            // Invalidate project detail (member count changes)
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            toast.success(`Member added successfully`);
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to add member');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Update member's role
 * Only OWNER and ADMIN can update roles
 * Cannot assign OWNER role (use transferOwnership)
 *
 * @param projectId - Project ID
 * @param userId - User ID to update
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: updateRole, isPending } = useUpdateMemberRole(projectId, userId);
 * updateRole({ role: 'ADMIN' });
 */
export const useUpdateMemberRole = (
    projectId: string,
    userId: string,
    options?: MutationOptions<ProjectMemberResponse, ProjectMemberUpdateRoleRequest>
): UseMutationResult<ProjectMemberResponse, Error, ProjectMemberUpdateRoleRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateMemberRole(projectId, userId, data),
        onSuccess: (data, variables) => {
            // Invalidate members list
            queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });

            // Invalidate specific member
            queryClient.invalidateQueries({ queryKey: projectKeys.member(projectId, userId) });

            toast.success('Member role updated successfully');
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to update member role');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Remove member from project
 * Only OWNER and ADMIN can remove members
 * Cannot remove last OWNER
 *
 * @param projectId - Project ID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: remove, isPending } = useRemoveMember(projectId);
 * remove(userId);
 */
export const useRemoveMember = (
    projectId: string,
    options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId) => removeMember(projectId, userId),
        onSuccess: (data, userId) => {
            // Invalidate members list
            queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });

            // Invalidate project detail (member count changes)
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            // Remove specific member from cache
            queryClient.removeQueries({ queryKey: projectKeys.member(projectId, userId) });

            toast.success('Member removed successfully');
            options?.onSuccess?.(data, userId);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to remove member');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Transfer project ownership
 * Only current OWNER can transfer
 * Current owner becomes ADMIN after transfer
 *
 * @param projectId - Project ID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: transfer, isPending } = useTransferOwnership(projectId);
 * transfer({ newOwnerUserId: 'user-456' });
 */
export const useTransferOwnership = (
    projectId: string,
    options?: MutationOptions<void, TransferOwnershipRequest>
): UseMutationResult<void, Error, TransferOwnershipRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => transferOwnership(projectId, data),
        onSuccess: (data, variables) => {
            // Invalidate members list (roles changed)
            queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) });

            // Invalidate project detail (currentUserRole changes)
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

            toast.success('Ownership transferred successfully');
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to transfer ownership');
            options?.onError?.(error, variables);
        },
    });
};

/**
 * Leave project (remove yourself)
 * Cannot leave if you're the last OWNER
 *
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: leave, isPending } = useLeaveProject({
 *   onSuccess: () => navigate('/projects')
 * });
 * leave(projectId);
 */
export const useLeaveProject = (
    options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: leaveProject,
        onSuccess: (data, projectId) => {
            // Invalidate all project queries (user is no longer member)
            queryClient.invalidateQueries({ queryKey: projectKeys.all });

            toast.success('You have left the project');
            navigate('/projects');
            options?.onSuccess?.(data, projectId);
        },
        onError: (error, variables) => {
            toast.error(error.message || 'Failed to leave project');
            options?.onError?.(error, variables);
        },
    });
};