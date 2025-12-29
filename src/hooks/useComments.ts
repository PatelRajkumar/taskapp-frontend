import { PageableRequest, PageResponse } from "@/interceptors"
import { countIssueComments, getCommentById, getIssueComments } from "@/interceptors/endpoints/comment.api"
import { CommentResponse, CommentSummary } from "@/interceptors/types/comment.types"
import { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
export const commentKeys = {
    all: ['comments'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (issueId: string, params?: PageableRequest) => [...commentKeys.lists(), issueId, params] as const,
    count: (issueId: string) => [...commentKeys.all, 'count', issueId] as const,
    detail: (issueId: string, commentId: string) => [...commentKeys.all, issueId, 'detail', commentId] as const,
}
export const useIssueComments = (issueId: string,
    params?: PageableRequest,
    enabled: boolean = true
): UseQueryResult<PageResponse<CommentSummary>, Error> => {
    return useQuery({
        queryKey: commentKeys.list(issueId, params),
        queryFn: () => getIssueComments(issueId, params),
        enabled: enabled && !!issueId,
        staleTime: 3 * 60 * 1000,
    });
}

export const useCommentDetail = (issueId: string, commentId: string): UseQueryResult<CommentResponse, Error> => {
    return useQuery({
        queryKey: commentKeys.detail(issueId, commentId),
        queryFn: () => getCommentById(issueId, commentId),
        enabled: !!issueId && !!commentId,
        staleTime: 3 * 60 * 1000,
    });
}

export const useCommentCount = (issueId: string): UseQueryResult<number, Error> => {
    return useQuery({
        queryKey: commentKeys.count(issueId),
        queryFn: () => countIssueComments(issueId),
        enabled: !!issueId,
        staleTime: 3 * 60 * 1000,
    });
}