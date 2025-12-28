/**
 * ProjectDetailPage Component
 * Detailed view of a single project with tabs
 */

import { Button, ErrorState, LoadingState } from '@/components/common';
import {
  IssueDetailDialog,
  IssueForm,
  IssueList
} from '@/components/issues';
import { AddMemberDialog, EditMemberRoleDialog, MemberList, ProjectForm, TransferOwnershipDialog } from '@/components/projects';
import {
  useCreateIssue,
  useDeleteIssue,
  useUpdateIssue,
  useUpdateIssueStatus,
} from '@/hooks/useIssueMutations';
import { issueKeys, useIssueByKey, useProjectIssues } from '@/hooks/useIssues';
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
import { updateIssueStatus } from '@/interceptors';
import type { IssueResponse, IssueSummary } from '@/interceptors/types/issue.types';
import type { ProjectVisibility, UpdateProjectRequest } from '@/interceptors/types/project.types';
import type { ProjectMemberAddRequest, ProjectMemberSummary, ProjectMemberUpdateRoleRequest, ProjectRole, TransferOwnershipRequest } from '@/interceptors/types/projectMember.types';
import type { CreateIssueData, UpdateIssueData } from '@/schemas/issue.schema';
import type { UpdateProjectData } from '@/schemas/project.schema';
import type { AddProjectMemberData, TransferOwnershipData, UpdateProjectMemberRoleData } from '@/schemas/projectMember.schema';
import type { IssueStatus } from '@/utils/constants';
import {
  Add,
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
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import {
  canEditIssueSummary,
  canEditIssueResponse,
  canDeleteIssue,
  canChangeStatusSummary,
  canChangeStatusResponse,
} from '@/utils/issuePermissions';

import { useAuth } from '@/hooks/useAuth';

type TabValue = 'overview' | 'members' | 'issues' | 'settings';

/**
 * ProjectDetailPage - Detailed project view with tabs
 * 
 * Features:
 * - Project header with actions
 * - Tabs: Overview, Members, Issues, Settings
 * - Permission-based UI
 * - Breadcrumbs navigation
 * - Full CRUD operations for issues in Issues tab
 * 
 * URL: /projects/:projectId
 */
const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Get current user for permissions
  const { user } = useAuth();

  // Tab state
  const [currentTab, setCurrentTab] = useState<TabValue>('overview');

  // Dialog states - EXISTING (keep as is)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [transferOwnershipDialogOpen, setTransferOwnershipDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMemberSummary | null>(null);

  // NEW Issues tab states
  const [createIssueDialogOpen, setCreateIssueDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<IssueResponse | null>(null);
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);
  const [issuePage, setIssuePage] = useState(0);
  const issuePageSize = 12;

  // Menu state - EXISTING (keep as is)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  console.log('[ProjectDetailPage] Project ID:', projectId);

  // EXISTING Queries (keep as is)
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId || '', !!projectId);
  const { data: members = [], isLoading: membersLoading, error: membersError } = useProjectMembers(projectId || '', !!projectId);

  // NEW Issues queries - CORRECTED: useProjectIssues takes IssueSearchParams which needs searchTerm
  const { data: issuesData, isLoading: issuesLoading, error: issuesError } = useProjectIssues(
    projectId || '',
    {
      searchTerm: '', // REQUIRED by IssueSearchParams
      page: issuePage,
      size: issuePageSize,
      sort: 'updatedAt,desc'
    },
    !!projectId && currentTab === 'issues'
  );
  const issues = issuesData?.content || [];
  const issuesTotalPages = issuesData?.totalPages || 0;

  // Load selected issue details
  const { data: selectedIssue, isLoading: isLoadingIssue } = useIssueByKey(
    selectedIssueKey || '',
    !!selectedIssueKey
  );

  // EXISTING Mutations (keep as is)
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(projectId || '', {
    onSuccess: () => {
      setEditDialogOpen(false);
    },
  });

  const { mutate: deleteProject } = useDeleteProject({
    onSuccess: () => {
      navigate('/projects');
    },
  });

  const { mutate: archiveProject } = useArchiveProject();
  const { mutate: restoreProject } = useRestoreProject();

  const { mutate: addMember, isPending: isAddingMember } = useAddMember(projectId || '', {
    onSuccess: () => {
      setAddMemberDialogOpen(false);
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
    },
  });

  // NEW Issue mutations
  const { mutate: createIssueMutation, isPending: isCreatingIssue } = useCreateIssue(projectId || '', {
    onSuccess: () => {
      setCreateIssueDialogOpen(false);
      // toast.success('Issue created successfully!');
    },
  });

  const { mutate: updateIssueMutation, isPending: isUpdatingIssue } = useUpdateIssue(
    projectId || '',
    editingIssue?.id || '',
    {
      onSuccess: () => {
        setEditingIssue(null);
        // toast.success('Issue updated successfully!');
      },
    }
  );

  const { mutate: deleteIssueMutation } = useDeleteIssue(projectId || '', {
    onSuccess: () => {
      setSelectedIssueKey(null);
      // toast.success('Issue deleted successfully!');
    },
  });

  const { mutate: updateIssueStatusMutation } = useUpdateIssueStatus(
    projectId || '',
    selectedIssue?.id || '',
    {
      onSuccess: () => {
        // toast.success('Status updated successfully!');
      },
    }
  );

  // EXISTING Handlers (keep as is)
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

    if (confirm(`Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone.`)) {
      console.log('[ProjectDetailPage] Deleting project');
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

  const handleUpdateMemberRole = (data: UpdateProjectMemberRoleData) => {
    if (!editingMember) return;
    const requestData: ProjectMemberUpdateRoleRequest = {
      role: data.role as ProjectRole,
    };
    updateMemberRole(requestData);
  };

  const handleEditRole = (member: ProjectMemberSummary) => {
    console.log('[ProjectDetailPage] Edit member role:', member.user.name);
    setEditingMember(member);
  };

  const handleRemoveMember = (member: ProjectMemberSummary) => {
    if (confirm(`Are you sure you want to remove ${member.user.name} from this project?`)) {
      console.log('[ProjectDetailPage] Removing member:', member.user.name);
      removeMember(member.user.id);
    }
  };

  const handleTransferOwnership = () => {
    handleMenuClose();
    setTransferOwnershipDialogOpen(true);
  };

  const handleTransferOwnershipSubmit = (data: TransferOwnershipData) => {
    const requestData: TransferOwnershipRequest = {
      newOwnerUserId: data.newOwnerUserId,
    };
    transferOwnership(requestData);
  };

  // NEW Issue handlers - CORRECTED: Use IssueSummary type, not IssueResponse
  const handleCreateIssue = (data: CreateIssueData) => {
    console.log('[ProjectDetailPage] Creating issue:', data);
    createIssueMutation(data);
  };

  const handleUpdateIssue = (data: UpdateIssueData) => {
    console.log('[ProjectDetailPage] Updating issue:', data);
    updateIssueMutation(data);
  };

  const handleIssueCardClick = (issue: IssueSummary) => {
    console.log('[ProjectDetailPage] Issue clicked:', issue.key);
    setSelectedIssueKey(issue.key);
  };

  const handleCloseIssueDetail = () => {
    setSelectedIssueKey(null);
  };

  // CORRECTED: Accept IssueResponse from detail dialog, convert handlers
  const handleEditIssueFromDetail = (issue: IssueResponse) => {
    console.log('[ProjectDetailPage] Edit issue from detail:', issue.key);
    setEditingIssue(issue);
    setSelectedIssueKey(null);
  };

  const handleDeleteIssueFromDetail = (issue: IssueResponse) => {
    if (confirm(`Are you sure you want to delete issue "${issue.key}"?\n\nThis action cannot be undone.`)) {
      console.log('[ProjectDetailPage] Deleting issue from detail:', issue.key);
      deleteIssueMutation(issue.id);
    }
  };

  const handleIssueStatusChangeFromDetail = (issue: IssueResponse, newStatus: IssueStatus) => {
    console.log('[ProjectDetailPage] Status change from detail:', issue.key, newStatus);
    updateIssueStatusMutation({ newStatus });
  };

  // CORRECTED: Accept IssueSummary from issue card
  const handleEditIssueFromCard = (issue: IssueSummary) => {
    console.log('[ProjectDetailPage] Edit issue from card:', issue.key);
    // Need to fetch full issue to edit - use the key to open detail first
    setSelectedIssueKey(issue.key);
  };

  const handleDeleteIssueFromCard = (issue: IssueSummary) => {
    if (confirm(`Are you sure you want to delete issue "${issue.key}"?\n\nThis action cannot be undone.`)) {
      console.log('[ProjectDetailPage] Deleting issue from card:', issue.key);
      deleteIssueMutation(issue.id);
    }
  };

  const handleIssueStatusChangeFromCard = (issue: IssueSummary, newStatus: IssueStatus) => {
    console.log('[ProjectDetailPage] Status change from card:', issue.key, newStatus);

    // Call API directly with proper error handling
    updateIssueStatus(projectId ?? "", issue.id, { newStatus })
      .then(() => {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ['issues', 'project', projectId]
        });
        toast.success(`Status updated to ${newStatus}`);
      })
      .catch((error) => {
        console.error('[ProjectDetailPage] Failed to update status:', error);
        toast.error(error.message || 'Failed to update status');
      });
  };

  const handleIssuePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    console.log('[ProjectDetailPage] Issue page changed to:', newPage);
    setIssuePage(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (projectLoading) {
    return <LoadingState />;
  }

  // Error state
  if (projectError || !project) {
    return (
      <ErrorState
        icon={<Folder />}
        title="Project not found"
        description={projectError?.message || 'The project you are looking for does not exist.'}
      />
    );
  }

  // Permission checks
  const currentUserRole = project.currentUserRole as ProjectRole | undefined; // CORRECTED: Cast to ProjectRole
  const isOwner = currentUserRole === 'OWNER';
  const isAdmin = currentUserRole === 'ADMIN';
  const canEdit = isOwner || isAdmin;
  const canManageMembers = isOwner || isAdmin;
  const canDelete = isOwner;
  const canArchive = isOwner;


  // Permission calculator functions for issues
  const canUserEditIssueSummary = (issue: IssueSummary) =>
    canEditIssueSummary(issue, currentUserRole, user?.id ?? '');

  const canUserEditIssueResponse = (issue: IssueResponse) =>
    canEditIssueResponse(issue, currentUserRole, user?.id ?? '');

  const canUserDeleteIssue = () =>
    canDeleteIssue(currentUserRole);

  const canUserChangeStatusSummary = (issue: IssueSummary) =>
    canChangeStatusSummary(issue, currentUserRole, user?.id ?? '');

  const canUserChangeStatusResponse = (issue: IssueResponse) =>
    canChangeStatusResponse(issue, currentUserRole, user?.id ?? '');

  // Empty state messages for issues
  const getIssuesEmptyMessage = () => {
    return 'No issues yet';
  };

  const getIssuesEmptyDescription = () => {
    return 'Create your first issue to get started';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs - EXISTING (keep as is) */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/projects" underline="hover" color="inherit">
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      {/* Project Header - EXISTING (keep as is) */}
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

          {/* Actions Menu - EXISTING (keep as is) */}
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
                {isOwner && (
                  <MenuItem onClick={handleTransferOwnership}>
                    <ListItemIcon>
                      <SwapHoriz fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Transfer Ownership</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tabs - UPDATED: Added Issues tab */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Overview" value="overview" />
          <Tab label="Members" value="members" />
          <Tab label="Issues" value="issues" />
          {canEdit && <Tab label="Settings" value="settings" />}
        </Tabs>
      </Box>

      {/* Tab Content - Overview - EXISTING (keep as is) */}
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

      {/* Tab Content - Members - EXISTING (keep as is) */}
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

      {/* Tab Content - Issues - NEW */}
      {currentTab === 'issues' && (
        <Box>
          {/* Create Issue Button */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              startIcon={<Add />}
              onClick={() => setCreateIssueDialogOpen(true)}
            >
              Create Issue
            </Button>
          </Box>

          {/* Issue List - CORRECTED: Use IssueSummary handlers */}
          <IssueList
            issues={issues}
            isLoading={issuesLoading}
            error={issuesError?.message}
            emptyMessage={getIssuesEmptyMessage()}
            emptyDescription={getIssuesEmptyDescription()}
            onClick={handleIssueCardClick}
            onEdit={handleEditIssueFromCard}
            onDelete={handleDeleteIssueFromCard}
            onStatusChange={handleIssueStatusChangeFromCard}
            showActions={true}
            showStatusDropdown={true}
            canEditIssue={canUserEditIssueSummary}        // NEW
            canDeleteIssue={canUserDeleteIssue}          // NEW (returns function that ignores issue param)
            canChangeStatus={canUserChangeStatusSummary} // NEW
          />

          {/* Pagination */}
          {issuesTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={issuesTotalPages}
                page={issuePage + 1}
                onChange={handleIssuePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      )}

      {/* Tab Content - Settings - EXISTING (keep as is) */}
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

      {/* Dialogs - EXISTING (keep as is) */}
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

      <AddMemberDialog
        open={addMemberDialogOpen}
        onClose={() => setAddMemberDialogOpen(false)}
        onSubmit={handleAddMember}
        isSubmitting={isAddingMember}
        existingMemberIds={members.map((m) => m.user.id)}
      />

      <TransferOwnershipDialog
        open={transferOwnershipDialogOpen}
        onClose={() => setTransferOwnershipDialogOpen(false)}
        onSubmit={handleTransferOwnershipSubmit}
        isSubmitting={isTransferring}
        projectName={project.name}
        members={members}
      />

      <EditMemberRoleDialog
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={handleUpdateMemberRole}
        isSubmitting={isUpdatingRole}
        member={editingMember}
      />

      {/* NEW Issue Dialogs */}
      <Dialog
        open={createIssueDialogOpen}
        onClose={() => setCreateIssueDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Create New Issue</Typography>
          <IconButton onClick={() => setCreateIssueDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <IssueForm
              mode="create"
              projectMembers={members}
              onSubmit={handleCreateIssue}
              onCancel={() => setCreateIssueDialogOpen(false)}
              isSubmitting={isCreatingIssue}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingIssue}
        onClose={() => setEditingIssue(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit Issue</Typography>
          <IconButton onClick={() => setEditingIssue(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingIssue && (
            <Box sx={{ pt: 2 }}>
              <IssueForm
                mode="edit"
                issue={editingIssue}
                projectMembers={members}
                onSubmit={handleUpdateIssue}
                onCancel={() => setEditingIssue(null)}
                isSubmitting={isUpdatingIssue}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Detail Dialog - CORRECTED: Use IssueResponse handlers */}
      <IssueDetailDialog
        open={!!selectedIssueKey}
        onClose={handleCloseIssueDetail}
        issue={selectedIssue || null}
        onEdit={handleEditIssueFromDetail}
        onDelete={handleDeleteIssueFromDetail}
        onStatusChange={handleIssueStatusChangeFromDetail}
        isLoading={isLoadingIssue}
        canEdit={selectedIssue ? canUserEditIssueResponse(selectedIssue) : false}           // NEW
        canDelete={selectedIssue ? canUserDeleteIssue() : false}                            // NEW
        canChangeStatus={selectedIssue ? canUserChangeStatusResponse(selectedIssue) : false} // NEW

      />
    </Container>
  );
};

export default ProjectDetailPage;