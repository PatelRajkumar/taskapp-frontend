import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useState } from 'react';

export interface AlertProps extends Omit<MuiAlertProps, 'onClose'> {
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert message
   */
  children: ReactNode;
  /**
   * Show close button
   * @default false
   */
  closable?: boolean;
  /**
   * Callback when alert is closed
   */
  onClose?: () => void;
  /**
   * Show alert (controlled)
   */
  open?: boolean;
}

/**
 * Custom Alert component wrapping MUI Alert with consistent styling
 * 
 * @example
 * <Alert severity="success" title="Success!">
 *   Your account has been created successfully.
 * </Alert>
 * 
 * @example
 * <Alert severity="error" closable onClose={handleClose}>
 *   Invalid email or password.
 * </Alert>
 * 
 * @example
 * <Alert severity="warning" title="Warning">
 *   Your session will expire in 5 minutes.
 * </Alert>
 */
export const Alert = ({
  title,
  children,
  closable = false,
  onClose,
  open: controlledOpen,
  ...props
}: AlertProps) => {
  const [internalOpen, setInternalOpen] = useState(true);

  // Use controlled open if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const closeButton = closable ? (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={handleClose}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  ) : undefined;

  return (
    <Collapse in={isOpen}>
      <MuiAlert
        {...props}
        action={closeButton}
        sx={{
          mb: 2,
          ...props.sx,
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </MuiAlert>
    </Collapse>
  );
};

export default Alert;