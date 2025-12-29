/**
 * IssueForm Component
 * Form for creating or updating an issue
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
import { BugReport, Assignment } from '@mui/icons-material';
import { Button, Input } from '@/components/common';
import { RichTextEditor } from './RichTextEditor';
import { MemberAutocomplete } from '@/components/projects';
import {
  createIssueSchema,
  updateIssueSchema,
  type CreateIssueData,
  type UpdateIssueData,
} from '@/schemas/issue.schema';
import type { IssueResponse } from '@/interceptors/types/issue.types';
import type { ProjectMemberSummary } from '@/interceptors/types/projectMember.types';

// Separate interfaces for create and edit modes
export interface IssueFormCreateProps {
  mode: 'create';
  issue?: never;
  projectMembers: ProjectMemberSummary[];
  onSubmit: (data: CreateIssueData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export interface IssueFormEditProps {
  mode: 'edit';
  issue: IssueResponse;
  projectMembers: ProjectMemberSummary[];
  onSubmit: (data: UpdateIssueData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export type IssueFormProps = IssueFormCreateProps | IssueFormEditProps;

/**
 * IssueForm - Reusable form for creating/editing issues
 */
export const IssueForm = (props: IssueFormProps) => {
  const { mode } = props;
  
  if (mode === 'create') {
    return <IssueFormCreate {...props} />;
  } else {
    return <IssueFormEdit {...props} />;
  }
};

/**
 * Create Issue Form
 */
const IssueFormCreate = ({
  projectMembers,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}: IssueFormCreateProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateIssueData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'TASK',
      priority: 'MEDIUM',
      assigneeId: '',
      dueDate: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Title"
            required
            autoFocus
            disabled={isSubmitting}
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="e.g., Fix login button alignment"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Description
            </Typography>
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Describe the issue in detail..."
              disabled={isSubmitting}
              error={!!errors.description}
            />
            {errors.description && (
              <FormHelperText error>{errors.description.message}</FormHelperText>
            )}
          </Box>
        )}
      />

      {/* Type */}
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.type} sx={{ mb: 3 }}>
            <FormLabel component="legend">
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Type
              </Typography>
            </FormLabel>
            <RadioGroup {...field} row>
              <FormControlLabel
                value="TASK"
                control={<Radio disabled={isSubmitting} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment fontSize="small" />
                    <Box>
                      <Typography variant="body2">Task</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Work to be done
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="BUG"
                control={<Radio disabled={isSubmitting} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BugReport fontSize="small" />
                    <Box>
                      <Typography variant="body2">Bug</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Something isn't working
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
            {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Priority */}
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.priority} sx={{ mb: 3 }}>
            <FormLabel component="legend">
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Priority
              </Typography>
            </FormLabel>
            <RadioGroup {...field} row>
              <FormControlLabel value="LOW" control={<Radio disabled={isSubmitting} />} label="Low" />
              <FormControlLabel value="MEDIUM" control={<Radio disabled={isSubmitting} />} label="Medium" />
              <FormControlLabel value="HIGH" control={<Radio disabled={isSubmitting} />} label="High" />
            </RadioGroup>
            {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Assignee */}
      <Controller
        name="assigneeId"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <MemberAutocomplete
              members={projectMembers}
              value={field.value || ''}
              onChange={field.onChange}
              label="Assignee"
              error={!!errors.assigneeId}
              helperText={errors.assigneeId?.message || 'Leave empty to create unassigned'}
              placeholder="Select a team member..."
              disabled={isSubmitting}
            />
          </Box>
        )}
      />

      {/* Due Date */}
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Due Date"
            type="date"
            disabled={isSubmitting}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message || 'Optional'}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Error */}
      {error && (
        <Box sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
          Create Issue
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Edit Issue Form
 */
const IssueFormEdit = ({
  issue,
  projectMembers,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}: IssueFormEditProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateIssueData>({
    resolver: zodResolver(updateIssueSchema),
    defaultValues: {
      title: issue.title,
      description: issue.description || '',
      priority: issue.priority,
      assigneeId: issue.assignee?.id || '',
      dueDate: issue.dueDate || '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Title"
            autoFocus
            disabled={isSubmitting}
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="e.g., Fix login button alignment"
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Description
            </Typography>
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Describe the issue in detail..."
              disabled={isSubmitting}
              error={!!errors.description}
            />
            {errors.description && (
              <FormHelperText error>{errors.description.message}</FormHelperText>
            )}
          </Box>
        )}
      />

      {/* Type - Read Only */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={500} gutterBottom>
          Type
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {issue.type === 'BUG' ? <BugReport fontSize="small" /> : <Assignment fontSize="small" />}
          <Typography variant="body2">{issue.type}</Typography>
          <Typography variant="caption" color="text.secondary">
            (cannot be changed)
          </Typography>
        </Box>
      </Box>

      {/* Priority */}
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" error={!!errors.priority} sx={{ mb: 3 }}>
            <FormLabel component="legend">
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Priority
              </Typography>
            </FormLabel>
            <RadioGroup {...field} row>
              <FormControlLabel value="LOW" control={<Radio disabled={isSubmitting} />} label="Low" />
              <FormControlLabel value="MEDIUM" control={<Radio disabled={isSubmitting} />} label="Medium" />
              <FormControlLabel value="HIGH" control={<Radio disabled={isSubmitting} />} label="High" />
            </RadioGroup>
            {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Assignee */}
      <Controller
        name="assigneeId"
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <MemberAutocomplete
              members={projectMembers}
              value={field.value || ''}
              onChange={field.onChange}
              label="Assignee"
              error={!!errors.assigneeId}
              helperText={errors.assigneeId?.message || 'Leave empty for unassigned'}
              placeholder="Select a team member..."
              disabled={isSubmitting}
            />
          </Box>
        )}
      />

      {/* Due Date */}
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Due Date"
            type="date"
            disabled={isSubmitting}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message || 'Optional'}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
          />
        )}
      />

      {/* Error */}
      {error && (
        <Box sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
          Update Issue
        </Button>
      </Box>
    </Box>
  );
};

export default IssueForm;