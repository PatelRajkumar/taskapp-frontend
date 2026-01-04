/**
 * IssueListPage Component
 * Global issue list page - search across all accessible projects
 * 
 * NOTE: This page is READ-ONLY for discovery purposes
 * - Users can view issue details in dialog
 * - No edit/delete/status change actions available
 * - To modify issues, users must navigate to project context
 */

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Pagination,
  Paper,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { Input } from '@/components/common';
import {
  IssueList,
  IssueDetailDialog,
  IssueFilters,
} from '@/components/issues';
import { useFilteredIssues, useIssueByKey } from '@/hooks/useIssues';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout';
import type { IssueFilterParams, IssueSummary } from '@/interceptors/types/issue.types';
import type { IssueStatus, IssueType, IssuePriority } from '@/utils/constants';

/**
 * IssueListPage - Global issue search page (READ-ONLY)
 * 
 * Features:
 * - Filter by status, type, priority (single-select)
 * - Issue detail dialog (read-only view)
 * - Pagination
 * - Click card to view details
 * 
 * Limitations:
 * - No editing capabilities
 * - No delete capabilities
 * - No status change capabilities
 * - For mutations, users must go to project context
 * 
 * URL: /issues
 */
const IssueListPage = () => {
  const { user } = useAuth();

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // Filter state (single values matching backend)
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<IssueType | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | undefined>(undefined);

  // Dialog state
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);

  console.log('[IssueListPage] Rendering with page:', page);

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
    const hasFilters = selectedStatus || selectedType || selectedPriority;
    if (hasFilters) {
      return 'No issues match the selected filters';
    }
    return 'No issues found';
  };

  const getEmptyDescription = () => {
    const hasFilters = selectedStatus || selectedType || selectedPriority;
    if (hasFilters) {
      return 'Try removing some filters';
    }
    return 'Issues from all accessible projects will appear here';
  };

  return (
    <>
      <Header />
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

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <IssueFilters
            selectedStatus={selectedStatus}
            selectedType={selectedType}
            selectedPriority={selectedPriority}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </Paper>

        {/* Issue List - Cards are READ-ONLY (no actions) */}
        <IssueList
          issues={issues}
          isLoading={isLoading}
          error={error?.message}
          emptyMessage={getEmptyMessage()}
          emptyDescription={getEmptyDescription()}
          onClick={handleCardClick}
          showActions={false}         // ✅ No edit/delete menu on cards
          showStatusDropdown={false}  // ✅ No status dropdown on cards
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

        {/* Issue Detail Dialog - READ-ONLY (no callbacks) */}
        <IssueDetailDialog
          open={!!selectedIssueKey}
          onClose={handleCloseDetail}
          issue={selectedIssue || null}
          // ❌ No onEdit callback - dialog will hide edit button
          // ❌ No onDelete callback - dialog will hide delete button
          // ❌ No onStatusChange callback - dialog will hide status dropdown
          isLoading={isLoadingIssue}
        />
      </Container>
    </>
  );
};

export default IssueListPage;