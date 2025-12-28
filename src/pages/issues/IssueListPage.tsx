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
  Pagination,
  Paper,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { debounce } from 'lodash';
import { Input } from '@/components/common';
import {
  IssueList,
  IssueDetailDialog,
  IssueFilters,
} from '@/components/issues';
import { useFilteredIssues, useIssueByKey } from '@/hooks/useIssues';
import { useAuth } from '@/hooks/useAuth';
import type { IssueResponse, IssueFilterParams, IssueSummary } from '@/interceptors/types/issue.types';
import type { IssueStatus, IssueType, IssuePriority } from '@/utils/constants';

/**
 * IssueListPage - Global issue search page
 * 
 * Features:
 * - Search issues across all projects
 * - Filter by status, type, priority (single-select)
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

  // Filter state (single values matching backend)
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<IssueType | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | undefined>(undefined);

  // Dialog state
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);

  console.log('[IssueListPage] Rendering with page:', page);

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    console.log('[IssueListPage] Search term changed:', value);
    setDebouncedSearch(value);
    setPage(0); // Reset to first page on search
  }, 300);

  // Build filter params
  const buildFilterParams = (): IssueFilterParams => {
    const params: IssueFilterParams = {
      page,
      size: pageSize,
      sort: 'updatedAt,desc',
    };

    // Add filters (backend accepts single values)
    if (selectedStatus) {
      params.status = selectedStatus;
    }
    if (selectedType) {
      params.type = selectedType;
    }
    if (selectedPriority) {
      params.priority = selectedPriority;
    }

    return params;
  };

  // Query
  const { data, isLoading, error } = useFilteredIssues(buildFilterParams());
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
  };

  const handleDelete = (issue: IssueResponse) => {
    console.log('[IssueListPage] Delete issue:', issue.key);
    // Navigate to project to delete
    navigate(`/projects/${issue.project.id}`);
  };

  const handleStatusChange = (issue: IssueResponse, newStatus: IssueStatus) => {
    console.log('[IssueListPage] Status change:', issue.key, newStatus);
    // Navigate to project to change status
    navigate(`/projects/${issue.project.id}`);
  };

  const handleFiltersChange = (filters: {
    status?: IssueStatus;
    type?: IssueType;
    priority?: IssuePriority;
  }) => {
    console.log('[IssueListPage] Filters changed:', filters);
    setSelectedStatus(filters.status);
    setSelectedType(filters.type);
    setSelectedPriority(filters.priority);
    setPage(0); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    console.log('[IssueListPage] Clearing filters');
    setSelectedStatus(undefined);
    setSelectedType(undefined);
    setSelectedPriority(undefined);
    setPage(0);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    console.log('[IssueListPage] Page changed to:', newPage);
    setPage(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state messages
  const getEmptyMessage = () => {
    if (debouncedSearch) {
      return `No issues found matching "${debouncedSearch}"`;
    }
    const hasFilters = selectedStatus || selectedType || selectedPriority;
    if (hasFilters) {
      return 'No issues match the selected filters';
    }
    return 'No issues found';
  };

  const getEmptyDescription = () => {
    if (debouncedSearch) {
      return 'Try adjusting your search terms';
    }
    const hasFilters = selectedStatus || selectedType || selectedPriority;
    if (hasFilters) {
      return 'Try removing some filters';
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
        {/* Search Bar */}
        {/* <Box sx={{ mb: 2 }}>
          <Input
            placeholder="Search issues by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearchChange(e.target.value);
            }}
            fullWidth
          />
        </Box> */}

        {/* Filters */}
        <IssueFilters
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          selectedPriority={selectedPriority}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
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