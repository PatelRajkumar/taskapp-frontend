import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';

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
}

/**
 * Custom Button component wrapping MUI Button with consistent styling
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @example
 * <Button variant="outlined" loading={isLoading}>
 *   Submit
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