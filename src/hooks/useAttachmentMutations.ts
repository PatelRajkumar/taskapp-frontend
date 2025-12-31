import { AttachmentResponse, deleteAttachment, uploadAttachment } from "@/interceptors";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { attachmentKeys } from "./useAttachments";
import { issueKeys } from "./useIssues";

interface MutationOptions<TData = unknown, TVariables = unknown> {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
}
interface UploadMutationOptions {
    onProgress?: (progressPercent: number) => void; // Added
    onSuccess?: (data: AttachmentResponse, file: File) => void;
    onError?: (error: Error, file: File) => void;
}
export const useUploadAttachment = (issueId: string, options?: UploadMutationOptions): UseMutationResult<AttachmentResponse, Error, File> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => uploadAttachment(issueId, file, options?.onProgress),
        onSuccess: (data, file) => {
            // Remove the specific attachment from cache
            queryClient.invalidateQueries({
                queryKey: attachmentKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: attachmentKeys.count(issueId),
            });
            queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
            toast.success("Attachment uploaded successfully");
            options?.onSuccess?.(data, file);
        },
        onError: (error, file) => {
            toast.error(error.message || "Failed to upload attachment");
            options?.onError?.(error, file);
        }
    })
}

export const useDeleteAttachment = (issueId: string, options?: MutationOptions<void, string>): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (attachmentId: string) => deleteAttachment(attachmentId),
        onSuccess: (data, attachmentId) => {
            queryClient.removeQueries({
                queryKey: attachmentKeys.detail(attachmentId),
            });
            queryClient.invalidateQueries({
                queryKey: attachmentKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: attachmentKeys.count(issueId),
            });
            queryClient.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
            toast.success("Attachment deleted successfully");
            options?.onSuccess?.(data, attachmentId);
        },
        onError: (error, attachmentId) => {
            toast.error(error.message || "Failed to delete attachment");
            options?.onError?.(error, attachmentId);
        }
    })
}

