import { z } from 'zod';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PROJECT_ROLES = ['ADMIN', 'MEMBER', 'VIEWER'] as const;


export const addProjectMemberSchema = z.object({
    userId: z
        .string()
        .min(1, 'User ID is required')
        .regex(uuidRegex, 'User ID must be a valid UUID'),

    role: z
        .enum(PROJECT_ROLES, {
            message: 'Role must be ADMIN, MEMBER, or VIEWER',
        })
        .default('MEMBER')
        .optional(),
});

export type AddProjectMemberData = z.infer<typeof addProjectMemberSchema>;

export const updateProjectMemberRoleSchema = z.object({
    role: z.enum(PROJECT_ROLES, {
        message: 'Role must be ADMIN, MEMBER, or VIEWER',
    }),
});
export type UpdateProjectMemberRoleData = z.infer<typeof updateProjectMemberRoleSchema>;

export const transferOwnershipSchema = z.object({
    newOwnerUserId: z
        .string()
        .min(1, 'New Owner User ID is required')
        .regex(uuidRegex, 'New Owner User ID must be a valid UUID'),
});

export type TransferOwnershipData = z.infer<typeof transferOwnershipSchema>;