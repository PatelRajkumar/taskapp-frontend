/**
 * UpcomingDueItem Component
 * Displays a single upcoming or overdue issue with due date info
 */

import { Box, Typography, Chip, Paper } from '@mui/material';
import { CalendarToday, Warning } from '@mui/icons-material';
import { IssuePriorityBadge } from '@/components/issues/IssuePriorityBadge';
import { formatDaysUntilDue, getDueDateChipColor } from '@/utils/dashboard.utils';
import type { UpcomingIssue } from '@/interceptors/types/dashboard.types';

export interface UpcomingDueItemProps {
    /**
     * Upcoming/overdue issue data
     */
    issue: UpcomingIssue;

    /**
     * Callback when issue is clicked (navigates to issue)
     */
    onClick?: (issue: UpcomingIssue) => void;
}

/**
 * UpcomingDueItem - Display issue with due date information
 * 
 * Features:
 * - Issue key and title
 * - Priority badge
 * - Due date chip with color coding:
 *   - Red: Overdue
 *   - Orange: Due today or within 2 days
 *   - Green: Due later (3+ days)
 * - Days until/overdue count
 * - Project name
 * - Click to navigate to issue
 * - Hover effect
 * 
 * @example
 * <UpcomingDueItem
 *   issue={upcomingIssue}
 *   onClick={handleIssueClick}
 * />
 */
export const UpcomingDueItem = ({ issue, onClick }: UpcomingDueItemProps) => {
    console.log('[UpcomingDueItem] Rendering:', issue.key, 'Days until due:', issue.daysUntilDue);

    const handleClick = () => {
        console.log('[UpcomingDueItem] Clicked:', issue.key);
        onClick?.(issue);
    };

    const chipColor = getDueDateChipColor(issue.daysUntilDue);
    const dueDateText = formatDaysUntilDue(issue.daysUntilDue);

    return (
        <Paper
            sx={{
                p: 2,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                borderLeft: issue.isOverdue ? '4px solid' : 'none',
                borderColor: issue.isOverdue ? 'error.main' : 'transparent',
                '&:hover': onClick
                    ? {
                        backgroundColor: 'action.hover',
                        boxShadow: 2,
                    }
                    : {},
            }}
            onClick={handleClick}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Header: Issue Key + Priority */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="caption" color="primary" fontWeight="bold">
                        {issue.key}
                    </Typography>
                    <IssuePriorityBadge priority={issue.priority} size="small" />
                </Box>

                {/* Issue Title */}
                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {issue.title}
                </Typography>

                {/* Due Date Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    {/* Due Date Chip */}
                    <Chip
                        icon={issue.isOverdue ? <Warning /> : <CalendarToday />}
                        label={dueDateText}
                        size="small"
                        color={chipColor}
                        variant="filled"
                        sx={{
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: 'inherit',
                            },
                        }}
                    />

                    {/* Project Name */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {issue.projectName}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default UpcomingDueItem;