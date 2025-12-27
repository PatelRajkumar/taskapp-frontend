/**
 * RichTextDisplay Component
 * Safely displays rich text HTML content using DOMPurify
 */

import { Box } from '@mui/material';
import DOMPurify from 'dompurify';

export interface RichTextDisplayProps {
  /**
   * HTML content to display
   */
  content: string;
  /**
   * Custom styles
   */
  sx?: any;
}

/**
 * RichTextDisplay - Safely render HTML content
 * 
 * Features:
 * - Sanitizes HTML using DOMPurify
 * - Styled to match editor output
 * - Prevents XSS attacks
 * 
 * @example
 * <RichTextDisplay content={issue.description} />
 */
export const RichTextDisplay = ({ content, sx }: RichTextDisplayProps) => {
  // Sanitize HTML to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      sx={{
        '& p': {
          my: 0.5,
        },
        '& h1': {
          fontSize: '2em',
          fontWeight: 700,
          mt: 1.5,
          mb: 0.5,
        },
        '& h2': {
          fontSize: '1.5em',
          fontWeight: 700,
          mt: 1.5,
          mb: 0.5,
        },
        '& h3': {
          fontSize: '1.25em',
          fontWeight: 600,
          mt: 1.5,
          mb: 0.5,
        },
        '& h4': {
          fontSize: '1.1em',
          fontWeight: 600,
          mt: 1,
          mb: 0.5,
        },
        '& ul, & ol': {
          pl: 3,
          my: 1,
        },
        '& li': {
          my: 0.25,
        },
        '& code': {
          bgcolor: 'action.hover',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          fontSize: '0.875em',
          fontFamily: 'monospace',
        },
        '& pre': {
          bgcolor: 'action.hover',
          p: 1.5,
          borderRadius: 1,
          overflow: 'auto',
          my: 1,
          '& code': {
            bgcolor: 'transparent',
            p: 0,
          },
        },
        '& blockquote': {
          borderLeft: 4,
          borderColor: 'divider',
          pl: 2,
          my: 1,
          fontStyle: 'italic',
          color: 'text.secondary',
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'none',
          },
        },
        '& strong': {
          fontWeight: 700,
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& u': {
          textDecoration: 'underline',
        },
        '& s, & del': {
          textDecoration: 'line-through',
        },
        ...sx,
      }}
    />
  );
};

export default RichTextDisplay;