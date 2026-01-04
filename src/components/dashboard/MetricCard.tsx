/**
 * MetricCard Component
 * Displays a single dashboard metric with icon, value, and optional subtitle
 */

import { Card, CardContent, Box, Typography, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

export interface MetricCardProps {
    /**
     * Card title/label
     */
    title: string;

    /**
     * Metric value (number or string like "72%")
     */
    value: number | string;

    /**
     * Icon to display (MUI icon component)
     */
    icon: ReactNode;

    /**
     * Icon background color
     */
    color: string;

    /**
     * Optional subtitle (e.g., "↑ 12% from last week")
     */
    subtitle?: string;

    /**
     * Whether metric is loading
     * @default false
     */
    loading?: boolean;

    /**
     * Click handler (optional)
     */
    onClick?: () => void;
}

/**
 * MetricCard - Display dashboard metric with icon and value
 * 
 * Features:
 * - Large value display
 * - Icon with colored background
 * - Optional subtitle for trends
 * - Loading state
 * - Optional click handler
 * - Responsive sizing
 * 
 * @example
 * <MetricCard
 *   title="Total Issues"
 *   value={45}
 *   icon={<AssignmentIcon />}
 *   color="#1976d2"
 *   subtitle="↑ 5 from last week"
 * />
 * 
 * @example
 * <MetricCard
 *   title="Completion Rate"
 *   value="72%"
 *   icon={<CheckCircleIcon />}
 *   color="#388e3c"
 *   loading={isLoading}
 * />
 */
export const MetricCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    loading = false,
    onClick,
}: MetricCardProps) => {
    console.log('[MetricCard] Rendering:', { title, value, loading });

    return (
        <Card
            sx={{
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onClick
                    ? {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                    }
                    : {},
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    {/* Text Content */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    mb: subtitle ? 0.5 : 0,
                                }}
                            >
                                {value}
                            </Typography>
                        )}

                        {subtitle && !loading && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {/* Icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: `${color}20`, // 20% opacity
                            color: color,
                            flexShrink: 0,
                            ml: 2,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MetricCard;