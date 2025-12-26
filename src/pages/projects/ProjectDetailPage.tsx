/**
 * ProjectDetailPage Component
 * Detailed view of a single project with tabs
 */

import { Button, ErrorState, LoadingState } from '@/components/common';
import { AddMemberDialog, MemberList, ProjectForm, TransferOwnershipDialog } from '@/components/projects';
import {
  useAddMember,
  useArchiveProject,
  useDeleteProject,
  useRemoveMember,
  useRestoreProject,
  useTransferOwnership,
  useUpdateMemberRole,
  useUpdateProject
} from '@/hooks/useProjectMutations';
import { useProject, useProjectMembers } from '@/hooks/useProjects';
import type { ProjectVisibility, UpdateProjectRequest } from '@/interceptors/types/project.types';
import type { ProjectMemberAddRequest, ProjectMemberSummary, ProjectMemberUpdateRoleRequest, ProjectRole, TransferOwnershipRequest } from '@/interceptors/types/projectMember.types';
import type { UpdateProjectData } from '@/schemas/project.schema';
import type { AddProjectMemberData, TransferOwnershipData, UpdateProjectMemberRoleData } from '@/schemas/projectMember.schema';
import {
  Archive,
  Close,
  Delete,
  Edit,
  Folder,
  Lock,
  MoreVert,
  NavigateNext,
  People,
  PersonAdd,
  Public,
  SwapHoriz,
  Unarchive,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { EditMemberRoleDialog } from '@/components/projects';

type TabValue = 'overview' | 'members' | 'settings';

/**
 * ProjectDetailPage - Detailed project view with tabs
 * 
 * Features:
 * - Project header with actions
 * - Tabs: Overview, Members, Settings
 * - Permission-based UI
 * - Breadcrumbs navigation
 * 
 * URL: /projects/:projectId
 */
const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();


  // Tab state
  const [currentTab, setCurrentTab] = useState<TabValue>('overview');

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [transferOwnershipDialogOpen, setTransferOwnershipDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMemberSummary | null>(null);


  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  console.log('[ProjectDetailPage] Project ID:', projectId);

  // Queries
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId || '', !!projectId);
  const { data: members = [], isLoading: membersLoading, error: membersError } = useProjectMembers(projectId || '', !!projectId);

  // Mutations
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(projectId || '', {
    onSuccess: () => {
      setEditDialogOpen(false);
      // toast.success('Project updated successfully!');
    },
  });

  const { mutate: deleteProject } = useDeleteProject({
    onSuccess: () => {
      // toast.success('Project deleted successfully');
      navigate('/projects');
    },
  });

  const { mutate: archiveProject } = useArchiveProject();

  const { mutate: restoreProject } = useRestoreProject();

  const { mutate: addMember, isPending: isAddingMember } = useAddMember(projectId || '', {
    onSuccess: () => {
      setAddMemberDialogOpen(false);
      // toast.success('Member added successfully!');
    },
  });


  const { mutate: updateMemberRole, isPending: isUpdatingRole } = useUpdateMemberRole(
    projectId || '',
    editingMember?.user.id || '',
    {
      onSuccess: () => {
        setEditingMember(null);
      },
    }
  );

  const { mutate: removeMember } = useRemoveMember(projectId || '');

  const { mutate: transferOwnership, isPending: isTransferring } = useTransferOwnership(projectId || '', {
    onSuccess: () => {
      setTransferOwnershipDialogOpen(false);
      // toast.success('Ownership transferred successfully!');
    },
  });

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleUpdateProject = (data: UpdateProjectData) => {
    if (!project) return;
    const requestData: UpdateProjectRequest = {
      name: data.name,
      description: data.description,
      visibility: data.visibility as ProjectVisibility | undefined,
    };
    updateProject(requestData);
  };

  const handleArchiveToggle = () => {
    handleMenuClose();
    if (!project) return;

    if (project.isArchived) {
      restoreProject(project.id);
    } else {
      archiveProject(project.id);
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    if (!project) return;

    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      deleteProject(project.id);
    }
  };

  const handleAddMember = (data: AddProjectMemberData) => {
    const requestData: ProjectMemberAddRequest = {
      userId: data.userId,
      role: data.role as ProjectRole,
    };
    addMember(requestData);
  };

  const handleRemoveMember = (member: ProjectMemberSummary) => {
    if (confirm(`Remove ${member.user.name} from this project?`)) {
      removeMember(member.user.id);
    }
  };

  // Add handler:
  const handleEditRole = (member: ProjectMemberSummary) => {
    console.log('[ProjectDetailPage] Edit role for:', member.user.name);
    setEditingMember(member);
  };

  const handleUpdateMemberRole = (data: UpdateProjectMemberRoleData) => {
    if (!editingMember) return;
    const requestData: ProjectMemberUpdateRoleRequest = {
      role: data.role as ProjectRole,
    };
    updateMemberRole(requestData);
  };

  const handleTransferOwnership = () => {
    setTransferOwnershipDialogOpen(true);
    handleMenuClose();
  }

  const handleTransferOwnershipSubmit = (data: TransferOwnershipData) => {
    const requestData: TransferOwnershipRequest = {
      newOwnerUserId: data.newOwnerUserId,
    };
    transferOwnership(requestData);
  };

  // Loading state
  if (projectLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingState count={1} height={400} />
      </Container>
    );
  }

  // Error state
  if (projectError || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState
          icon={<Folder />}
          title="Failed to load project"
          description={projectError?.message || 'Project not found'}
        />
      </Container>
    );
  }

  // Permission checks
  const currentUserRole = project.currentUserRole as ProjectRole | undefined;
  const isOwner = currentUserRole === 'OWNER';
  const isAdmin = currentUserRole === 'ADMIN';
  const canEdit = isOwner || isAdmin;
  const canManageMembers = isOwner || isAdmin;
  const canDelete = isOwner;
  const canArchive = isOwner;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/projects" underline="hover" color="inherit">
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" component="h1">
                {project.name}
              </Typography>
              <Chip
                icon={project.visibility === 'PUBLIC' ? <Public /> : <Lock />}
                label={project.visibility}
                size="small"
                color={project.visibility === 'PUBLIC' ? 'primary' : 'default'}
              />
              {project.isArchived && (
                <Chip label="ARCHIVED" size="small" color="warning" />
              )}
              {currentUserRole && (
                <Chip label={currentUserRole} size="small" color="secondary" variant="outlined" />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Key: {project.key}
            </Typography>

            {project.description && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {project.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <People fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {project.memberCount} members
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Folder fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {project.issueCount} issues
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Actions Menu */}
          {canEdit && (
            <Box>
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                {canEdit && (
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Project</ListItemText>
                  </MenuItem>
                )}
                {canArchive && (
                  <MenuItem onClick={handleArchiveToggle}>
                    <ListItemIcon>
                      {project.isArchived ? <Unarchive fontSize="small" /> : <Archive fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>{project.isArchived ? 'Restore' : 'Archive'}</ListItemText>
                  </MenuItem>
                )}
                {canDelete && (
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete Project</ListItemText>
                  </MenuItem>
                )}
                {
                  isOwner && (<MenuItem onClick={handleTransferOwnership}>
                    <ListItemIcon>
                      <SwapHoriz fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Transfer Ownership</ListItemText>
                  </MenuItem>)
                }
              </Menu>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Overview" value="overview" />
          <Tab label="Members" value="members" />
          {canEdit && <Tab label="Settings" value="settings" />}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 'overview' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Project Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
                {project.updatedAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body2">
                    {project.createdBy.name} ({project.createdBy.email})
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Members
                  </Typography>
                  <Typography variant="h4">{project.memberCount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Issues
                  </Typography>
                  <Typography variant="h4">{project.issueCount}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {currentTab === 'members' && (
        <Box>
          {canManageMembers && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" startIcon={<PersonAdd />} onClick={() => setAddMemberDialogOpen(true)}>
                Add Member
              </Button>
            </Box>
          )}

          <MemberList
            members={members}
            currentUserRole={currentUserRole}
            isLoading={membersLoading}
            error={membersError?.message}
            emptyMessage="No members yet"
            emptyDescription="Add members to collaborate on this project"
            onEditRole={canManageMembers ? handleEditRole : undefined}
            onRemove={canManageMembers ? handleRemoveMember : undefined}
            showActions={canManageMembers}
          />
        </Box>
      )}

      {currentTab === 'settings' && canEdit && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Project Settings
          </Typography>
          <Divider sx={{ my: 2 }} />
          <ProjectForm
            mode="edit"
            project={project}
            onSubmit={handleUpdateProject}
            isSubmitting={isUpdating}
          />

          {canDelete && (
            <>
              <Divider sx={{ my: 4 }} />
              <Box>
                <Typography variant="h6" gutterBottom color="error">
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  These actions cannot be undone. Please be certain.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {canArchive && (
                    <Button variant="outlined" onClick={handleArchiveToggle}>
                      {project.isArchived ? 'Restore Project' : 'Archive Project'}
                    </Button>
                  )}
                  <Button variant="outlined" onClick={handleDelete} sx={{ color: 'error.main', borderColor: 'error.main' }}>
                    Delete Project
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit Project</Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectForm
            mode="edit"
            project={project}
            onSubmit={handleUpdateProject}
            onCancel={() => setEditDialogOpen(false)}
            isSubmitting={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
        onSubmit={handleAddMember}
        isSubmitting={isAddingMember}
        existingMemberIds={members.map((m) => m.user.id)}
      />

      {/* Transfer Ownership Dialog */}
      <TransferOwnershipDialog
        open={transferOwnershipDialogOpen}
        onClose={() => setTransferOwnershipDialogOpen(false)}
        onSubmit={handleTransferOwnershipSubmit}
        isSubmitting={isTransferring}
        projectName={project.name}
        members={members}
      />
      {/* Edit Member Role Dialog */}
      <EditMemberRoleDialog
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={handleUpdateMemberRole}
        isSubmitting={isUpdatingRole}
        member={editingMember}
      />
    </Container>
  );
};

export default ProjectDetailPage;