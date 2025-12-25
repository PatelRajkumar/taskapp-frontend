/**
 * UserAutocomplete Component
 * Reusable autocomplete for selecting users with search
 */

import { useState, useCallback } from 'react';
import { Autocomplete, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { Avatar } from '@/components/profile';
import { searchUsers } from '@/interceptors/endpoints/user.api';
import type { UserResponse } from '@/interceptors/types/auth.types';

export interface UserAutocompleteProps {
  /**
   * Selected user ID
   */
  value: string;
  /**
   * Callback when user is selected
   */
  onChange: (userId: string) => void;
  /**
   * Label for the input
   */
  label: string;
  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;
  /**
   * Whether field is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Helper text / error message
   */
  helperText?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Filter function to exclude certain users
   * @example (user) => !existingMemberIds.includes(user.id)
   */
  filterUsers?: (user: UserResponse) => boolean;
}

/**
 * UserAutocomplete - Searchable user selection with avatars
 * 
 * Features:
 * - Real-time search (debounced 300ms)
 * - Shows avatar + name + email
 * - Supports filtering (e.g., exclude existing members)
 * - Loading states
 * - Error handling
 * 
 * @example Basic usage
 * <UserAutocomplete
 *   value={userId}
 *   onChange={setUserId}
 *   label="Select User"
 *   required
 * />
 * 
 * @example With filtering
 * <UserAutocomplete
 *   value={userId}
 *   onChange={setUserId}
 *   label="Add Member"
 *   filterUsers={(user) => !existingMemberIds.includes(user.id)}
 * />
 */
export const UserAutocomplete = ({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  error = false,
  helperText,
  placeholder = 'Search by name or email...',
  filterUsers,
}: UserAutocompleteProps) => {
  const [options, setOptions] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  console.log('[UserAutocomplete] Rendering with value:', value);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 2) {
        setOptions([]);
        return;
      }

      console.log('[UserAutocomplete] Searching users with term:', searchTerm);
      setLoading(true);

      try {
        const response = await searchUsers(searchTerm, { page: 0, size: 10 });
        let users = response.content;

        // Apply filter if provided
        if (filterUsers) {
          users = users.filter(filterUsers);
        }

        console.log('[UserAutocomplete] Found', users.length, 'users');
        setOptions(users);
      } catch (error) {
        console.error('[UserAutocomplete] Search failed:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [filterUsers]
  );

  // Handle input change (triggers search)
  const handleInputChange = (_: any, newInputValue: string) => {
    console.log('[UserAutocomplete] Input changed:', newInputValue);
    setInputValue(newInputValue);
    debouncedSearch(newInputValue);
  };

  // Handle user selection
  const handleChange = (_: any, newValue: UserResponse | null) => {
    console.log('[UserAutocomplete] User selected:', newValue?.name);
    setSelectedUser(newValue);
    onChange(newValue?.id || '');
  };

  return (
    <Autocomplete
      value={selectedUser}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar name={option.name} src={option.avatarUrl} size="small" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {option.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      noOptionsText={
        inputValue.length < 2
          ? 'Type at least 2 characters to search'
          : loading
          ? 'Searching...'
          : 'No users found'
      }
    />
  );
};

export default UserAutocomplete;