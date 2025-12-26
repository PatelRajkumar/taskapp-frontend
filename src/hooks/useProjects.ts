/**
 * Project Query Hooks
 * Handles all read operations (GET requests) for projects
 * Uses TanStack Query for caching, background refetching, and loading states
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getMyProjects,
  getArchivedProjects,
  getPublicProjects,
  searchProjects,
  getProjectById,
  getProjectByKey,
} from '@/interceptors/endpoints/project.api';
import { getProjectMembers as getMembers, getProjectMember } from '@/interceptors/endpoints/projectMember.api';
import type {
  ProjectResponse,
  PageResponse,
  PageableRequest,
} from '@/interceptors/types/project.types';
import type {
  ProjectMemberSummary,
  ProjectMemberResponse,
} from '@/interceptors/types/projectMember.types';

/**
 * Query Keys for Projects
 * Hierarchical structure allows targeted cache invalidation
 */
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: PageableRequest) => [...projectKeys.lists(), filters] as const,
  archived: (filters?: PageableRequest) => [...projectKeys.all, 'archived', filters] as const,
  public: (filters?: PageableRequest) => [...projectKeys.all, 'public', filters] as const,
  search: (searchTerm: string, filters?: PageableRequest) =>
    [...projectKeys.all, 'search', searchTerm, filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  members: (projectId: string) => [...projectKeys.detail(projectId), 'members'] as const,
  member: (projectId: string, userId: string) =>
    [...projectKeys.members(projectId), userId] as const,
};

/**
 * Get current user's projects (paginated)
 * Excludes archived projects unless user is OWNER
 *
 * @param params - Pagination parameters
 * @returns Query result with project list
 *
 * @example
 * const { data, isLoading, error } = useUserProjects({ page: 0, size: 20 });
 * console.log(data?.content); // Array of projects
 * console.log(data?.totalPages); // Total pages available
 */
export const useUserProjects = (
  params?: PageableRequest
): UseQueryResult<PageResponse<ProjectResponse>, Error> => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getMyProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get archived projects where user is OWNER (paginated)
 *
 * @param params - Pagination parameters
 * @returns Query result with archived project list
 *
 * @example
 * const { data, isLoading } = useArchivedProjects({ page: 0, size: 10 });
 */
export const useArchivedProjects = (
  params?: PageableRequest
): UseQueryResult<PageResponse<ProjectResponse>, Error> => {
  return useQuery({
    queryKey: projectKeys.archived(params),
    queryFn: () => getArchivedProjects(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get all public projects (paginated)
 * No authentication required
 *
 * @param params - Pagination parameters
 * @returns Query result with public project list
 *
 * @example
 * const { data, isLoading } = usePublicProjects({ page: 0, size: 20 });
 */
export const usePublicProjects = (
  params?: PageableRequest
): UseQueryResult<PageResponse<ProjectResponse>, Error> => {
  return useQuery({
    queryKey: projectKeys.public(params),
    queryFn: () => getPublicProjects(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Search projects by name or key (paginated)
 *
 * @param searchTerm - Search query (name or key)
 * @param params - Pagination parameters
 * @param enabled - Whether to execute query (default: true if searchTerm provided)
 * @returns Query result with search results
 *
 * @example
 * const { data, isLoading } = useSearchProjects('task', { page: 0, size: 10 });
 */
export const useSearchProjects = (
  searchTerm: string,
  params?: PageableRequest,
  enabled: boolean = true
): UseQueryResult<PageResponse<ProjectResponse>, Error> => {
  return useQuery({
    queryKey: projectKeys.search(searchTerm, params),
    queryFn: () => searchProjects(searchTerm, params),
    enabled: enabled && searchTerm.length > 0, // Only search if term provided
    staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
  });
};

/**
 * Get single project by ID
 * Requires membership or public project
 *
 * @param projectId - Project ID
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with project details
 *
 * @example
 * const { data: project, isLoading, error } = useProject(projectId);
 */
export const useProject = (
  projectId: string,
  enabled: boolean = true
): UseQueryResult<ProjectResponse, Error> => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get single project by key
 * Requires membership or public project
 *
 * @param projectKey - Project key (e.g., "PROJ-1")
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with project details
 *
 * @example
 * const { data: project, isLoading } = useProjectByKey('PROJ-1');
 */
export const useProjectByKey = (
  projectKey: string,
  enabled: boolean = true
): UseQueryResult<ProjectResponse, Error> => {
  return useQuery({
    queryKey: [...projectKeys.all, 'key', projectKey] as const,
    queryFn: () => getProjectByKey(projectKey),
    enabled: enabled && !!projectKey,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get all members of a project
 * Returns List (not paginated on backend)
 * Requires project membership
 *
 * @param projectId - Project ID
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with member list
 *
 * @example
 * const { data: members, isLoading } = useProjectMembers(projectId);
 * members?.forEach(member => console.log(member.user.name, member.role));
 */
export const useProjectMembers = (
  projectId: string,
  enabled: boolean = true
): UseQueryResult<ProjectMemberSummary[], Error> => {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => getMembers(projectId),
    enabled: enabled && !!projectId,
    staleTime: 3 * 60 * 1000, // 3 minutes (member list changes less frequently)
  });
};

/**
 * Get specific member details
 * Requires project membership
 *
 * @param projectId - Project ID
 * @param userId - User ID
 * @param enabled - Whether to execute query (default: true)
 * @returns Query result with member details
 *
 * @example
 * const { data: member, isLoading } = useProjectMember(projectId, userId);
 */
export const useProjectMember = (
  projectId: string,
  userId: string,
  enabled: boolean = true
): UseQueryResult<ProjectMemberResponse, Error> => {
  return useQuery({
    queryKey: projectKeys.member(projectId, userId),
    queryFn: () => getProjectMember(projectId, userId),
    enabled: enabled && !!projectId && !!userId,
    staleTime: 3 * 60 * 1000,
  });
};