import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Divider,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Visibility, VisibilityOff, Edit, Lock } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Alert, Button } from '@/components/common';
import { Avatar } from '@/components/profile/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout';
import { updateProfile, changePassword } from '@/interceptors/endpoints/user.api';
import {
    updateProfileSchema,
    changePasswordSchema,
    type UpdateProfileFormData,
    type ChangePasswordFormData,
} from '@/schemas/user.schemas';

/**
 * User Profile Page
 * Allows users to view and edit their profile, change password
 * Mobile responsive with MUI Grid2
 */
const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // Password change dialog state
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Profile update form
    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            avatarUrl: user?.avatarUrl || '',
        },
    });

    // Change password form
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onUpdateProfile = async (data: UpdateProfileFormData) => {
        setUpdateError(null);
        setIsUpdating(true);

        try {
            const updatedUser = await updateProfile({
                name: data.name,
                email: data.email,
                avatarUrl: data.avatarUrl || undefined,
            });

            updateUser(updatedUser);
            setEditMode(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const onChangePassword = async (data: ChangePasswordFormData) => {
        setPasswordError(null);
        setIsChangingPassword(true);

        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            toast.success('Password changed successfully!');
            setPasswordDialogOpen(false);
            resetPassword();
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleCancelEdit = () => {
        resetProfile({
            name: user?.name || '',
            email: user?.email || '',
            avatarUrl: user?.avatarUrl || '',
        });
        setEditMode(false);
        setUpdateError(null);
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        resetPassword();
        setPasswordError(null);
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    My Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Manage your account settings and preferences
                </Typography>

                {/* Profile Information */}
                <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
                    {/* Avatar and Basic Info */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            mb: 4,
                            gap: 2,
                        }}
                    >
                        <Avatar name={user.name} src={user.avatarUrl} size="xlarge" />
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: { xs: 'center', sm: 'left' },
                            }}
                        >
                            <Typography variant="h5">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                        {!editMode && (
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() => setEditMode(true)}
                                fullWidth={{ xs: true, sm: false }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Error Alert */}
                    {updateError && (
                        <Alert severity="error" closable onClose={() => setUpdateError(null)}>
                            {updateError}
                        </Alert>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
                        <Grid container spacing={3}>
                            {/* Name */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="name"
                                    control={profileControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Full Name"
                                            fullWidth
                                            disabled={!editMode || isUpdating}
                                            error={!!profileErrors.name}
                                            helperText={profileErrors.name?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Email */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="email"
                                    control={profileControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email Address"
                                            type="email"
                                            fullWidth
                                            disabled={!editMode || isUpdating}
                                            error={!!profileErrors.email}
                                            helperText={profileErrors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Avatar URL */}
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name="avatarUrl"
                                    control={profileControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Avatar URL (optional)"
                                            fullWidth
                                            disabled={!editMode || isUpdating}
                                            error={!!profileErrors.avatarUrl}
                                            helperText={
                                                profileErrors.avatarUrl?.message ||
                                                'Leave empty to use initials-based avatar'
                                            }
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Action Buttons */}
                            {editMode && (
                                <Grid size={{ xs: 12 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 2,
                                        }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isUpdating}
                                            loading={isUpdating}
                                            fullWidth={{ xs: true, sm: false }}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancelEdit}
                                            disabled={isUpdating}
                                            fullWidth={{ xs: true, sm: false }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Paper>

                {/* Security Section */}
                <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Security
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Manage your password and security settings
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Change your password regularly to keep your account secure.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Lock />}
                            onClick={() => setPasswordDialogOpen(true)}
                            fullWidth={{ xs: true, sm: false }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Paper>

                {/* Account Details */}
                <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Account Details
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary">
                                Account Status
                            </Typography>
                            <Typography variant="body1">
                                {user.enabled ? '✅ Active' : '❌ Disabled'}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary">
                                Email Verified
                            </Typography>
                            <Typography variant="body1">
                                {user.metadata?.emailVerified ? '✅ Verified' : '❌ Not Verified'}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary">
                                Last Login
                            </Typography>
                            <Typography variant="body1">
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleString()
                                    : 'Never'}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary">
                                Account Created
                            </Typography>
                            <Typography variant="body1">
                                {new Date(user.createdAt).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Change Password Dialog */}
                <Dialog
                    open={passwordDialogOpen}
                    onClose={handleClosePasswordDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            m: { xs: 2, sm: 3 },
                            width: { xs: 'calc(100% - 32px)', sm: '100%' },
                        },
                    }}
                >
                    <DialogTitle>Change Password</DialogTitle>
                    <form onSubmit={handlePasswordSubmit(onChangePassword)}>
                        <DialogContent>
                            {passwordError && (
                                <Alert severity="error" closable onClose={() => setPasswordError(null)}>
                                    {passwordError}
                                </Alert>
                            )}

                            {/* Old Password */}
                            <Controller
                                name="oldPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Current Password"
                                        type={showOldPassword ? 'text' : 'password'}
                                        fullWidth
                                        margin="normal"
                                        autoFocus
                                        error={!!passwordErrors.oldPassword}
                                        helperText={passwordErrors.oldPassword?.message}
                                        disabled={isChangingPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        edge="end"
                                                        disabled={isChangingPassword}
                                                    >
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* New Password */}
                            <Controller
                                name="newPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="New Password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        fullWidth
                                        margin="normal"
                                        error={!!passwordErrors.newPassword}
                                        helperText={passwordErrors.newPassword?.message}
                                        disabled={isChangingPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                        disabled={isChangingPassword}
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Confirm Password */}
                            <Controller
                                name="confirmPassword"
                                control={passwordControl}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Confirm New Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        fullWidth
                                        margin="normal"
                                        error={!!passwordErrors.confirmPassword}
                                        helperText={passwordErrors.confirmPassword?.message}
                                        disabled={isChangingPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                        disabled={isChangingPassword}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </DialogContent>

                        <DialogActions
                            sx={{
                                px: 3,
                                pb: 3,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 0 },
                            }}
                        >
                            <Button
                                onClick={handleClosePasswordDialog}
                                variant="outlined"
                                disabled={isChangingPassword}
                                fullWidth={{ xs: true, sm: false }}
                                sx={{ order: { xs: 2, sm: 1 } }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isChangingPassword}
                                loading={isChangingPassword}
                                fullWidth={{ xs: true, sm: false }}
                                sx={{ order: { xs: 1, sm: 2 } }}
                            >
                                Change Password
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </>
    );
};

export default ProfilePage;