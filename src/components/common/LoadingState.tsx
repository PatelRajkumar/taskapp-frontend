/**
 * LoadingState Component
 * Displays loading skeletons
 */

import { Box, Skeleton, Grid } from '@mui/material';

export interface LoadingStateProps {
    /**
     * Number of skeleton items to show
     * @default 3
     */
    count?: number;
    /**
     * Height of each skeleton
     * @default 100
     */
    height?: number;
    /**
     * Skeleton variant
     * @default 'rectangular'
     */
    variant?: 'text' | 'rectangular' | 'circular';
    /**
     * Layout type
     * @default 'list'
     */
    layout?: 'list' | 'grid';
    /**
     * Grid columns (only for grid layout)
     * @default { xs: 12, sm: 6, md: 4 }
     */
    gridColumns?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
}

/**
 * LoadingState - Display loading skeletons
 * 
 * @example List layout
 * <LoadingState
 *   count={5}
 *   height={80}
 *   variant="rectangular"
 *   layout="list"
 * />
 * 
 * @example Grid layout
 * <LoadingState
 *   count={6}
 *   height={280}
 *   variant="rectangular"
 *   layout="grid"
 *   gridColumns={{ xs: 12, sm: 6, md: 4 }}
 * />
 */
export const LoadingState = ({
    count = 3,
    height = 100,
    variant = 'rectangular',
    layout = 'list',
    gridColumns = { xs: 12, sm: 6, md: 4 },
}: LoadingStateProps) => {
    console.log('[LoadingState] Rendering', count, 'skeletons in', layout, 'layout');

    // List Layout
    if (layout === 'list') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: count }).map((_, index) => (
                    <Skeleton
                        key={index}
                        variant={variant}
                        height={height}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Box>
        );
    }

    // Grid Layout
    return (
        <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, index) => (
                <Grid {...gridColumns} key={index}>
                    <Skeleton
                        variant={variant}
                        height={height}
                        sx={{ borderRadius: 1 }}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default LoadingState;