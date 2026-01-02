/**
 * IssuesByStatusChart Component
 * Pie/Donut chart displaying issue distribution by status
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EmptyState } from '@/components/common';
import { DonutLarge } from '@mui/icons-material';
import type { StatusChartData } from '@/interceptors/types/dashboard.types';

export interface IssuesByStatusChartProps {
    /**
     * Chart data prepared by prepareStatusChartData()
     */
    data: StatusChartData[];

    /**
     * Whether data is loading
     * @default false
     */
    loading?: boolean;

    /**
     * Chart title
     * @default "Issues by Status"
     */
    title?: string;

    /**
     * Chart height in pixels
     * @default 300
     */
    height?: number;

    /**
     * Use donut style (inner radius)
     * @default true
     */
    isDonut?: boolean;
}

/**
 * Custom tooltip for chart
 */
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    boxShadow: 2,
                }}
            >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                    {data.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Count: <strong>{data.value}</strong>
                </Typography>
            </Box>
        );
    }
    return null;
};

/**
 * Custom label for pie slices (shows count)
 */
const renderLabel = (props: any) => {
    const { value } = props;
    return value > 0 ? `${value}` : '';
};

/**
 * IssuesByStatusChart - Pie/Donut chart for status distribution
 * 
 * Features:
 * - Pie or Donut chart (configurable)
 * - Color-coded slices by status
 * - Custom tooltip with status name and count
 * - Legend at bottom
 * - Empty state when no data
 * - Responsive sizing
 * - Labels showing counts on slices
 * 
 * @example
 * const chartData = prepareStatusChartData(issuesByStatus);
 * 
 * <IssuesByStatusChart
 *   data={chartData}
 *   loading={isLoading}
 *   title="Issues by Status"
 *   height={350}
 * />
 */
export const IssuesByStatusChart = ({
    data,
    loading = false,
    title = 'Issues by Status',
    height = 300,
    isDonut = true,
}: IssuesByStatusChartProps) => {
    console.log('[IssuesByStatusChart] Rendering with data:', data.length, 'items');

    // Calculate total for display
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const isEmpty = !loading && total === 0;

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="h3" fontWeight={600}>
                        {title}
                    </Typography>
                    {!loading && !isEmpty && (
                        <Typography variant="body2" color="text.secondary">
                            Total: <strong>{total}</strong>
                        </Typography>
                    )}
                </Box>

                {/* Chart or Empty State */}
                {isEmpty ? (
                    <EmptyState
                        icon={<DonutLarge sx={{ fontSize: 48 }} />}
                        title="No issues to display"
                        description="Issue distribution will appear here once you have issues"
                    />
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height={height}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderLabel}
                                    outerRadius={80}
                                    innerRadius={isDonut ? 50 : 0} // Donut vs Pie
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationDuration={800}
                                    animationBegin={0}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => (
                                        <span style={{ fontSize: '0.875rem' }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default IssuesByStatusChart;