export enum ProjectVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

/**
 * Create project request (matches backend ProjectCreateRequestDTO)
 */
export interface CreateProjectRequest {
    name: string;
    description?: string;
    visibility?: ProjectVisibility;
}

/**
 * Update project request (matches backend ProjectUpdateRequestDTO)
 */
export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    visibility?: ProjectVisibility;
}


export interface UserSummary {
    id: string,
    email: string,
    name: string,
    avatarUrl?: string,
}

export interface ProjectResponse {
    id: string;
    key: string;
    name: string;
    description?: string;
    visibility: ProjectVisibility;
    isArchived: boolean;
    archivedAt?: string;
    createdBy: UserSummary;
    memberCount: number;
    issueCount: number;
    currentUserRole?: string; // OWNER, ADMIN, MEMBER, VIEWER
    createdAt: string;
    updatedAt?: string;
}

export interface PageableRequest {
    page?: number;       // 0-indexed
    size?: number;       // Default: 20
    sort?: string;       // e.g., "name,asc" or "createdAt,desc"
}
export interface ProjectSummary {
    id: string;
    key: string;
    name: string;
    visibility: ProjectVisibility;
    isArchived: boolean;
}
/**
 * Page response (matches Spring Data Page)
 */
export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}