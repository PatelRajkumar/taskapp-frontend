/**
 * Header Component
 * Application header with navigation and logout
 */

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, Dashboard, Assignment, Folder, Person } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/profile/Avatar';

export interface HeaderProps {
    /**
     * Optional title to display
     */
    title?: string;
}

/**
 * Header - Application navigation header
 * 
 * Features:
 * - Navigation links to main pages
 * - Active route highlighting
 * - Logout button
 * - Responsive design
 */
export const Header = ({ title = 'Task Management' }: HeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
        { label: 'Projects', path: '/projects', icon: <Folder /> },
        { label: 'Issues', path: '/issues', icon: <Assignment /> },
        { label: 'Profile', path: '/profile', icon: <Person /> },
    ];

    const isActive = (path: string) => {
        // For hierarchical routes (Projects, Issues), use startsWith to match detail pages
        if (path === '/projects' || path === '/issues') {
            return location.pathname.startsWith(path);
        }
        // For other routes, use exact match
        return location.pathname === path;
    };

    return (
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
            <Toolbar>
                {/* Title/Logo */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        cursor: 'pointer',
                        mr: 4,
                        color: 'primary.main',
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    {title}
                </Typography>

                {/* Navigation Links */}
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            startIcon={item.icon}
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive(item.path) ? 600 : 400,
                                borderBottom: isActive(item.path) ? 2 : 0,
                                borderColor: 'primary.main',
                                borderRadius: 0,
                                px: 2,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* User Info and Logout */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar name={user.name} size="small" />
                            <Typography variant="body2" color="text.secondary">
                                {user.name}
                            </Typography>
                        </Box>
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<LogoutOutlined />}
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
