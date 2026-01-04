/**
 * ActivityTimelineItem Component
 * Displays a single activity item in the dashboard timeline
 */

import { Box, Typography, Paper } from '@mui/material';
import {
    AddCircleOutline,
    AssignmentInd,
    CheckCircle,
    SwapHoriz,
    Comment,
} from '@mui/icons-material';
import { formatRelativeTime } from '@/utils/dashboard.utils';
import type { Activity, ActivityType } from '@/interceptors/types/dashboard.types';
import { ACTIVITY_TYPE_LABELS } from '@/interceptors/types/dashboard.types';

export interface ActivityTimelineItemProps {
    /**
     * Activity data
     */
    activity: Activity;

    /**
     * Callback when activity is clicked (navigates to issue)
     */
    onClick?: (activity: Activity) => void;
}

/**
 * Get activity icon based on type
 */
const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case 'ISSUE_CREATED':
            return <AddCircleOutline fontSize="small" />;
        case 'ISSUE_ASSIGNED':
            return <AssignmentInd fontSize="small" />;
        case 'ISSUE_COMPLETED':
            return <CheckCircle fontSize="small" />;
        case 'STATUS_CHANGED':
            return <SwapHoriz fontSize="small" />;
        case 'COMMENT_ADDED':
            return <Comment fontSize="small" />;
        default:
            return <AddCircleOutline fontSize="small" />;
    }
};

/**
 * Get activity icon color based on type
 */
const getActivityColor = (type: ActivityType): string => {
    switch (type) {
        case 'ISSUE_CREATED':
            return '#2196f3'; // Blue
        case 'ISSUE_ASSIGNED':
            return '#ff9800'; // Orange
        case 'ISSUE_COMPLETED':
            return '#4caf50'; // Green
        case 'STATUS_CHANGED':
            return '#9c27b0'; // Purple
        case 'COMMENT_ADDED':
            return '#00bcd4'; // Cyan
        default:
            return '#757575'; // Gray
    }
};

/**
 * ActivityTimelineItem - Display single activity with icon and description
 * 
 * Features:
 * - Icon with colored background based on activity type
 * - Activity description (e.g., "You created PROJ-123: Fix login bug")
 * - Relative timestamp (e.g., "2 hours ago")
 * - Click to navigate to issue
 * - Hover effect
 * 
 * @example
 * <ActivityTimelineItem
 *   activity={activity}
 *   onClick={handleActivityClick}
 * />
 */
export const ActivityTimelineItem = ({ activity, onClick }: ActivityTimelineItemProps) => {
    console.log('[ActivityTimelineItem] Rendering activity:', activity.type, activity.issueKey);

    const handleClick = () => {
        console.log('[ActivityTimelineItem] Clicked:', activity.issueKey);
        onClick?.(activity);
    };

    const iconColor = getActivityColor(activity.type);

    return (
        <Paper
            sx={{
                p: 2,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onClick
                    ? {
                        backgroundColor: 'action.hover',
                        boxShadow: 2,
                    }
                    : {},
            }}
            onClick={handleClick}
        >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                {/* Icon */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: `${iconColor}20`, // 20% opacity
                        color: iconColor,
                        flexShrink: 0,
                    }}
                >
                    {getActivityIcon(activity.type)}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Activity Type Badge (optional, can be removed if redundant) */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            backgroundColor: `${iconColor}15`,
                            color: iconColor,
                            fontWeight: 600,
                            mb: 0.5,
                        }}
                    >
                        {ACTIVITY_TYPE_LABELS[activity.type]}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {activity.description}
                    </Typography>

                    {/* Timestamp */}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {formatRelativeTime(activity.timestamp)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default ActivityTimelineItem;