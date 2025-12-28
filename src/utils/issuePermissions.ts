/**
 * Issue Permission Utilities
 * 
 * Calculates permissions for issue operations based on:
 * - User's project role (OWNER, ADMIN, MEMBER, VIEWER)
 * - Current user ID
 * - Issue assignee
 * 
 * IMPORTANT: IssueSummary does NOT have reporter field (backend limitation)
 * So for cards (IssueSummary), we can only check assignee
 * For detail dialog (IssueResponse), we can check both reporter and assignee
 * 
 * Permission Rules (matches backend IssueServiceImpl.canEditIssue):
 * - OWNER/ADMIN: Can edit/delete/change status on ALL issues
 * - MEMBER: Can edit/change status ONLY if they are reporter OR assignee
 * - MEMBER: Cannot delete (only OWNER/ADMIN can delete)
 * - VIEWER: Cannot edit/delete/change status anything
 */

import type { IssueSummary, IssueResponse } from '@/interceptors/types/issue.types';
import type { ProjectRole } from '@/interceptors/types/projectMember.types';

/**
 * Check if user can edit an issue (IssueSummary version - for cards)
 * 
 * Limitation: IssueSummary doesn't have reporter field, so can only check assignee
 * This means MEMBER users might not see edit button on cards they reported but aren't assigned to
 * They WILL see the button in detail dialog (IssueResponse) which has reporter
 * 
 * @param issue - Issue summary (from list)
 * @param currentUserRole - User's role in project
 * @param currentUserId - Current user's ID
 * @returns true if user can edit this issue
 */
export function canEditIssueSummary(
  issue: IssueSummary,
  currentUserRole: ProjectRole | string | undefined,
  currentUserId: string
): boolean {
  // OWNER/ADMIN can edit all issues
  if (currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') {
    return true;
  }

  // MEMBER can edit if they are assignee
  // NOTE: Can't check reporter because IssueSummary doesn't have that field
  if (currentUserRole === 'MEMBER') {
    const isAssignee = issue.assignee?.id === currentUserId;
    return isAssignee;
  }

  // VIEWER cannot edit
  return false;
}

/**
 * Check if user can edit an issue (IssueResponse version - for detail dialog)
 * 
 * This is more accurate because IssueResponse has both reporter and assignee
 * 
 * @param issue - Full issue response (from detail query)
 * @param currentUserRole - User's role in project
 * @param currentUserId - Current user's ID
 * @returns true if user can edit this issue
 */
export function canEditIssueResponse(
  issue: IssueResponse,
  currentUserRole: ProjectRole | string | undefined,
  currentUserId: string
): boolean {
  // OWNER/ADMIN can edit all issues
  if (currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') {
    return true;
  }

  // MEMBER can edit if they are reporter OR assignee
  if (currentUserRole === 'MEMBER') {
    const isReporter = issue.reporter?.id === currentUserId;
    const isAssignee = issue.assignee?.id === currentUserId;
    return isReporter || isAssignee;
  }

  // VIEWER cannot edit
  return false;
}

/**
 * Check if user can delete an issue
 * 
 * Only OWNER and ADMIN can delete issues
 * This applies to both IssueSummary and IssueResponse (role-based only)
 * 
 * @param currentUserRole - User's role in project
 * @returns true if user can delete issues
 */
export function canDeleteIssue(
  currentUserRole: ProjectRole | string | undefined
): boolean {
  return currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';
}

/**
 * Check if user can change issue status (IssueSummary version)
 * 
 * Same rules as canEdit - OWNER/ADMIN or assignee
 * 
 * @param issue - Issue summary (from list)
 * @param currentUserRole - User's role in project
 * @param currentUserId - Current user's ID
 * @returns true if user can change status
 */
export function canChangeStatusSummary(
  issue: IssueSummary,
  currentUserRole: ProjectRole | string | undefined,
  currentUserId: string
): boolean {
  // Same permissions as edit
  return canEditIssueSummary(issue, currentUserRole, currentUserId);
}

/**
 * Check if user can change issue status (IssueResponse version)
 * 
 * Same rules as canEdit - OWNER/ADMIN or reporter/assignee
 * 
 * @param issue - Full issue response (from detail query)
 * @param currentUserRole - User's role in project
 * @param currentUserId - Current user's ID
 * @returns true if user can change status
 */
export function canChangeStatusResponse(
  issue: IssueResponse,
  currentUserRole: ProjectRole | string | undefined,
  currentUserId: string
): boolean {
  // Same permissions as edit
  return canEditIssueResponse(issue, currentUserRole, currentUserId);
}