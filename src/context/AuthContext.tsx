import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  clearAuthData,
} from '@/interceptors';
import type { LoginRequest, RegisterRequest, UserResponse } from '@/interceptors/types/auth.types';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Authentication context state
 */
interface AuthContextState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: UserResponse) => void;
  refreshUser: () => Promise<void>;
}

/**
 * Auth context with default values
 */
export const AuthContext = createContext<AuthContextState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  refreshUser: async () => {},
});

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state and provides auth operations
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  /**
   * Initialize authentication state on mount
   * Checks if user has valid tokens and fetches user data
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getStorageItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = getStorageItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
        const cachedUser = getStorageItem<UserResponse>(STORAGE_KEYS.USER);

        // No tokens, user is not authenticated
        if (!accessToken || !refreshToken) {
          setUser(null);
          return;
        }

        // Try to use cached user first for better UX
        if (cachedUser) {
          setUser(cachedUser);
        }

        // Validate tokens by fetching current user from backend
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setStorageItem(STORAGE_KEYS.USER, currentUser);
        } catch (error) {
          // Token validation failed, clear auth data
          console.error('Token validation failed:', error);
          clearAuthData();
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user with email and password
   */
  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await apiLogin(data);

        // Store tokens
        setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
        setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        setStorageItem(STORAGE_KEYS.USER, response.user);

        // Update state
        setUser(response.user);

        // Success notification
        toast.success(`Welcome back, ${response.user.name}!`);

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        // Error is already thrown from API with user-friendly message
        throw error;
      }
    },
    [navigate]
  );

  /**
   * Register new user account
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        await apiRegister(data);

        // Success notification
        toast.success('Account created successfully! Please check your email to verify your account.');

        // Navigate to login
        navigate('/login');
      } catch (error) {
        // Error is already thrown from API with user-friendly message
        throw error;
      }
    },
    [navigate]
  );

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    // Call backend logout endpoint (optional, best effort)
    apiLogout().catch((error) => {
      console.error('Logout API call failed:', error);
    });

    // Clear auth data
    clearAuthData();
    setUser(null);

    // Success notification
    toast.success('Logged out successfully');

    // Navigate to login
    navigate('/login');
  }, [navigate]);

  /**
   * Update user in state and storage
   * Used when user profile is updated
   */
  const updateUser = useCallback((updatedUser: UserResponse) => {
    setUser(updatedUser);
    setStorageItem(STORAGE_KEYS.USER, updatedUser);
  }, []);

  /**
   * Refresh user data from backend
   * Useful after profile updates or permission changes
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStorageItem(STORAGE_KEYS.USER, currentUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on refresh failure, user might still be authenticated
    }
  }, []);

  const value: AuthContextState = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};