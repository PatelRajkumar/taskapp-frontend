/**
 * RichTextEditor Component
 * Rich text editor using Tiptap for formatted text input
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Box, IconButton, Divider, Paper, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatQuote,
  Undo,
  Redo,
  Link as LinkIcon,
  LinkOff,
} from '@mui/icons-material';
import { useCallback } from 'react';

export interface RichTextEditorProps {
  /**
   * HTML content value
   */
  value: string;
  /**
   * Callback when content changes
   */
  onChange: (html: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether editor is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show error state
   */
  error?: boolean;
  /**
   * Minimum height of editor
   * @default 200
   */
  minHeight?: number;
}

/**
 * RichTextEditor - Tiptap-based rich text editor
 * 
 * Features:
 * - Bold, italic, underline, strikethrough
 * - Headings (H1-H6)
 * - Bullet and numbered lists
 * - Code blocks and inline code
 * - Blockquotes
 * - Links
 * - Undo/Redo
 * 
 * @example
 * <RichTextEditor
 *   value={description}
 *   onChange={setDescription}
 *   placeholder="Describe the issue..."
 *   error={!!errors.description}
 * />
 */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  error = false,
  minHeight = 200,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-link',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        style: `min-height: ${minHeight}px; padding: 12px;`,
      },
    },
  });

  // Update editor content when value changes externally
  if (editor && value !== editor.getHTML()) {
    editor.commands.setContent(value);
  }

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: error ? 'error.main' : 'divider',
        '&:focus-within': {
          borderColor: error ? 'error.main' : 'primary.main',
          borderWidth: 2,
        },
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Text Formatting */}
        <Tooltip title="Bold (Ctrl+B)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
            sx={{
              bgcolor: editor.isActive('bold') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic (Ctrl+I)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
            sx={{
              bgcolor: editor.isActive('italic') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline (Ctrl+U)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('underline') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run() || disabled}
            sx={{
              bgcolor: editor.isActive('strike') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatStrikethrough fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Lists */}
        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('bulletList') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatListBulleted fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('orderedList') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatListNumbered fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Code & Blockquote */}
        <Tooltip title="Code Block">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('codeBlock') ? 'action.selected' : 'transparent',
            }}
          >
            <Code fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Blockquote">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('blockquote') ? 'action.selected' : 'transparent',
            }}
          >
            <FormatQuote fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Links */}
        <Tooltip title="Add Link">
          <IconButton
            size="small"
            onClick={setLink}
            disabled={disabled}
            sx={{
              bgcolor: editor.isActive('link') ? 'action.selected' : 'transparent',
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remove Link">
          <IconButton
            size="small"
            onClick={removeLink}
            disabled={!editor.isActive('link') || disabled}
          >
            <LinkOff fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Undo/Redo */}
        <Tooltip title="Undo (Ctrl+Z)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run() || disabled}
          >
            <Undo fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo (Ctrl+Y)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run() || disabled}
          >
            <Redo fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          '& .ProseMirror': {
            minHeight: `${minHeight}px`,
            p: 1.5,
            '&:focus': {
              outline: 'none',
            },
            '& p.is-editor-empty:first-of-type::before': {
              content: `"${placeholder}"`,
              color: 'text.secondary',
              pointerEvents: 'none',
              height: 0,
              float: 'left',
            },
            '& h1': {
              fontSize: '2em',
              fontWeight: 700,
              mt: 1,
              mb: 0.5,
            },
            '& h2': {
              fontSize: '1.5em',
              fontWeight: 700,
              mt: 1,
              mb: 0.5,
            },
            '& h3': {
              fontSize: '1.25em',
              fontWeight: 600,
              mt: 1,
              mb: 0.5,
            },
            '& ul, & ol': {
              pl: 2,
              my: 1,
            },
            '& code': {
              bgcolor: 'action.hover',
              px: 0.5,
              py: 0.25,
              borderRadius: 1,
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
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RichTextEditor;