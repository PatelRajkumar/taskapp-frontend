/**
 * IssueListPage Component
 * Global issue list page - search across all accessible projects
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Pagination,
  Paper,
} from '@mui/material';
import { Close, Assignment, FilterList } from '@mui/icons-material';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import {
  IssueList,
  IssueDetailDialog,
} from '@/components/issues';
import { useFilteredIssues, useIssueByKey } from '@/hooks/useIssues';
import { useAuth } from '@/hooks/useAuth';
import type { IssueResponse, IssueFilterParams, IssueSummary } from '@/interceptors/types/issue.types';
import type { IssueStatus } from '@/utils/constants';

/**
 * IssueListPage - Global issue search page
 * 
 * Features:
 * - Search issues across all projects
 * - Filter by project, status, type, priority
 * - Issue detail dialog
 * - Pagination
 * 
 * URL: /issues
 */
const IssueListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filter state
  const [filters, setFilters] = useState<IssueFilterParams>({
    page,
    size: pageSize,
    sort: 'updatedAt,desc',
  });

  // Dialog state
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);

  console.log('[IssueListPage] Rendering with page:', page);

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    console.log('[IssueListPage] Search term changed:', value);
    setDebouncedSearch(value);
    setFilters(prev => ({ ...prev, search: value, page: 0 }));
    setPage(0);
  }, 300);

  // Queries
  const { data, isLoading, error } = useFilteredIssues(filters);
  const issues = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // Load selected issue details
  const { data: selectedIssue, isLoading: isLoadingIssue } = useIssueByKey(
    selectedIssueKey || '',
    !!selectedIssueKey
  );

  // Handlers
  const handleCardClick = (issue: IssueSummary) => {
    console.log('[IssueListPage] Issue clicked:', issue.key);
    setSelectedIssueKey(issue.key);
  };

  const handleCloseDetail = () => {
    setSelectedIssueKey(null);
  };

  const handleEdit = (issue: IssueResponse) => {
    console.log('[IssueListPage] Edit issue:', issue.key);
    // Navigate to project to edit
    navigate(`/projects/${issue.project.id}`);
    toast.success('Navigate to project to edit issue');
  };

  const handleDelete = (issue: IssueResponse) => {
    console.log('[IssueListPage] Delete issue:', issue.key);
    // Navigate to project to delete
    navigate(`/projects/${issue.project.id}`);
    toast.success('Navigate to project to delete issue');
  };

  const handleStatusChange = (issue: IssueResponse, newStatus: IssueStatus) => {
    console.log('[IssueListPage] Status change:', issue.key, newStatus);
    // Navigate to project to change status
    navigate(`/projects/${issue.project.id}`);
    toast.success('Navigate to project to change status');
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    console.log('[IssueListPage] Page changed to:', newPage);
    setPage(newPage - 1);
    setFilters(prev => ({ ...prev, page: newPage - 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state messages
  const getEmptyMessage = () => {
    if (debouncedSearch) {
      return `No issues found matching "${debouncedSearch}"`;
    }
    return 'No issues found';
  };

  const getEmptyDescription = () => {
    if (debouncedSearch) {
      return 'Try adjusting your search terms';
    }
    return 'Issues from all accessible projects will appear here';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assignment color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h3" component="h1">
            All Issues
          </Typography>
        </Box>
      </Box>

      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Search Bar */}
          <Box sx={{ flex: 1 }}>
            <Input
              placeholder="Search issues by title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearchChange(e.target.value);
              }}
              fullWidth
            />
          </Box>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => toast.error('Advanced filters not yet implemented')}
          >
            Filters
          </Button>
        </Box>
      </Paper>

      {/* Issue List */}
      <IssueList
        issues={issues}
        isLoading={isLoading}
        error={error?.message}
        emptyMessage={getEmptyMessage()}
        emptyDescription={getEmptyDescription()}
        onClick={handleCardClick}
        showActions={false}
        showStatusDropdown={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Issue Detail Dialog */}
      <IssueDetailDialog
        open={!!selectedIssueKey}
        onClose={handleCloseDetail}
        issue={selectedIssue || null}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        isLoading={isLoadingIssue}
      />
    </Container>
  );
};

export default IssueListPage;