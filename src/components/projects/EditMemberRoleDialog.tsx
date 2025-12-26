/**
 * EditMemberRoleDialog Component
 * Dialog for changing a project member's role
 */

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close, Edit, AdminPanelSettings, Person, Visibility } from '@mui/icons-material';
import { Button } from '@/components/common';
import {
  updateProjectMemberRoleSchema,
  type UpdateProjectMemberRoleData,
} from '@/schemas/projectMember.schema';
import type { ProjectMemberSummary } from '@/interceptors/types/projectMember.types';

export interface EditMemberRoleDialogProps {
  /**
   * Whether dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog should close
   */
  onClose: () => void;
  /**
   * Callback when form is submitted
   */
  onSubmit: (data: UpdateProjectMemberRoleData) => void;
  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean;
  /**
   * Error message to display
   */
  error?: string | null;
  /**
   * Member whose role is being edited
   */
  member: ProjectMemberSummary | null;
}

/**
 * EditMemberRoleDialog - Modal for changing member role
 * 
 * Features:
 * - Role selection (ADMIN, MEMBER, VIEWER)
 * - Shows current member info
 * - Zod validation
 * - Loading states
 * - Error display
 * 
 * @example
 * <EditMemberRoleDialog
 *   open={dialogOpen}
 *   onClose={handleClose}
 *   onSubmit={handleEditRole}
 *   isSubmitting={isPending}
 *   error={error?.message}
 *   member={selectedMember}
 * />
 */
export const EditMemberRoleDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
  member,
}: EditMemberRoleDialogProps) => {
  console.log('[EditMemberRoleDialog] Dialog open:', open, 'Member:', member?.user.name);

  // Get default role - exclude OWNER since it can't be assigned via role change
  const getDefaultRole = (): 'ADMIN' | 'MEMBER' | 'VIEWER' => {
    if (!member || member.role === 'OWNER') {
      return 'MEMBER';
    }
    return member.role as 'ADMIN' | 'MEMBER' | 'VIEWER';
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectMemberRoleData>({
    resolver: zodResolver(updateProjectMemberRoleSchema),
    defaultValues: {
      role: getDefaultRole(),
    },
  });

  // Reset form when member changes
  useEffect(() => {
    if (member) {
      reset({ role: getDefaultRole() });
    }
  }, [member, reset]);

  const handleFormSubmit = (data: UpdateProjectMemberRoleData) => {
    console.log('[EditMemberRoleDialog] Form submitted:', data);
    onSubmit(data);
  };

  const handleClose = () => {
    console.log('[EditMemberRoleDialog] Closing dialog');
    reset();
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(handleFormSubmit),
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <Edit color="primary" />
        <Typography variant="h6" component="span">
          Change Member Role
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Member Info */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Member
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {member.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {member.user.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Current Role
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {member.roleDisplayName}
            </Typography>
          </Box>

          {/* Role Selection */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset" error={!!errors.role}>
                <FormLabel component="legend">
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    New Role *
                  </Typography>
                </FormLabel>
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="ADMIN"
                    control={<Radio disabled={isSubmitting} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettings fontSize="small" />
                        <Box>
                          <Typography variant="body2">Admin</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can manage members and edit project
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="MEMBER"
                    control={<Radio disabled={isSubmitting} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        <Box>
                          <Typography variant="body2">Member</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can create and manage issues
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="VIEWER"
                    control={<Radio disabled={isSubmitting} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Visibility fontSize="small" />
                        <Box>
                          <Typography variant="body2">Viewer</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can only view the project
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </RadioGroup>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Error Display */}
          {error && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'error.light',
                color: 'error.contrastText',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Change Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMemberRoleDialog;