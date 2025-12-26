/**
 * API Layer - Central export for all API functions and types
 */

// Export API client
export { default as apiClient, isAxiosError, clearAuthData } from '../api/client';

// Export Auth API functions
export {
    register,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    getCurrentUser,
} from './endpoints/auth.api';

// Export User API functions
export {
    searchUsers,
    getAllUsers,
    getUserById,
} from './endpoints/user.api';

// Export Project API functions
export {
    createProject,
    updateProject,
    getProjectById,
    getProjectByKey,
    deleteProject,
    archiveProject,
    restoreProject,
    getMyProjects,
    getArchivedProjects,
    getPublicProjects,
    searchProjects,
    checkProjectKeyExists,
} from './endpoints/project.api';

// Export Project Member API functions
export {
    addProjectMember,
    removeMember,
    updateMemberRole,
    transferOwnership,
    leaveProject,
    getProjectMembers,
    getProjectMember,
} from './endpoints/projectMember.api';

// Export Auth types
export type {
    UserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    MessageResponse,
    ApiErrorResponse,
    RoleResponse,
    PermissionResponse,
    UserMetadata,
    SessionMetadata,
} from './types/auth.types';

export { isApiErrorResponse } from './types/auth.types';

// Export User types
export type {
    UpdateUserRequest,
    ChangePasswordRequest,
} from './types/user.types';

// Export Project types
export type {
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
    PageResponse,
    PageableRequest,
} from './types/project.types';

// Export Project Member types
export type {
    ProjectMemberResponse,
    ProjectMemberSummary,
    ProjectMemberAddRequest,
    ProjectMemberUpdateRoleRequest,
    TransferOwnershipRequest,
    ProjectRole,
} from './types/projectMember.types';