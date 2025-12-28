/**
 * IssueFilters Component
 * Filter panel for issue search with single-select dropdowns
 */

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Collapse,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess, Clear } from '@mui/icons-material';
import { useState } from 'react';
import { Button } from '@/components/common';
import { ISSUE_STATUS, ISSUE_TYPE, ISSUE_PRIORITY } from '@/utils/constants';
import type { IssueStatus, IssueType, IssuePriority } from '@/utils/constants';

export interface IssueFiltersProps {
  /**
   * Selected status (single value)
   */
  selectedStatus?: IssueStatus;
  /**
   * Selected type (single value)
   */
  selectedType?: IssueType;
  /**
   * Selected priority (single value)
   */
  selectedPriority?: IssuePriority;
  /**
   * Callback when filters change
   */
  onFiltersChange: (filters: {
    status?: IssueStatus;
    type?: IssueType;
    priority?: IssuePriority;
  }) => void;
  /**
   * Callback to clear all filters
   */
  onClearFilters: () => void;
  /**
   * Whether filters panel is initially open
   * @default false
   */
  initiallyOpen?: boolean;
}

/**
 * IssueFilters - Single-select filter panel for issues
 * 
 * Features:
 * - Single-select dropdowns for Status, Type, Priority
 * - Collapsible panel
 * - Clear all filters button
 * - Shows active filter count
 * - Auto-apply on change
 * - Matches backend API (single values)
 * 
 * @example
 * <IssueFilters
 *   selectedStatus="TODO"
 *   selectedType="BUG"
 *   selectedPriority="HIGH"
 *   onFiltersChange={handleFiltersChange}
 *   onClearFilters={handleClearFilters}
 * />
 */
export const IssueFilters = ({
  selectedStatus,
  selectedType,
  selectedPriority,
  onFiltersChange,
  onClearFilters,
  initiallyOpen = false,
}: IssueFiltersProps) => {
  const [expanded, setExpanded] = useState(initiallyOpen);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as IssueStatus;
    onFiltersChange({
      status: value || undefined,
      type: selectedType,
      priority: selectedPriority,
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as IssueType;
    onFiltersChange({
      status: selectedStatus,
      type: value || undefined,
      priority: selectedPriority,
    });
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as IssuePriority;
    onFiltersChange({
      status: selectedStatus,
      type: selectedType,
      priority: value || undefined,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedStatus) count++;
    if (selectedType) count++;
    if (selectedPriority) count++;
    return count;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <Box>
      {/* Filter Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getActiveFilterCount()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              startIcon={<Clear />}
              onClick={(e:any) => {
                e.stopPropagation();
                onClearFilters();
              }}
              sx={{ minWidth: 'auto' }}
            >
              Clear
            </Button>
          )}
          <IconButton size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Divider />

      {/* Filter Content */}
      <Collapse in={expanded}>
        <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={selectedStatus || ''}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value={ISSUE_STATUS.TODO}>To Do</MenuItem>
              <MenuItem value={ISSUE_STATUS.INPROGRESS}>In Progress</MenuItem>
              <MenuItem value={ISSUE_STATUS.DONE}>Done</MenuItem>
            </Select>
          </FormControl>

          {/* Type Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              value={selectedType || ''}
              onChange={handleTypeChange}
              label="Type"
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              <MenuItem value={ISSUE_TYPE.TASK}>Task</MenuItem>
              <MenuItem value={ISSUE_TYPE.BUG}>Bug</MenuItem>
            </Select>
          </FormControl>

          {/* Priority Filter */}
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              value={selectedPriority || ''}
              onChange={handlePriorityChange}
              label="Priority"
            >
              <MenuItem value="">
                <em>All Priorities</em>
              </MenuItem>
              <MenuItem value={ISSUE_PRIORITY.LOW}>Low</MenuItem>
              <MenuItem value={ISSUE_PRIORITY.MEDIUM}>Medium</MenuItem>
              <MenuItem value={ISSUE_PRIORITY.HIGH}>High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
};

export default IssueFilters;