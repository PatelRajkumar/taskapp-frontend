import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader } from '@mui/material';
import { ReactNode } from 'react';

export interface CardProps extends MuiCardProps {
    /**
     * Card title
     */
    title?: string;
    /**
     * Card subtitle
     */
    subtitle?: string;
    /**
     * Card content
     */
    children: ReactNode;
    /**
     * Show card header
     * @default false
     */
    showHeader?: boolean;
    /**
     * Card padding
     * @default 3
     */
    padding?: number;
}

/**
 * Custom Card component wrapping MUI Card with consistent styling
 * 
 * @example
 * <Card title="Login" subtitle="Welcome back!">
 *   <form>...</form>
 * </Card>
 * 
 * @example
 * <Card padding={2}>
 *   <Typography>Card content</Typography>
 * </Card>
 */
export const Card = ({
    title,
    subtitle,
    children,
    showHeader = false,
    padding = 3,
    ...props
}: CardProps) => {
    const hasHeader = showHeader || title || subtitle;

    return (
        <MuiCard
            {...props}
            sx={{
                width: '100%',
                ...props.sx,
            }}
        >
            {hasHeader && (
                <CardHeader
                    title={title}
                    subheader={subtitle}
                    sx={{
                        textAlign: 'center',
                        pb: 0,
                    }}
                    titleTypographyProps={{
                        variant: 'h5',
                        component: 'h2',
                        fontWeight: 600,
                    }}
                    subheaderTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                    }}
                />
            )}

            <CardContent
                sx={{
                    p: padding,
                    '&:last-child': {
                        pb: padding,
                    },
                }}
            >
                {children}
            </CardContent>
        </MuiCard>
    );
};

export default Card;