/**
 * DashboardPage Component
 * Main dashboard page displaying metrics, charts, activities, and upcoming dues
 */

import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Alert } from '@mui/material';
import {
    Assignment,
    ErrorOutline,
    CheckCircle,
    Folder,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout';
import { useDashboardData } from '@/hooks/useDashboard';
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter';
import {
    MetricCard,
    DateRangeFilter,
    IssuesByStatusChart,
    ProjectCompletionChart,
    ActivityTimelineItem,
    UpcomingDueItem,
} from '@/components/dashboard';
import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { DateRangePreset } from '@/interceptors/types/dashboard.types';

/**
 * DashboardPage - Main dashboard view
 * 
 * Features:
 * - Overview metrics (4 cards)
 * - Date range filter
 * - Charts (Issues by Status, Project Completion)
 * - Recent activity timeline
 * - Upcoming/overdue issues
 * - Responsive grid layout
 * - Loading/error states
 * - Navigation to projects/issues
 * 
 * @example
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */
export const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    console.log('[DashboardPage] Rendering for user:', user?.name);

    // Date range filter state
    const {
        filter,
        preset,
        customRange,
        setPreset,
        setCustomRange,
    } = useDateRangeFilter(DateRangePreset.LAST_30_DAYS);

    // Dashboard data
    const {
        data,
        isLoading,
        loadingState,
        error,
        projects,
    } = useDashboardData(filter);

    console.log('[DashboardPage] Loading:', isLoading, 'Has data:', !!data, 'Error:', !!error);

    // Navigation handlers
    const handleProjectClick = (projectId: string) => {
        console.log('[DashboardPage] Navigating to project:', projectId);
        navigate(`/projects/${projectId}`);
    };

    const handleActivityClick = (activity: any) => {
        console.log('[DashboardPage] Navigating to issue:', activity.issueKey);
        navigate(`/projects/${activity.projectId}`);
    };

    const handleUpcomingDueClick = (issue: any) => {
        console.log('[DashboardPage] Navigating to issue:', issue.key);
        navigate(`/projects/${issue.projectId}`);
    };

    // Loading State
    if (isLoading) {
        console.log('[DashboardPage] Showing loading state');
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Loading your dashboard...
                    </Typography>
                </Box>
                <LoadingState
                    count={4}
                    height={120}
                    layout="grid"
                    gridColumns={{ xs: 12, sm: 6, md: 3 }}
                />
            </Container>
        );
    }

    // Error State
    if (error) {
        console.error('[DashboardPage] Error:', error);
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <ErrorState
                    icon={<ErrorOutline sx={{ fontSize: 64 }} />}
                    title="Failed to load dashboard"
                    description={error.general || 'Unable to fetch dashboard data. Please try again.'}
                />
            </Container>
        );
    }

    // No data (shouldn't happen after loading completes, but defensive)
    if (!data) {
        console.warn('[DashboardPage] No data available');
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <EmptyState
                    icon={<ErrorOutline sx={{ fontSize: 64 }} />}
                    title="No dashboard data"
                    description="Unable to display dashboard. Please refresh the page."
                />
            </Container>
        );
    }

    const { metrics, statusChartData, projectCompletions, recentActivities, upcomingDues } = data;
    console.log('[DashboardPage] Data:', data);
    console.log('[DashboardPage] Metrics:', metrics);
    console.log('[DashboardPage] Status Chart Data:', statusChartData);
    console.log('[DashboardPage] Project Completions:', projectCompletions);
    console.log('[DashboardPage] Recent Activities:', recentActivities);
    console.log('[DashboardPage] Upcoming Dues:', upcomingDues);
    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Page Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome back, {user?.name}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's an overview of your tasks and projects
                        </Typography>
                    </Box>

                    {/* Date Range Filter */}
                    <DateRangeFilter
                        value={preset}
                        onChange={setPreset}
                        customRange={customRange}
                        onCustomRangeChange={setCustomRange}
                    />
                </Box>

                {/* Metrics Grid - 4 Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Total Assigned"
                            value={metrics.totalAssignedIssues}
                            icon={<Assignment />}
                            color="#1976d2"
                            loading={loadingState.aggregating}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Overdue Issues"
                            value={metrics.overdueIssues}
                            icon={<ErrorOutline />}
                            color="#d32f2f"
                            loading={loadingState.aggregating}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Completion Rate"
                            value={`${metrics.completionRate}%`}
                            icon={<CheckCircle />}
                            color="#388e3c"
                            loading={loadingState.aggregating}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Active Projects"
                            value={metrics.activeProjects}
                            icon={<Folder />}
                            color="#f57c00"
                            loading={loadingState.aggregating}
                        />
                    </Grid>
                </Grid>

                {/* Charts Section - 2 columns on desktop, stack on mobile */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <IssuesByStatusChart
                            data={statusChartData}
                            loading={loadingState.aggregating}
                            title="My Issues by Status"
                            height={300}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProjectCompletionChart
                            data={projectCompletions}
                            loading={loadingState.aggregating}
                            title="Top Projects"
                            height={300}
                            onProjectClick={handleProjectClick}
                        />
                    </Grid>
                </Grid>

                {/* Activity & Upcoming Section - 2 columns on desktop, stack on mobile */}
                <Grid container spacing={3}>
                    {/* Recent Activity */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                                Recent Activity
                            </Typography>

                            {recentActivities.length === 0 ? (
                                <EmptyState
                                    icon={<Assignment sx={{ fontSize: 48 }} />}
                                    title="No recent activity"
                                    description="Your recent actions will appear here"
                                />
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {recentActivities.slice(0, 10).map((activity) => (
                                        <ActivityTimelineItem
                                            key={activity.id}
                                            activity={activity}
                                            onClick={handleActivityClick}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Upcoming & Overdue Issues */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                                Upcoming & Overdue
                            </Typography>

                            {upcomingDues.length === 0 ? (
                                <EmptyState
                                    icon={<CheckCircle sx={{ fontSize: 48 }} />}
                                    title="All caught up!"
                                    description="No upcoming or overdue issues"
                                />
                            ) : (
                                <>
                                    {/* Show overdue issues first if any */}
                                    {upcomingDues.filter(issue => issue.isOverdue).length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                You have {upcomingDues.filter(issue => issue.isOverdue).length} overdue issue(s)
                                            </Alert>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {upcomingDues.slice(0, 10).map((issue) => (
                                            <UpcomingDueItem
                                                key={issue.id}
                                                issue={issue}
                                                onClick={handleUpcomingDueClick}
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default DashboardPage;