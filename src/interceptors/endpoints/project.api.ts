import apiClient, { isAxiosError } from "@/api/client";
import { CreateProjectRequest, PageableRequest, PageResponse, ProjectResponse, UpdateProjectRequest } from "../types/project.types";
import { ApiErrorResponse } from "../types/auth.types";
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

        // ✅ Project-specific error codes
        if (error.response?.status === 400) {
            return 'Invalid project data';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to perform this action';
        }

        if (error.response?.status === 404) {
            return 'Project not found';
        }

        if (error.response?.status === 409) {
            return 'Project key already exists';
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

export const createProject = async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    try {
        const response = await apiClient.post<ProjectResponse>('/projects', data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const updateProject = async (projectId: string, data: UpdateProjectRequest): Promise<ProjectResponse> => {
    try {
        const response = await apiClient.put<ProjectResponse>(`/projects/${projectId}`, data);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getProjectById = async (projectId: string): Promise<ProjectResponse> => {
    try {
        const response = await apiClient.get<ProjectResponse>(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getProjectByKey = async (projectKey: string): Promise<ProjectResponse> => {
    try {
        const response = await apiClient.get<ProjectResponse>(`/projects/key/${projectKey}`);
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        await apiClient.delete<void>(`/projects/${projectId}`);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const archiveProject = async (projectId: string): Promise<void> => {
    try {
        await apiClient.post<void>(`/projects/${projectId}/archive`);

    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const restoreProject = async (projectId: string): Promise<void> => {
    try {
        await apiClient.post<void>(`/projects/${projectId}/restore`);
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getMyProjects = async (params?: PageableRequest): Promise<PageResponse<ProjectResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<ProjectResponse>>('/projects/my-projects', { params });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getArchivedProjects = async (params?: PageableRequest): Promise<PageResponse<ProjectResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<ProjectResponse>>('/projects/archived', { params });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const getPublicProjects = async (params?: PageableRequest): Promise<PageResponse<ProjectResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<ProjectResponse>>('/projects/list/public', { params });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const searchProjects = async (searchTerm: string,
    params?: PageableRequest): Promise<PageResponse<ProjectResponse>> => {
    try {
        const response = await apiClient.get<PageResponse<ProjectResponse>>('/projects/search', {
            params: { searchTerm, ...params },
        });
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};

export const checkProjectKeyExists = async (
    key: string
): Promise<boolean> => {
    try {
        const response = await apiClient.get<boolean>(
            `/projects/exists/${key}`
        );
        return response.data;
    } catch (error) {
        const message = getErrorMessage(error);
        throw new Error(message);
    }
};