import { z } from 'zod';
import { ISSUE_STATUS, ISSUE_PRIORITY, ISSUE_TYPE } from '@/utils/constants';
import { uuidRegex } from './projectMember.schema';

// ============================================================================
// Create Issue Schema
// ============================================================================

/**
 * Create Issue Schema
 * Matches backend IssueCreateRequestDTO validation
 * 
 * Backend validation rules:
 * - title: required, 3-500 characters
 * - description: optional, max 5000 characters
 * - type: defaults to TASK if not specified
 * - priority: defaults to MEDIUM if not specified
 * - dueDate: optional, future date validation
 * - assigneeId: optional UUID, must be project member (validated in backend)
 */
export const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, 'Issue title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(500, 'Title must not exceed 500 characters'),

  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .optional()
    .or(z.literal('')),

  type: z
    .enum([ISSUE_TYPE.TASK, ISSUE_TYPE.BUG], {
      message: 'Type must be either TASK or BUG',
    })
    ,

  priority: z
    .enum([ISSUE_PRIORITY.LOW, ISSUE_PRIORITY.MEDIUM, ISSUE_PRIORITY.HIGH], {
      message: 'Priority must be LOW, MEDIUM, or HIGH',
    })
    ,

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'Due date must be today or in the future' }
    )
    .optional()
    .or(z.literal('')),

  assigneeId: z
    .string()
    .regex(uuidRegex, 'Assignee ID must be a valid UUID')
    .optional()
    .or(z.literal('')),
});

export type CreateIssueData = z.infer<typeof createIssueSchema>;

// ============================================================================
// Update Issue Schema
// ============================================================================

/**
 * Update Issue Schema
 * Matches backend IssueUpdateRequestDTO validation
 * 
 * Backend validation rules:
 * - All fields optional
 * - At least one field must be provided
 * - title: if provided, 3-500 characters
 * - description: if provided, max 5000 characters
 * - dueDate: if provided, future date validation
 * - Note: Status updates use separate endpoint
 */
export const updateIssueSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(500, 'Title must not exceed 500 characters')
    .optional(),

  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .optional()
    .or(z.literal('')),

  priority: z
    .enum([ISSUE_PRIORITY.LOW, ISSUE_PRIORITY.MEDIUM, ISSUE_PRIORITY.HIGH], {
      message: 'Priority must be LOW, MEDIUM, or HIGH',
    })
    .optional(),

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'Due date must be today or in the future' }
    )
    .optional()
    .or(z.literal('')),

  assigneeId: z
    .string()
    .regex(uuidRegex, 'Assignee ID must be a valid UUID')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // At least one field must be provided
    return (
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.dueDate !== undefined ||
      data.assigneeId !== undefined
    );
  },
  {
    message: 'At least one field must be provided for update',
  }
);

export type UpdateIssueData = z.infer<typeof updateIssueSchema>;

// ============================================================================
// Update Issue Status Schema
// ============================================================================

/**
 * Update Issue Status Schema
 * Matches backend IssueUpdateStatusRequestDTO validation
 * 
 * Backend validation rules:
 * - newStatus: required, must follow workflow (TODO → INPROGRESS → DONE)
 * - reason: optional, max 500 characters
 * 
 * Note: Workflow validation (TODO → INPROGRESS → DONE) is enforced by backend
 */
export const updateIssueStatusSchema = z.object({
  newStatus: z.enum(
    [ISSUE_STATUS.TODO, ISSUE_STATUS.INPROGRESS, ISSUE_STATUS.DONE],
    {
      message: 'Status must be TODO, INPROGRESS, or DONE',
    }
  ),

  reason: z
    .string()
    .max(500, 'Reason must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type UpdateIssueStatusData = z.infer<typeof updateIssueStatusSchema>;

// ============================================================================
// Assign Issue Schema
// ============================================================================

/**
 * Assign Issue Schema
 * Matches backend IssueAssignRequestDTO validation
 * 
 * Backend validation rules:
 * - assigneeId: optional (null/undefined to unassign)
 * - Must be valid UUID
 * - Assignee must be project member (validated in backend)
 */
export const assignIssueSchema = z.object({
  assigneeId: z
    .string()
    .regex(uuidRegex, 'Assignee ID must be a valid UUID')
    .optional()
    .or(z.literal(''))
    .or(z.null()),
});

export type AssignIssueData = z.infer<typeof assignIssueSchema>;