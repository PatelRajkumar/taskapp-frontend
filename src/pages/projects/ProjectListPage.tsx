/**
 * ProjectListPage Component
 * Main page for viewing and managing projects
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Pagination,
} from '@mui/material';
import { Add, Close, Folder } from '@mui/icons-material';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { ProjectList, ProjectForm } from '@/components/projects';
import { useUserProjects, useArchivedProjects, usePublicProjects, useSearchProjects } from '@/hooks/useProjects';
import {
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useArchiveProject,
  useRestoreProject,
} from '@/hooks/useProjectMutations';
import { useAuth } from '@/hooks/useAuth';
import type { ProjectResponse, CreateProjectRequest, UpdateProjectRequest, ProjectVisibility } from '@/interceptors/types/project.types';
import type { CreateProjectData, UpdateProjectData } from '@/schemas/project.schema';

type TabValue = 'my' | 'archived' | 'public';

/**
 * ProjectListPage - Main projects page with tabs and search
 * 
 * Features:
 * - Tabs: My Projects | Archived | Public
 * - Search with debounce
 * - Create project dialog
 * - Grid of project cards
 * - Pagination
 * - Permission-based actions
 * 
 * URL: /projects
 */
const ProjectListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Tab state
  const [currentTab, setCurrentTab] = useState<TabValue>('my');

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);

  console.log('[ProjectListPage] Rendering with tab:', currentTab, 'page:', page);

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    console.log('[ProjectListPage] Search term changed:', value);
    setDebouncedSearch(value);
    setPage(0); // Reset to first page on search
  }, 300);

  // Queries based on current tab
  const myProjectsQuery = useUserProjects({
    page,
    size: pageSize,
    sort: 'createdAt,desc',
  });

  const archivedProjectsQuery = useArchivedProjects({
    page,
    size: pageSize,
    sort: 'archivedAt,desc',
  });

  const publicProjectsQuery = usePublicProjects({
    page,
    size: pageSize,
    sort: 'createdAt,desc',
  });

  const searchQuery = useSearchProjects(
    debouncedSearch,
    { page, size: pageSize },
    debouncedSearch.length > 0
  );

  // Get current query based on tab and search
  const getCurrentQuery = () => {
    if (debouncedSearch.length > 0) {
      return searchQuery;
    }

    switch (currentTab) {
      case 'my':
        return myProjectsQuery;
      case 'archived':
        return archivedProjectsQuery;
      case 'public':
        return publicProjectsQuery;
      default:
        return myProjectsQuery;
    }
  };

  const currentQuery = getCurrentQuery();
  const projects = currentQuery.data?.content || [];
  const totalPages = currentQuery.data?.totalPages || 0;

  // Mutations
  const { mutate: createProject, isPending: isCreating } = useCreateProject({
    onSuccess: (project) => {
      console.log('[ProjectListPage] Project created:', project.name);
      setCreateDialogOpen(false);
      // toast.success('Project created successfully!');
      navigate(`/projects/${project.id}`);
    },
  });

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(
    editingProject?.id || '',
    {
      onSuccess: (project) => {
        console.log('[ProjectListPage] Project updated:', project.name);
        setEditingProject(null);
        // toast.success('Project updated successfully!');
      },
    }
  );

  const { mutate: deleteProject } = useDeleteProject();

  const { mutate: archiveProject } = useArchiveProject({
    onSuccess: () => {
      toast.success('Project archived successfully');
    },
  });

  const { mutate: restoreProject } = useRestoreProject({
    onSuccess: () => {
      toast.success('Project restored successfully');
    },
  });

  // Handlers - Convert schema types to API types
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabValue) => {
    console.log('[ProjectListPage] Tab changed to:', newValue);
    setCurrentTab(newValue);
    setPage(0);
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const handleCreateProject = (data: CreateProjectData) => {
    console.log('[ProjectListPage] Creating project:', data);
    // Convert schema type to API type
    const requestData: CreateProjectRequest = {
      name: data.name,
      description: data.description,
      visibility: data.visibility as ProjectVisibility,
    };
    createProject(requestData);
  };

  const handleUpdateProject = (data: UpdateProjectData) => {
    if (!editingProject) return;
    console.log('[ProjectListPage] Updating project:', data);
    // Convert schema type to API type
    const requestData: UpdateProjectRequest = {
      name: data.name,
      description: data.description,
      visibility: data.visibility as ProjectVisibility | undefined,
    };
    updateProject(requestData);
  };

  const handleEdit = (project: ProjectResponse) => {
    console.log('[ProjectListPage] Edit project:', project.name);
    setEditingProject(project);
  };

  const handleArchiveToggle = (project: ProjectResponse) => {
    if (project.isArchived) {
      console.log('[ProjectListPage] Restoring project:', project.name);
      restoreProject(project.id);
    } else {
      console.log('[ProjectListPage] Archiving project:', project.name);
      archiveProject(project.id);
    }
  };

  const handleDelete = (project: ProjectResponse) => {
    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      console.log('[ProjectListPage] Deleting project:', project.name);
      deleteProject(project.id);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    console.log('[ProjectListPage] Page changed to:', newPage);
    setPage(newPage - 1); // MUI Pagination is 1-indexed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state messages per tab
  const getEmptyMessage = () => {
    if (debouncedSearch) {
      return `No projects found matching "${debouncedSearch}"`;
    }

    switch (currentTab) {
      case 'my':
        return 'No projects yet';
      case 'archived':
        return 'No archived projects';
      case 'public':
        return 'No public projects available';
      default:
        return 'No projects found';
    }
  };

  const getEmptyDescription = () => {
    if (debouncedSearch) {
      return 'Try adjusting your search terms';
    }

    switch (currentTab) {
      case 'my':
        return 'Create your first project to get started';
      case 'archived':
        return 'Archived projects will appear here';
      case 'public':
        return 'Check back later for public projects';
      default:
        return undefined;
    }
  };

  const canCreateProject = hasPermission('PROJECT_CREATE');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Folder color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h3" component="h1">
            Projects
          </Typography>
        </Box>

        {canCreateProject && (
          <Button
            variant="primary"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Project
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="My Projects" value="my" />
          <Tab label="Archived" value="archived" />
          <Tab label="Public Projects" value="public" />
        </Tabs>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <Input
          placeholder="Search projects by name or key..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearchChange(e.target.value);
          }}
          fullWidth
        />
      </Box>

      {/* Project List */}
      <ProjectList
        projects={projects}
        isLoading={currentQuery.isLoading}
        error={currentQuery.error?.message}
        emptyMessage={getEmptyMessage()}
        emptyDescription={getEmptyDescription()}
        onEdit={handleEdit}
        onArchive={handleArchiveToggle}
        onDelete={handleDelete}
        showActions={currentTab !== 'public'}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1} // MUI Pagination is 1-indexed
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Create Project Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Create New Project</Typography>
          <IconButton onClick={() => setCreateDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectForm
            mode="create"
            onSubmit={handleCreateProject}
            onCancel={() => setCreateDialogOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={!!editingProject}
        onClose={() => setEditingProject(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Edit Project</Typography>
          <IconButton onClick={() => setEditingProject(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingProject && (
            <ProjectForm
              mode="edit"
              project={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProjectListPage;