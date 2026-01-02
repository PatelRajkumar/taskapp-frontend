/**
 * ProjectCompletionChart Component
 * Horizontal bar chart displaying project completion percentages
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { EmptyState } from '@/components/common';
import { BarChartOutlined } from '@mui/icons-material';
import { getCompletionColor } from '@/utils/dashboard.utils';
import type { ProjectCompletion } from '@/interceptors/types/dashboard.types';

export interface ProjectCompletionChartProps {
    /**
     * Chart data prepared by calculateProjectCompletions()
     */
    data: ProjectCompletion[];

    /**
     * Whether data is loading
     * @default false
     */
    loading?: boolean;

    /**
     * Chart title
     * @default "Project Completion"
     */
    title?: string;

    /**
     * Chart height in pixels
     * @default 300
     */
    height?: number;

    /**
     * Callback when project bar is clicked
     */
    onProjectClick?: (projectId: string) => void;
}

/**
 * Custom tooltip showing project details
 */
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ProjectCompletion;
        return (
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    boxShadow: 2,
                    minWidth: 180,
                }}
            >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {data.projectName}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                    {data.projectKey}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2">
                        Completion: <strong>{data.completionPercentage}%</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Done: {data.completedIssues} / {data.totalIssues}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        In Progress: {data.inProgressIssues}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        To Do: {data.todoIssues}
                    </Typography>
                </Box>
            </Box>
        );
    }
    return null;
};

/**
 * Custom Y-axis tick to truncate long project names
 */
const CustomYAxisTick = ({ x, y, payload }: any) => {
    const maxLength = 15;
    const text = payload.value;
    const truncated = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

    return (
        <text
            x={x}
            y={y}
            dy={4}
            textAnchor="end"
            fill="#666"
            fontSize={12}
            style={{ cursor: 'pointer' }}
        >
            {truncated}
        </text>
    );
};

/**
 * ProjectCompletionChart - Horizontal bar chart for project completion
 * 
 * Features:
 * - Horizontal bars (better for project names)
 * - Color-coded bars by completion % (red → yellow → green)
 * - Custom tooltip with detailed stats
 * - Truncated project names on Y-axis
 * - Click handler for navigation
 * - Empty state when no data
 * - Responsive sizing
 * - Grid lines for easier reading
 * 
 * @example
 * const chartData = calculateProjectCompletions(projects, allIssues, 8);
 * 
 * <ProjectCompletionChart
 *   data={chartData}
 *   loading={isLoading}
 *   title="Top Projects by Activity"
 *   height={400}
 *   onProjectClick={(id) => navigate(`/projects/${id}`)}
 * />
 */
export const ProjectCompletionChart = ({
    data,
    loading = false,
    title = 'Project Completion',
    height = 300,
    onProjectClick,
}: ProjectCompletionChartProps) => {
    console.log('[ProjectCompletionChart] Rendering with data:', data.length, 'projects');

    const isEmpty = !loading && data.length === 0;

    const handleBarClick = (data: any, _index: number) => {
        const entry = data.payload as ProjectCompletion;
        console.log('[ProjectCompletionChart] Bar clicked:', entry.projectName);
        if (onProjectClick) {
            onProjectClick(entry.projectId);
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h3" fontWeight={600}>
                        {title}
                    </Typography>
                    {!loading && !isEmpty && (
                        <Typography variant="caption" color="text.secondary">
                            Showing top {data.length} projects by total issues
                        </Typography>
                    )}
                </Box>

                {/* Chart or Empty State */}
                {isEmpty ? (
                    <EmptyState
                        icon={<BarChartOutlined sx={{ fontSize: 48 }} />}
                        title="No project data available"
                        description="Project completion stats will appear here once you have projects with issues"
                    />
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height={height}>
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                    fontSize={12}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="projectName"
                                    width={120}
                                    tick={<CustomYAxisTick />}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                <Bar
                                    dataKey="completionPercentage"
                                    radius={[0, 4, 4, 0]}
                                    animationDuration={800}
                                    animationBegin={0}
                                    onClick={onProjectClick ? handleBarClick : undefined}
                                    style={{ cursor: onProjectClick ? 'pointer' : 'default' }}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getCompletionColor(entry.completionPercentage)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                )}

                {/* Legend */}
                {!isEmpty && (
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#f44336',
                                    borderRadius: 0.5,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                0-25%
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#ffc107',
                                    borderRadius: 0.5,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                25-50%
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#ff9800',
                                    borderRadius: 0.5,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                50-75%
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: '#4caf50',
                                    borderRadius: 0.5,
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                75-100%
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ProjectCompletionChart;