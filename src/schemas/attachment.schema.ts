/**
 * Attachment Validation Schemas
 * Frontend validation that mirrors backend FileValidationService rules
 * 
 * Backend validation rules (from application-dev.yml + FileValidationService):
 * - File size: ≤ 50MB (52428800 bytes)
 * - Allowed MIME types: images, PDFs, Word docs, Excel sheets, text files
 * - Filename: No path traversal, special chars, max 255 characters
 * - Hidden files: Not allowed (starts with dot)
 */

import { z } from 'zod';

// ============================================================================
// Constants (Match Backend Configuration)
// ============================================================================

/**
 * Maximum file size: 50 MB
 * Matches backend: app.file-upload.max-file-size=52428800
 */
export const MAX_FILE_SIZE = 52428800; // 50MB in bytes

/**
 * Maximum filename length
 * Matches backend: FileValidationService.MAX_FILENAME_LENGTH=255
 */
export const MAX_FILENAME_LENGTH = 255;

/**
 * Allowed MIME types (whitelist)
 * Matches backend: app.file-upload.allowed-mime-types
 */
export const ALLOWED_MIME_TYPES = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',

    // PDFs
    'application/pdf',

    // Word documents
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

    // Excel spreadsheets
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

    // Text files
    'text/plain',
    'text/csv',
] as const;

/**
 * File category groups for user-friendly messages
 */
export const FILE_CATEGORIES = {
    images: ['image/jpeg', 'image/png', 'image/gif'],
    documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    spreadsheets: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    text: ['text/plain', 'text/csv'],
} as const;

/**
 * File extensions mapped to MIME types (for display)
 */
export const FILE_EXTENSIONS = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
} as const;

// ============================================================================
// Validation Schema
// ============================================================================

/**
 * File Upload Schema
 * Validates File object before upload
 * 
 * Validation rules:
 * 1. File must exist (not null/undefined)
 * 2. File must not be empty (size > 0)
 * 3. File size ≤ 50MB
 * 4. MIME type in whitelist
 * 5. Filename not empty
 * 6. Filename ≤ 255 characters
 * 7. Filename not hidden (no leading dot)
 * 8. Filename has valid characters (basic check)
 * 
 * @example
 * const result = fileUploadSchema.safeParse({ file });
 * if (!result.success) {
 *   console.error(result.error.errors[0].message);
 * }
 */
export const fileUploadSchema = z.object({
    file: z
        .instanceof(File, { message: 'Please select a file to upload' })
        .refine(
            (file) => file.size > 0,
            { message: 'File cannot be empty' }
        )
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            {
                message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
            }
        )
        .refine(
            (file) => ALLOWED_MIME_TYPES.includes(file.type as any),
            {
                message: `File type not allowed. Allowed types: images (JPEG, PNG, GIF), PDFs, Word documents (.doc, .docx), Excel spreadsheets (.xls, .xlsx), text files (.txt, .csv)`,
            }
        )
        .refine(
            (file) => file.name && file.name.trim().length > 0,
            { message: 'Filename cannot be empty' }
        )
        .refine(
            (file) => file.name.length <= MAX_FILENAME_LENGTH,
            {
                message: `Filename must not exceed ${MAX_FILENAME_LENGTH} characters`,
            }
        )
        .refine(
            (file) => !file.name.startsWith('.'),
            { message: 'Hidden files (starting with dot) are not allowed' }
        )
        .refine(
            (file) => {
                // Basic check for invalid characters (more thorough check on backend)
                const invalidChars = /[<>:"|?*\x00-\x1F]/;
                return !invalidChars.test(file.name);
            },
            { message: 'Filename contains invalid characters' }
        ),
});

/**
 * Type inferred from schema
 */
export type FileUploadData = z.infer<typeof fileUploadSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format file size for display
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 * 
 * @example
 * formatFileSize(1536000) // "1.46 MB"
 * formatFileSize(2048) // "2.00 KB"
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get user-friendly file type description
 * 
 * @param mimeType - MIME type string
 * @returns Human-readable file type
 * 
 * @example
 * getFileTypeDescription('image/jpeg') // "JPEG Image"
 * getFileTypeDescription('application/pdf') // "PDF Document"
 */
export const getFileTypeDescription = (mimeType: string): string => {
    const typeMap: Record<string, string> = {
        'image/jpeg': 'JPEG Image',
        'image/png': 'PNG Image',
        'image/gif': 'GIF Image',
        'application/pdf': 'PDF Document',
        'application/msword': 'Word Document (.doc)',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (.docx)',
        'application/vnd.ms-excel': 'Excel Spreadsheet (.xls)',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet (.xlsx)',
        'text/plain': 'Text File',
        'text/csv': 'CSV File',
    };

    return typeMap[mimeType] || 'Unknown File Type';
};

/**
 * Check if file is an image
 * 
 * @param mimeType - MIME type string
 * @returns true if file is an image
 * 
 * @example
 * isImageFile('image/jpeg') // true
 * isImageFile('application/pdf') // false
 */
export const isImageFile = (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
};

/**
 * Get file extension from MIME type
 * 
 * @param mimeType - MIME type string
 * @returns File extension (e.g., ".jpg") or empty string
 * 
 * @example
 * getFileExtension('image/jpeg') // ".jpg"
 * getFileExtension('application/pdf') // ".pdf"
 */
export const getFileExtension = (mimeType: string): string => {
    const extensions = FILE_EXTENSIONS[mimeType as keyof typeof FILE_EXTENSIONS];
    return extensions ? extensions[0] : '';
};

/**
 * Get file category for grouping/filtering
 * 
 * @param mimeType - MIME type string
 * @returns Category name or 'other'
 * 
 * @example
 * getFileCategory('image/jpeg') // "images"
 * getFileCategory('application/pdf') // "documents"
 */
export const getFileCategory = (mimeType: string): string => {
    for (const [category, types] of Object.entries(FILE_CATEGORIES)) {
        if ((types as readonly string[]).includes(mimeType)) {
            return category;
        }
    }
    return 'other';
};

/**
 * Validate file client-side (sync validation)
 * Returns error message or null if valid
 * 
 * @param file - File object to validate
 * @returns Error message or null
 * 
 * @example
 * const error = validateFile(file);
 * if (error) {
 *   toast.error(error);
 * }
 */
export const validateFile = (file: File | null | undefined): string | null => {
    if (!file) {
        return 'Please select a file to upload';
    }

    const result = fileUploadSchema.safeParse({ file });

    if (!result.success) {
        // Return first error message
        return result.error.issues[0].message;
    }

    return null;
};

/**
 * Check if MIME type is allowed
 * 
 * @param mimeType - MIME type string
 * @returns true if allowed
 * 
 * @example
 * isAllowedMimeType('image/jpeg') // true
 * isAllowedMimeType('application/exe') // false
 */
export const isAllowedMimeType = (mimeType: string): boolean => {
    return ALLOWED_MIME_TYPES.includes(mimeType as any);
};