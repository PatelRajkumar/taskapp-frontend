import { createComment, deleteComment, updateComment } from "@/interceptors/endpoints/comment.api";
import { CommentResponse, CreateCommentRequest, UpdateCommentRequest } from "@/interceptors/types/comment.types";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "./useComments";
import toast from "react-hot-toast";

interface MutationOptions<TData = unknown, TVariables = unknown> {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
}

export const useCreateComment = (issueId: string, options?: MutationOptions<CommentResponse, CreateCommentRequest>): UseMutationResult<CommentResponse, Error, CreateCommentRequest> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCommentRequest) => createComment(issueId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.count(issueId)
            });
            toast.success("Comment created successfully");
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || "Failed to create comment");
            options?.onError?.(error, variables);
        }
    });
}

export const useUpdateComment = (issueId: string, commentId: string, options?: MutationOptions<CommentResponse, UpdateCommentRequest>): UseMutationResult<CommentResponse, Error, UpdateCommentRequest> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateCommentRequest) => updateComment(issueId, commentId, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.count(issueId)
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.detail(issueId, commentId)
            });
            toast.success("Comment updated successfully");
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            toast.error(error.message || "Failed to update comment");
            options?.onError?.(error, variables);
        }
    });
}

export const useDeleteComment = (issueId: string, options?: MutationOptions<void, string>): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(issueId, commentId),
        onSuccess: (data, commentId) => {
            // Remove the specific comment from cache
            queryClient.removeQueries({
                queryKey: commentKeys.detail(issueId, commentId)
            });

            // Then invalidate lists/count to refetch
            queryClient.invalidateQueries({
                queryKey: commentKeys.lists()
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.count(issueId)
            });
            toast.success("Comment deleted successfully");
            options?.onSuccess?.(data, commentId);
        },
        onError: (error, commentId) => {
            toast.error(error.message || "Failed to delete comment");
            options?.onError?.(error, commentId);
        }
    });
}

