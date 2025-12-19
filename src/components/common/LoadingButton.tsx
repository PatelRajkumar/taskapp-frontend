import { Button, ButtonProps } from './Button';
import { forwardRef } from 'react';

export interface LoadingButtonProps extends ButtonProps {
    /**
     * Show loading spinner
     * @default false
     */
    loading?: boolean;
}

/**
 * LoadingButton component - wrapper around Button with loading state
 * This is a convenience component for form submissions
 * 
 * @example
 * <LoadingButton
 *   variant="primary"
 *   loading={isSubmitting}
 *   onClick={handleSubmit}
 * >
 *   Submit
 * </LoadingButton>
 * 
 * @example
 * <LoadingButton
 *   variant="outlined"
 *   loading={isLoading}
 *   fullWidth
 * >
 *   Save
 * </LoadingButton>
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    (props, ref) => {
        return <Button ref={ref} {...props} />;
    }
);

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;