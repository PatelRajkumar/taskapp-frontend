/**
 * AddMemberDialog Component
 * Dialog for adding a new member to a project
 */

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
import { Close, PersonAdd, AdminPanelSettings, Person, Visibility } from '@mui/icons-material';
import { Button } from '@/components/common';
import { UserAutocomplete } from '@/components/common/UserAutocomplete';
import {
  addProjectMemberSchema,
  type AddProjectMemberData,
} from '@/schemas/projectMember.schema';

export interface AddMemberDialogProps {
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
  onSubmit: (data: AddProjectMemberData) => void;
  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean;
  /**
   * Error message to display
   */
  error?: string | null;
  /**
   * Array of existing member user IDs to exclude from search
   */
  existingMemberIds?: string[];
}

/**
 * AddMemberDialog - Modal for adding new project members
 * 
 * Features:
 * - User search with autocomplete
 * - Role selection (ADMIN, MEMBER, VIEWER)
 * - Excludes existing members from search
 * - Zod validation
 * - Loading states
 * - Error display
 * 
 * @example
 * <AddMemberDialog
 *   open={dialogOpen}
 *   onClose={handleClose}
 *   onSubmit={handleAddMember}
 *   isSubmitting={isPending}
 *   error={error?.message}
 *   existingMemberIds={members.map(m => m.user.id)}
 * />
 */
export const AddMemberDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
  existingMemberIds = [],
}: AddMemberDialogProps) => {
  console.log('[AddMemberDialog] Dialog open:', open);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddProjectMemberData>({
    resolver: zodResolver(addProjectMemberSchema),
    defaultValues: {
      userId: '',
      role: 'MEMBER',
    },
  });

  const handleFormSubmit = (data: AddProjectMemberData) => {
    console.log('[AddMemberDialog] Form submitted:', data);
    onSubmit(data);
  };

  const handleClose = () => {
    console.log('[AddMemberDialog] Closing dialog');
    reset();
    onClose();
  };

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
        <PersonAdd color="primary" />
        <Typography variant="h6" component="span">
          Add Project Member
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
          {/* User Search Autocomplete */}
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <UserAutocomplete
                value={field.value}
                onChange={(userId) => {
                  console.log('[AddMemberDialog] User selected:', userId);
                  setValue('userId', userId, { shouldValidate: true });
                }}
                label="User"
                required
                disabled={isSubmitting}
                error={!!errors.userId}
                helperText={errors.userId?.message || 'Search by name or email'}
                placeholder="Search users..."
                filterUsers={(user) => !existingMemberIds.includes(user.id)}
              />
            )}
          />

          {/* Role Selection */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset" error={!!errors.role}>
                <FormLabel component="legend">
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Role *
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
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;