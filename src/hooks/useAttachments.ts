import { PageableRequest, PageResponse } from "@/interceptors"
import { AttachmentResponse, AttachmentSummary } from "@/interceptors/types/attachment.types"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { generateDownloadUrl, getAttachment, getAttachmentCount, getIssueAttachments } from "@/interceptors/endpoints/attachment.api";
export const attachmentKeys = {
    all: ['attachments'] as const,
    lists: () => [...attachmentKeys.all, 'lists'] as const,
    list: (issueId: string, params?: PageableRequest) => [...attachmentKeys.lists(), issueId, params] as const,
    details: () => [...attachmentKeys.all, 'details'] as const,
    detail: (attachmentId: string) => [...attachmentKeys.details(), attachmentId] as const,
    count: (issueId: string) => [...attachmentKeys.all, 'issue', issueId, 'count'] as const,
    downloadUrl: (attachmentId: string) => [...attachmentKeys.all, 'downloadUrl', attachmentId] as const,
}

export const useIssueAttachments = (issueId: string, params?: PageableRequest): UseQueryResult<PageResponse<AttachmentSummary>, Error> => {
    return useQuery({
        queryKey: attachmentKeys.list(issueId, params),
        queryFn: () => getIssueAttachments(issueId, params),
        enabled: !!issueId,
        staleTime: 3 * 60 * 1000,
    });
}

export const useAttachmentDetail = (attachmentId: string): UseQueryResult<AttachmentResponse, Error> => {
    return useQuery({
        queryKey: attachmentKeys.detail(attachmentId),
        queryFn: () => getAttachment(attachmentId),
        enabled: !!attachmentId,
        staleTime: 3 * 60 * 1000,
    });
}

export const useAttachmentCount = (issueId: string): UseQueryResult<number, Error> => {
    return useQuery({
        queryKey: attachmentKeys.count(issueId),
        queryFn: () => getAttachmentCount(issueId),
        enabled: !!issueId,
        staleTime: 3 * 60 * 1000,
    });
}

export const useAttachmentDownloadUrl = (
    attachmentId: string,
    enabled: boolean = false // Disabled by default
) => {
    return useQuery({
        queryKey: attachmentKeys.downloadUrl(attachmentId),
        queryFn: () => generateDownloadUrl(attachmentId),
        enabled: enabled && !!attachmentId,
        staleTime: 50 * 60 * 1000, // 50 minutes (URL expires after 1 hour)
        gcTime: 55 * 60 * 1000,
    })
}