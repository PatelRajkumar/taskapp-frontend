/**
 * ProjectList Component
 * Displays a list of project cards with loading and empty states
 */

import { Grid } from '@mui/material';
import { FolderOff } from '@mui/icons-material';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { ProjectCard, ProjectCardProps } from './ProjectCard';
import type { ProjectResponse } from '@/interceptors/types/project.types';

export interface ProjectListProps {
  /**
   * Array of projects to display
   */
  projects: ProjectResponse[];
  /**
   * Whether data is loading
   */
  isLoading?: boolean;
  /**
   * Error message if fetch failed
   */
  error?: string | null;
  /**
   * Empty state message
   * @default "No projects found"
   */
  emptyMessage?: string;
  /**
   * Empty state description
   */
  emptyDescription?: string;
  /**
   * Callbacks passed to ProjectCard
   */
  onEdit?: ProjectCardProps['onEdit'];
  onArchive?: ProjectCardProps['onArchive'];
  onDelete?: ProjectCardProps['onDelete'];
  /**
   * Whether to show actions on cards
   * @default true
   */
  showActions?: boolean;
  /**
   * Number of skeleton cards to show while loading
   * @default 6
   */
  skeletonCount?: number;
}

/**
 * ProjectList - Container for displaying multiple project cards
 * 
 * Features:
 * - Grid layout (responsive)
 * - Loading skeletons
 * - Empty state with icon
 * - Error state
 * 
 * @example
 * <ProjectList
 *   projects={projects}
 *   isLoading={isLoading}
 *   error={error?.message}
 *   emptyMessage="No projects yet"
 *   emptyDescription="Create your first project to get started"
 *   onEdit={handleEdit}
 *   onArchive={handleArchive}
 *   onDelete={handleDelete}
 * />
 */
export const ProjectList = ({
  projects,
  isLoading = false,
  error = null,
  emptyMessage = 'No projects found',
  emptyDescription,
  onEdit,
  onArchive,
  onDelete,
  showActions = true,
  skeletonCount = 6,
}: ProjectListProps) => {
  console.log('[ProjectList] Rendering with:', {
    projectCount: projects.length,
    isLoading,
    hasError: !!error,
  });

  // Loading State
  if (isLoading) {
    console.log('[ProjectList] Showing loading skeletons');
    return (
      <LoadingState
        count={skeletonCount}
        height={280}
        layout="grid"
        gridColumns={{ xs: 12, sm: 6, md: 4 }}
      />
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorState
        icon={<FolderOff />}
        title="Failed to load projects"
        description={error}
      />
    );
  }

  // Empty State
  if (projects.length === 0) {
    console.log('[ProjectList] No projects to display');
    return (
      <EmptyState
        icon={<FolderOff />}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  // Projects Grid
  console.log('[ProjectList] Rendering', projects.length, 'projects');
  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onArchive={onArchive}
            onDelete={onDelete}
            showActions={showActions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;