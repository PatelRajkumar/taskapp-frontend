/**
 * ProjectForm Component
 * Form for creating or updating a project
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Typography,
} from '@mui/material';
import { Public, Lock } from '@mui/icons-material';
import { Button, Input } from '@/components/common';
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectData,
  type UpdateProjectData,
} from '@/schemas/project.schema';
import type { ProjectResponse } from '@/interceptors/types/project.types';

export interface ProjectFormProps {
  /**
   * Mode of the form
   */
  mode: 'create' | 'edit';
  /**
   * Existing project data (for edit mode)
   */
  project?: ProjectResponse;
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: CreateProjectData | UpdateProjectData) => void;
  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void;
  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean;
  /**
   * Error message to display
   */
  error?: string | null;
}

/**
 * ProjectForm - Reusable form for creating/editing projects
 * 
 * Features:
 * - Create or edit mode
 * - Zod validation
 * - React Hook Form integration
 * - Visibility radio buttons with icons
 * - Loading states
 * - Error display
 * 
 * @example Create mode
 * <ProjectForm
 *   mode="create"
 *   onSubmit={handleCreate}
 *   onCancel={handleCancel}
 *   isSubmitting={isPending}
 * />
 * 
 * @example Edit mode
 * <ProjectForm
 *   mode="edit"
 *   project={existingProject}
 *   onSubmit={handleUpdate}
 *   onCancel={handleCancel}
 *   isSubmitting={isPending}
 * />
 */
export const ProjectForm = ({
  mode,
  project,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}: ProjectFormProps) => {
  console.log('[ProjectForm] Rendering in', mode, 'mode');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectData | UpdateProjectData>({
    resolver: zodResolver(mode === 'create' ? createProjectSchema : updateProjectSchema),
    defaultValues: mode === 'edit' && project
      ? {
          name: project.name,
          description: project.description || '',
          visibility: project.visibility,
        }
      : {
          name: '',
          description: '',
          visibility: 'PRIVATE',
        },
  });

  const handleFormSubmit = (data: CreateProjectData | UpdateProjectData) => {
    console.log('[ProjectForm] Form submitted:', data);
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* Project Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Project Name"
            required
            autoFocus
            disabled={isSubmitting}
            error={!!errors.name}
            helperText={errors.name?.message}
            placeholder="e.g., Task Management System"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Project Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Description (optional)"
            multiline
            rows={4}
            disabled={isSubmitting}
            error={!!errors.description}
            helperText={errors.description?.message || 'Provide a brief description of your project'}
            placeholder="Describe what this project is about..."
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Visibility */}
      <Controller
        name="visibility"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.visibility} sx={{ mb: 3 }}>
            <FormLabel component="legend">
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Visibility
              </Typography>
            </FormLabel>
            <RadioGroup {...field} row>
              <FormControlLabel
                value="PRIVATE"
                control={<Radio disabled={isSubmitting} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock fontSize="small" />
                    <Box>
                      <Typography variant="body2">Private</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Only members can view
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="PUBLIC"
                control={<Radio disabled={isSubmitting} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Public fontSize="small" />
                    <Box>
                      <Typography variant="body2">Public</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Anyone can view
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
            {errors.visibility && (
              <FormHelperText>{errors.visibility.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      {/* Error Display */}
      {error && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === 'create' ? 'Create Project' : 'Update Project'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;