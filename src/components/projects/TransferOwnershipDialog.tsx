/**
 * TransferOwnershipDialog Component
 * Dialog for transferring project ownership to another member
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import { Close, SwapHoriz, Warning } from '@mui/icons-material';
import { Button } from '@/components/common';
import { MemberAutocomplete } from './MemberAutocomplete';
import {
  transferOwnershipSchema,
  type TransferOwnershipData,
} from '@/schemas/projectMember.schema';
import type { ProjectMemberSummary } from '@/interceptors/types/projectMember.types';

export interface TransferOwnershipDialogProps {
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
  onSubmit: (data: TransferOwnershipData) => void;
  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean;
  /**
   * Error message to display
   */
  error?: string | null;
  /**
   * Project name for confirmation
   */
  projectName?: string;
  /**
   * List of project members to choose from
   */
  members: ProjectMemberSummary[];
}

/**
 * TransferOwnershipDialog - Modal for transferring project ownership
 * 
 * Features:
 * - Select from existing project members
 * - Excludes VIEWER role members
 * - Warning about consequences
 * - Zod validation
 * - Loading states
 * - Error display
 * 
 * @example
 * <TransferOwnershipDialog
 *   open={dialogOpen}
 *   onClose={handleClose}
 *   onSubmit={handleTransfer}
 *   isSubmitting={isPending}
 *   error={error?.message}
 *   projectName="My Project"
 *   members={projectMembers}
 * />
 */
export const TransferOwnershipDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
  projectName,
  members,
}: TransferOwnershipDialogProps) => {
  console.log('[TransferOwnershipDialog] Dialog open:', open);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransferOwnershipData>({
    resolver: zodResolver(transferOwnershipSchema),
    defaultValues: {
      newOwnerUserId: '',
    },
  });

  const handleFormSubmit = (data: TransferOwnershipData) => {
    console.log('[TransferOwnershipDialog] Form submitted:', data);
    onSubmit(data);
  };

  const handleClose = () => {
    console.log('[TransferOwnershipDialog] Closing dialog');
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
        <SwapHoriz color="warning" />
        <Typography variant="h6" component="span">
          Transfer Ownership
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
          {/* Warning Alert */}
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Important: This action cannot be undone
            </Typography>
            <Typography variant="body2">
              After transferring ownership:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>
                <Typography variant="body2">
                  The new owner will have full control of the project
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  You will become an Admin (not Owner)
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Only the new owner can transfer ownership again
                </Typography>
              </li>
            </Box>
          </Alert>

          {/* Project Name */}
          {projectName && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Project
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {projectName}
              </Typography>
            </Box>
          )}

          {/* New Owner Member Autocomplete */}
          <Controller
            name="newOwnerUserId"
            control={control}
            render={({ field }) => (
              <MemberAutocomplete
                members={members}
                value={field.value}
                onChange={(userId) => {
                  console.log('[TransferOwnershipDialog] New owner selected:', userId);
                  setValue('newOwnerUserId', userId, { shouldValidate: true });
                }}
                label="New Owner"
                required
                disabled={isSubmitting}
                error={!!errors.newOwnerUserId}
                helperText={
                  errors.newOwnerUserId?.message ||
                  'Select a member who will become the new owner'
                }
                placeholder="Select new owner..."
                filterMembers={(member) => member.role !== 'VIEWER' && member.role !== 'OWNER'}
              />
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
          sx={{
            bgcolor: 'warning.main',
            '&:hover': {
              bgcolor: 'warning.dark',
            },
          }}
        >
          Transfer Ownership
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferOwnershipDialog;