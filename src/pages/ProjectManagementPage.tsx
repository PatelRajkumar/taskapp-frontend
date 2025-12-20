import { Container, Typography, Box, Paper } from '@mui/material';
import { usePermissions } from '@/hooks/usePermissions';
import { Folder } from '@mui/icons-material';
import { Button } from '@/components/common';

/**
 * Project Management Page (Protected - PROJECT_READ permission required)
 * Demonstrates permission-based route protection
 */
const ProjectManagementPage = () => {
  const { hasPermission, userPermissions } = usePermissions();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Folder color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h3" component="h1">
          Project Management
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        This page requires PROJECT_READ permission to access.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Access Granted ✅
        </Typography>
        <Typography variant="body2" paragraph>
          You have the PROJECT_READ permission!
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Project-Related Permissions:</strong>
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userPermissions
              .filter((p) => p.startsWith('PROJECT_'))
              .map((permission) => (
                <Box
                  key={permission}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {permission}
                </Box>
              ))}
            {userPermissions.filter((p) => p.startsWith('PROJECT_')).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No project-related permissions besides PROJECT_READ
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Project Management Actions
        </Typography>
        <Typography variant="body2" paragraph>
          Actions are enabled/disabled based on your permissions:
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button
            variant="primary"
            disabled={!hasPermission('PROJECT_CREATE')}
            title={
              !hasPermission('PROJECT_CREATE')
                ? 'Missing PROJECT_CREATE permission'
                : 'Create a new project'
            }
          >
            {hasPermission('PROJECT_CREATE') ? '✓' : '🔒'} Create Project
          </Button>

          <Button
            variant="primary"
            disabled={!hasPermission('PROJECT_UPDATE')}
            title={
              !hasPermission('PROJECT_UPDATE')
                ? 'Missing PROJECT_UPDATE permission'
                : 'Update project details'
            }
          >
            {hasPermission('PROJECT_UPDATE') ? '✓' : '🔒'} Update Project
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('PROJECT_DELETE')}
            title={
              !hasPermission('PROJECT_DELETE')
                ? 'Missing PROJECT_DELETE permission'
                : 'Delete a project'
            }
          >
            {hasPermission('PROJECT_DELETE') ? '✓' : '🔒'} Delete Project
          </Button>

          <Button
            variant="outlined"
            disabled={!hasPermission('PROJECT_MANAGE')}
            title={
              !hasPermission('PROJECT_MANAGE')
                ? 'Missing PROJECT_MANAGE permission'
                : 'Manage project settings'
            }
          >
            {hasPermission('PROJECT_MANAGE') ? '✓' : '🔒'} Manage Settings
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.light' }}>
        <Typography variant="h6" gutterBottom>
          ✅ Dynamic Permission System!
        </Typography>
        <Typography variant="body2" paragraph>
          All permissions are loaded from the backend dynamically.
        </Typography>
        <Typography variant="body2">
          If an admin adds/removes permissions from your role, they will reflect here after you
          refresh user data (or re-login).
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProjectManagementPage;