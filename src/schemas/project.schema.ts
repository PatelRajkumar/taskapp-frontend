import { z } from 'zod';

const PROJECT_VISIBILITIES = ['PUBLIC', 'PRIVATE'] as const;
export const createProjectSchema = z.object({
    name: z
        .string()
        .min(1, 'Project name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(255, 'Project name must not exceed 255 characters'),

    description: z
        .string()
        .max(5000, 'Description must not exceed 5000 characters')
        .optional()
        .or(z.literal('')),

    visibility: z.enum(['PUBLIC', 'PRIVATE'])
        .default('PRIVATE')
});

export type CreateProjectData = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(255, 'Project name must not exceed 255 characters')
        .optional(),

    description: z
        .string()
        .max(5000, 'Description must not exceed 5000 characters')
        .optional()
        .or(z.literal('')),

    visibility: z.enum(PROJECT_VISIBILITIES, {
        message: 'Visibility must be either PUBLIC or PRIVATE',
    }).optional()

}).refine((data) => data.name || data.description || data.visibility !== undefined, {
    message: 'At least one field must be provided for update',
});

export type UpdateProjectData = z.infer<typeof updateProjectSchema>;

