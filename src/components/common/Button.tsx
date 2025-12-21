import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { forwardRef, ElementType } from 'react';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
    /**
     * Button variant
     * @default 'contained'
     */
    variant?: 'primary' | 'secondary' | 'outlined' | 'text';
    /**
     * Show loading spinner
     * @default false
     */
    loading?: boolean;
    /**
     * Full width button
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Component to render as (e.g., Link from react-router-dom)
     */
    component?: ElementType;
    /**
     * Additional props for the component (e.g., 'to' for Link)
     */
    [key: string]: any;
}

/**
 * Custom Button component wrapping MUI Button with consistent styling
 * Supports React Router Link component via 'component' prop
 * 
 * @example Basic usage
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @example With loading state
 * <Button variant="outlined" loading={isLoading}>
 *   Submit
 * </Button>
 * 
 * @example With React Router Link
 * import { Link } from 'react-router-dom';
 * 
 * <Button component={Link} to="/dashboard" variant="primary">
 *   Go to Dashboard
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', loading = false, disabled, children, fullWidth = false, ...props }, ref) => {
        // Map custom variants to MUI variants and colors
        const getMuiProps = () => {
            switch (variant) {
                case 'primary':
                    return { variant: 'contained' as const, color: 'primary' as const };
                case 'secondary':
                    return { variant: 'contained' as const, color: 'secondary' as const };
                case 'outlined':
                    return { variant: 'outlined' as const, color: 'primary' as const };
                case 'text':
                    return { variant: 'text' as const, color: 'primary' as const };
                default:
                    return { variant: 'contained' as const, color: 'primary' as const };
            }
        };

        const muiProps = getMuiProps();

        return (
            <MuiButton
                ref={ref}
                {...muiProps}
                disabled={disabled || loading}
                fullWidth={fullWidth}
                {...props}
                sx={{
                    position: 'relative',
                    ...props.sx,
                }}
            >
                {loading && (
                    <CircularProgress
                        size={20}
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-10px',
                            color: variant === 'outlined' || variant === 'text' ? 'primary.main' : 'inherit',
                        }}
                    />
                )}
                <span style={{ visibility: loading ? 'hidden' : 'visible' }}>{children}</span>
            </MuiButton>
        );
    }
);

Button.displayName = 'Button';

export default Button;