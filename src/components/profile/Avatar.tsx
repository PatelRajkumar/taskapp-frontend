import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';

export interface AvatarProps extends Omit<MuiAvatarProps, 'children'> {
  /**
   * User's name to generate initials from
   */
  name: string;
  /**
   * Optional avatar URL
   */
  src?: string;
  /**
   * Avatar size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

/**
 * Get initials from name
 * Examples:
 * - "John Doe" → "JD"
 * - "Alice" → "A"
 * - "Bob Smith Jr" → "BS"
 */
const getInitials = (name: string): string => {
  if (!name || !name.trim()) return '?';
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  // Take first letter of first and last word
  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

/**
 * Generate consistent color from string
 * Same name always generates same color
 */
const stringToColor = (string: string): string => {
  let hash = 0;
  
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pleasant pastel colors
  const h = hash % 360;
  const s = 65; // 65% saturation for nice colors
  const l = 55; // 55% lightness for good contrast
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Get size in pixels
 */
const getSizeValue = (size?: 'small' | 'medium' | 'large' | 'xlarge'): number => {
  switch (size) {
    case 'small':
      return 32;
    case 'medium':
      return 40;
    case 'large':
      return 56;
    case 'xlarge':
      return 80;
    default:
      return 40;
  }
};

/**
 * Avatar Component
 * Shows avatar image or name initials with consistent color
 * 
 * @example Basic usage with initials
 * <Avatar name="John Doe" />
 * 
 * @example With avatar image
 * <Avatar name="Alice Smith" src="https://example.com/avatar.jpg" />
 * 
 * @example Different sizes
 * <Avatar name="Bob" size="small" />
 * <Avatar name="Carol" size="large" />
 */
export const Avatar = ({ name, src, size = 'medium', sx, ...props }: AvatarProps) => {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);
  const sizeValue = getSizeValue(size);
  
  return (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: sizeValue,
        height: sizeValue,
        backgroundColor: src ? 'transparent' : backgroundColor,
        color: '#fff',
        fontWeight: 600,
        fontSize: sizeValue * 0.4, // 40% of size
        ...sx,
      }}
      {...props}
    >
      {initials}
    </MuiAvatar>
  );
};

export default Avatar;