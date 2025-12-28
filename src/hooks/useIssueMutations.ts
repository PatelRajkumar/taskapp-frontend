/**
 * Issue Mutation Hooks
 * Handles all write operations (POST, PUT, DELETE) for issues
 * Uses TanStack Query mutations with automatic cache invalidation
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createIssue,
  updateIssue,
  updateIssueStatus,
  assignIssue,
  deleteIssue,
} from '@/interceptors/endpoints/issue.api';
import type {
  IssueResponse,
  CreateIssueRequest,
  UpdateIssueRequest,
  UpdateIssueStatusRequest,
  AssignIssueRequest,
} from '@/interceptors/types/issue.types';
import { issueKeys } from './useIssues';
import { projectKeys } from './useProjects';

/**
 * Mutation options interface for customization
 */
interface MutationOptions<TData = unknown, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

/**
 * Create a new issue in a project
 * Requires project membership
 *
 * @param projectId - Project UUID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: create, isPending } = useCreateIssue(projectId, {
 *   onSuccess: (issue) => {
 *     console.log('Created:', issue.key);
 *     navigate(`/projects/${projectId}/issues/${issue.key}`);
 *   }
 * });
 *
 * create({ title: 'Fix login bug', type: 'BUG', priority: 'HIGH' });
 */
export const useCreateIssue = (
  projectId: string,
  options?: MutationOptions<IssueResponse, CreateIssueRequest>
): UseMutationResult<IssueResponse, Error, CreateIssueRequest> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => createIssue(projectId, data),
    onSuccess: (data, variables) => {
      // Invalidate issue lists for this project
      // queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
      queryClient.invalidateQueries({
        queryKey: ['issues', 'project', projectId]  // Invalidates all project issue queries
      });

      // Invalidate project detail (issue count changes)
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

      // If assigned to someone, invalidate their assigned issues
      if (data.assignee) {
        queryClient.invalidateQueries({ queryKey: issueKeys.myAssigned() });
      }

      // Invalidate my reported issues
      queryClient.invalidateQueries({ queryKey: issueKeys.myReported() });

      toast.success(`Issue "${data.key}" created successfully!`);
      // navigate(`/projects/${projectId}/issues/${data.key}`);

      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      toast.error(error.message || 'Failed to create issue');
      options?.onError?.(error, variables);
    },
  });
};

/**
 * Update issue details
 * Requires permission (OWNER/ADMIN or reporter or assignee)
 *
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: update, isPending } = useUpdateIssue(projectId, issueId, {
 *   onSuccess: () => toast.success('Issue updated!')
 * });
 *
 * update({ title: 'New Title', priority: 'HIGH' });
 */
export const useUpdateIssue = (
  projectId: string,
  issueId: string,
  options?: MutationOptions<IssueResponse, UpdateIssueRequest>
): UseMutationResult<IssueResponse, Error, UpdateIssueRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateIssue(projectId, issueId, data),
    onSuccess: (data, variables) => {

      // Invalidate specific issue
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detailByKey(data.key) });

      // Invalidate issue lists (title/priority might have changed)
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.myAssigned() });
      queryClient.invalidateQueries({ queryKey: issueKeys.myReported() });

      toast.success('Issue updated successfully!');
      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      toast.error(error.message || 'Failed to update issue');
      options?.onError?.(error, variables);
    },
  });
};

/**
 * Update issue status with workflow validation
 * Workflow: TODO → INPROGRESS → DONE → TODO (reopen)
 * Requires permission (OWNER/ADMIN or reporter or assignee)
 *
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param options - Success/error callbacks (with optimistic updates support)
 * @returns Mutation result
 *
 * @example
 * const { mutate: updateStatus, isPending } = useUpdateIssueStatus(projectId, issueId);
 * updateStatus({ newStatus: 'INPROGRESS', reason: 'Starting work' });
 */
export const useUpdateIssueStatus = (
  projectId: string,
  issueId: string,
  options?: MutationOptions<IssueResponse, UpdateIssueStatusRequest>
): UseMutationResult<IssueResponse, Error, UpdateIssueStatusRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateIssueStatus(projectId, issueId, data),
    // Optimistic update
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: issueKeys.detail(issueId) });

      // Snapshot previous value
      const previousIssue = queryClient.getQueryData<IssueResponse>(
        issueKeys.detail(issueId)
      );

      // Optimistically update issue status
      if (previousIssue) {
        queryClient.setQueryData<IssueResponse>(issueKeys.detail(issueId), {
          ...previousIssue,
          status: variables.newStatus,
        });
      }

      return { previousIssue };
    },
    onSuccess: (data, variables) => {
      // Invalidate issue detail
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detailByKey(data.key) });

      // Invalidate issue lists (status changed)
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.myAssigned() });
      queryClient.invalidateQueries({ queryKey: issueKeys.myReported() });

      // Invalidate history (new history entry added)
      queryClient.invalidateQueries({ queryKey: issueKeys.history(issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.projectHistory(projectId) });

      toast.success(`Status updated to ${data.status}`);
      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousIssue) {
        queryClient.setQueryData(issueKeys.detail(issueId), context.previousIssue);
      }

      toast.error(error.message || 'Failed to update status');
      options?.onError?.(error, variables);
    },
  });
};

/**
 * Assign or unassign issue
 * Requires permission (OWNER/ADMIN or reporter or assignee)
 *
 * @param projectId - Project UUID
 * @param issueId - Issue UUID
 * @param options - Success/error callbacks (with optimistic updates support)
 * @returns Mutation result
 *
 * @example
 * // Assign to user
 * const { mutate: assign, isPending } = useAssignIssue(projectId, issueId);
 * assign({ assigneeId: 'user-123' });
 *
 * // Unassign
 * assign({ assigneeId: null });
 */
export const useAssignIssue = (
  projectId: string,
  issueId: string,
  options?: MutationOptions<IssueResponse, AssignIssueRequest>
): UseMutationResult<IssueResponse, Error, AssignIssueRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assignIssue(projectId, issueId, data),
    // Optimistic update
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: issueKeys.detail(issueId) });

      const previousIssue = queryClient.getQueryData<IssueResponse>(
        issueKeys.detail(issueId)
      );

      // Note: We can't optimistically update the full assignee object
      // since we only have the ID, so we just mark it as pending
      // The actual update happens on success

      return { previousIssue };
    },
    onSuccess: (data, variables) => {
      // Invalidate issue detail
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detailByKey(data.key) });

      // Invalidate issue lists (assignee changed)
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.myAssigned() });
      queryClient.invalidateQueries({ queryKey: issueKeys.unassigned(projectId) });

      // Invalidate history (assignment change recorded)
      queryClient.invalidateQueries({ queryKey: issueKeys.history(issueId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.projectHistory(projectId) });

      const message = data.assignee
        ? `Assigned to ${data.assignee.name}`
        : 'Issue unassigned';
      toast.success(message);

      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      if (context?.previousIssue) {
        queryClient.setQueryData(issueKeys.detail(issueId), context.previousIssue);
      }

      toast.error(error.message || 'Failed to update assignment');
      options?.onError?.(error, variables);
    },
  });
};

/**
 * Delete issue (soft delete)
 * Only OWNER/ADMIN can delete
 *
 * @param projectId - Project UUID
 * @param options - Success/error callbacks
 * @returns Mutation result
 *
 * @example
 * const { mutate: deleteIssue, isPending } = useDeleteIssue(projectId, {
 *   onSuccess: () => navigate(`/projects/${projectId}/issues`)
 * });
 *
 * deleteIssue(issueId);
 */
export const useDeleteIssue = (
  projectId: string,
  options?: MutationOptions<void, string>
): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (issueId) => deleteIssue(projectId, issueId),
    onSuccess: (data, issueId) => {
      // Remove deleted issue from cache
      queryClient.removeQueries({ queryKey: issueKeys.detail(issueId) });

      // Invalidate issue lists
      queryClient.invalidateQueries({ queryKey: issueKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.myAssigned() });
      queryClient.invalidateQueries({ queryKey: issueKeys.myReported() });

      // Invalidate project detail (issue count changes)
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });

      toast.success('Issue deleted successfully');
      navigate(`/projects/${projectId}/issues`);

      options?.onSuccess?.(data, issueId);
    },
    onError: (error, variables) => {
      toast.error(error.message || 'Failed to delete issue');
      options?.onError?.(error, variables);
    },
  });
};