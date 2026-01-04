import type {
    CommentResponse,
    CommentSummary,
    CreateCommentRequest,
    UpdateCommentRequest
} from "../types/comment.types";
import type { PageableRequest, PageResponse } from "../types/project.types";
import type { ApiErrorResponse } from "../types/auth.types";
import { isAxiosError } from "axios";
import apiClient from "@/api/client";

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        if (data && data?.message) {
            return data.message;
        }
        if (data && data?.details) {
            const fieldErrors = Object.values(data.details).join(", ");
            return fieldErrors || "Validation error occurred";
        }

        //Comments specific error handling
        if (error.response?.status === 400) {
            return "Invalid comment data provided.";
        }
        if (error.response?.status === 404) {
            return "Comment not found.";
        }
        if (error.response?.status === 403) {
            return "You do not have permission to perform this action on the comment.";
        }
        if (error.response?.status === 410) {
            return "This comment has been deleted"
        }
        if (error.response?.status === 500) {
            return "Server error. Please try again later"
        }
        if (error.message === 'Network Error') {
            return 'Unable to connect to server';
        }
    }
    return "An unexpected error occurred";
}

export const createComment = async (issueId: string, data: CreateCommentRequest): Promise<CommentResponse> => {
    try {
        const response = await apiClient.post<CommentResponse>(`/issues/${issueId}/comments`, data);
        return response.data;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

export const updateComment = async (issueId: string, commentId: string, data: UpdateCommentRequest): Promise<CommentResponse> => {
    try {
        const response = await apiClient.put<CommentResponse>(`/issues/${issueId}/comments/${commentId}`, data);
        return response.data;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

export const deleteComment = async (issueId: string, commentId: string): Promise<void> => {
    try {
        await apiClient.delete<void>(`/issues/${issueId}/comments/${commentId}`);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

export const getCommentById = async (issueId: string, commentId: string): Promise<CommentResponse> => {
    try {
        const response = await apiClient.get<CommentResponse>(`/issues/${issueId}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

export const getIssueComments = async (issueId: string, params?: PageableRequest): Promise<PageResponse<CommentSummary>> => {
    try {
        const response = await apiClient.get<PageResponse<CommentSummary>>(`/issues/${issueId}/comments`, { params });
        return response.data;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

export const countIssueComments = async (issueId: string): Promise<number> => {
    try {
        const response = await apiClient.get<number>(`/issues/${issueId}/comments/count`);
        return response.data;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};