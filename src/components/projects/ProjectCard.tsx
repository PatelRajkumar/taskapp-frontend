/**
 * ProjectCard Component
 * Displays a single project with actions
 */

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Archive,
  Unarchive,
  Delete,
  People,
  Folder,
  Lock,
  Public,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { ProjectResponse } from '@/interceptors/types/project.types';
import { Avatar } from '@/components/profile';

export interface ProjectCardProps {
  /**
   * Project data to display
   */
  project: ProjectResponse;
  /**
   * Callback when edit is clicked
   */
  onEdit?: (project: ProjectResponse) => void;
  /**
   * Callback when archive/restore is clicked
   */
  onArchive?: (project: ProjectResponse) => void;
  /**
   * Callback when delete is clicked
   */
  onDelete?: (project: ProjectResponse) => void;
  /**
   * Whether to show action menu
   * @default true
   */
  showActions?: boolean;
}

/**
 * ProjectCard - Displays project information in a card format
 * 
 * Features:
 * - Project name, description, visibility
 * - Member and issue counts
 * - Created by info with avatar
 * - Actions menu (edit, archive, delete)
 * - Click to navigate to project details
 * 
 * @example
 * <ProjectCard
 *   project={project}
 *   onEdit={handleEdit}
 *   onArchive={handleArchive}
 *   onDelete={handleDelete}
 * />
 */
export const ProjectCard = ({
  project,
  onEdit,
  onArchive,
  onDelete,
  showActions = true,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  console.log('[ProjectCard] Rendering project:', project.name);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click
    setAnchorEl(event.currentTarget);
    console.log('[ProjectCard] Menu opened for project:', project.name);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    console.log('[ProjectCard] Menu closed');
  };

  const handleCardClick = () => {
    console.log('[ProjectCard] Navigating to project:', project.key);
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[ProjectCard] Edit clicked for project:', project.name);
    handleMenuClose();
    onEdit?.(project);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[ProjectCard] Archive/Restore clicked for project:', project.name);
    handleMenuClose();
    onArchive?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[ProjectCard] Delete clicked for project:', project.name);
    handleMenuClose();
    onDelete?.(project);
  };

  // Determine user permissions
  const canEdit = project.currentUserRole === 'OWNER' || project.currentUserRole === 'ADMIN';
  const canArchive = project.currentUserRole === 'OWNER';
  const canDelete = project.currentUserRole === 'OWNER';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
        opacity: project.isArchived ? 0.7 : 1,
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with Key and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Folder color="primary" />
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {project.key}
            </Typography>
          </Box>
          
          {showActions && (canEdit || canArchive || canDelete) && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ mt: -1, mr: -1 }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Project Name */}
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {project.name}
        </Typography>

        {/* Description */}
        {project.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Status Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {/* Visibility */}
          <Chip
            icon={project.visibility === 'PUBLIC' ? <Public /> : <Lock />}
            label={project.visibility}
            size="small"
            color={project.visibility === 'PUBLIC' ? 'success' : 'default'}
            variant="outlined"
          />
          
          {/* Archived */}
          {project.isArchived && (
            <Chip
              icon={<Archive />}
              label="Archived"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
          
          {/* User Role */}
          {project.currentUserRole && (
            <Chip
              label={project.currentUserRole}
              size="small"
              color="primary"
              variant="filled"
            />
          )}
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Tooltip title="Members">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <People fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {project.memberCount}
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Issues">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Settings fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {project.issueCount}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        {/* Creator Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            name={project.createdBy.name}
            src={project.createdBy.avatarUrl}
            size="small"
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              Created by {project.createdBy.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {canEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Project</ListItemText>
          </MenuItem>
        )}
        
        {canArchive && (
          <MenuItem onClick={handleArchive}>
            <ListItemIcon>
              {project.isArchived ? <Unarchive fontSize="small" /> : <Archive fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{project.isArchived ? 'Restore Project' : 'Archive Project'}</ListItemText>
          </MenuItem>
        )}
        
        {canDelete && !project.isArchived && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Project</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default ProjectCard;