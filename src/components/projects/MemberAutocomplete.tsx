/**
 * MemberAutocomplete Component
 * Autocomplete for selecting from existing project members
 */

import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { Avatar } from '@/components/profile';
import type { ProjectMemberSummary } from '@/interceptors/types/projectMember.types';

export interface MemberAutocompleteProps {
  /**
   * List of members to choose from
   */
  members: ProjectMemberSummary[];
  /**
   * Selected member ID
   */
  value: string;
  /**
   * Callback when member is selected
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
   * Filter function to exclude certain members
   * @example (member) => member.role !== 'VIEWER'
   */
  filterMembers?: (member: ProjectMemberSummary) => boolean;
}

/**
 * MemberAutocomplete - Select from existing project members
 * 
 * Features:
 * - Shows avatar + name + email + role
 * - Supports filtering by role
 * - No API calls (uses provided members list)
 * 
 * @example
 * <MemberAutocomplete
 *   members={projectMembers}
 *   value={selectedUserId}
 *   onChange={setSelectedUserId}
 *   label="Transfer Ownership To"
 *   filterMembers={(member) => member.role !== 'VIEWER'}
 * />
 */
export const MemberAutocomplete = ({
  members,
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  error = false,
  helperText,
  placeholder = 'Select a member...',
  filterMembers,
}: MemberAutocompleteProps) => {
  console.log('[MemberAutocomplete] Rendering with', members.length, 'members');

  // Apply filter if provided
  const filteredMembers = filterMembers ? members.filter(filterMembers) : members;

  // Find selected member
  const selectedMember = filteredMembers.find((m) => m.user.id === value) || null;

  const handleChange = (_: any, newValue: ProjectMemberSummary | null) => {
    console.log('[MemberAutocomplete] Member selected:', newValue?.user.name);
    onChange(newValue?.user.id || '');
  };

  return (
    <Autocomplete
      value={selectedMember}
      onChange={handleChange}
      options={filteredMembers}
      disabled={disabled}
      getOptionLabel={(option) => option.user.name}
      isOptionEqualToValue={(option, value) => option.user.id === value.user.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.user.id}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar name={option.user.name} src={option.user.avatarUrl} size="small" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" noWrap>
                  {option.user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 0.5,
                    fontSize: '0.7rem',
                  }}
                >
                  {option.roleDisplayName}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      noOptionsText="No members available"
    />
  );
};

export default MemberAutocomplete;