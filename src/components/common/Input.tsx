import {
    TextField,
    TextFieldProps,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { forwardRef, useState } from 'react';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
    /**
     * Input variant
     * @default 'outlined'
     */
    variant?: 'outlined' | 'filled' | 'standard';
    /**
     * Show password visibility toggle (only for password type)
     * @default true
     */
    showPasswordToggle?: boolean;
}

/**
 * Custom Input component wrapping MUI TextField with password toggle functionality
 * 
 * @example
 * <Input
 *   type="email"
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={!!errors.email}
 *   helperText={errors.email?.message}
 * />
 * 
 * @example
 * <Input
 *   type="password"
 *   label="Password"
 *   showPasswordToggle
 * />
 */
export const Input = forwardRef<HTMLDivElement, InputProps>(
    ({ type, showPasswordToggle = true, variant = 'outlined', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const isPasswordField = type === 'password';
        const inputType = isPasswordField && showPassword ? 'text' : type;

        const handleTogglePassword = () => {
            setShowPassword((prev) => !prev);
        };

        return (
            <TextField
                ref={ref}
                type={inputType}
                variant={variant}
                fullWidth
                {...props}
                InputProps={{
                    ...props.InputProps,
                    endAdornment: isPasswordField && showPasswordToggle ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePassword}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                                size="small"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ) : (
                        props.InputProps?.endAdornment
                    ),
                }}
            />
        );
    }
);

Input.displayName = 'Input';

export default Input;