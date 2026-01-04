/**
 * AttachmentUpload Component
 * Single file upload zone with drag-and-drop, validation, and progress
 */

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Alert,
} from '@mui/material';
import {
    CloudUpload,
    AttachFile,
} from '@mui/icons-material';
import { Button } from '@/components/common';
import { validateFile, ALLOWED_MIME_TYPES } from '@/schemas/attachment.schema';

export interface AttachmentUploadProps {
    /**
     * Issue ID to upload to
     */
    issueId: string;
    /**
     * Callback when file is selected and validated
     */
    onFileSelect: (file: File) => void;
    /**
     * Whether upload is in progress
     */
    isUploading?: boolean;
    /**
     * Upload progress (0-100)
     */
    uploadProgress?: number;
    /**
     * Whether to disable upload
     */
    disabled?: boolean;
}

/**
 * AttachmentUpload - File upload zone
 * 
 * Features:
 * - Drag-and-drop support
 * - Click to browse fallback
 * - Client-side validation (size, type)
 * - Upload progress bar
 * - Visual feedback for drag state
 * - Accepted file types display
 * 
 * Note: Backend supports SINGLE file upload only
 * 
 * @example
 * const [uploadProgress, setUploadProgress] = useState(0);
 * 
 * const { mutate: upload, isPending } = useUploadAttachment(issueId, {
 *   onProgress: (percent) => setUploadProgress(percent),
 * });
 * 
 * <AttachmentUpload
 *   issueId={issueId}
 *   onFileSelect={(file) => upload(file)}
 *   isUploading={isPending}
 *   uploadProgress={uploadProgress}
 * />
 */
export const AttachmentUpload = ({
    issueId,
    onFileSelect,
    isUploading = false,
    uploadProgress = 0,
    disabled = false,
}: AttachmentUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log('[AttachmentUpload] Rendering for issue:', issueId, {
        isUploading,
        uploadProgress,
        disabled,
    });

    const handleFileValidation = (file: File): boolean => {
        console.log('[AttachmentUpload] Validating file:', file.name, file.type, file.size);

        const error = validateFile(file);
        if (error) {
            console.error('[AttachmentUpload] Validation failed:', error);
            setValidationError(error);
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && handleFileValidation(file)) {
            console.log('[AttachmentUpload] File selected via input:', file.name);
            onFileSelect(file);
        }

        // Reset input to allow re-selecting same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
        console.log('[AttachmentUpload] Drag enter');
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        console.log('[AttachmentUpload] Drag leave');
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const file = event.dataTransfer.files[0]; // Only take first file

        if (file) {
            console.log('[AttachmentUpload] File dropped:', file.name);

            if (handleFileValidation(file)) {
                onFileSelect(file);
            }
        }
    };

    const handleClick = () => {
        if (!disabled && !isUploading) {
            console.log('[AttachmentUpload] Opening file picker');
            fileInputRef.current?.click();
        }
    };

    const isDisabled = disabled || isUploading;

    return (
        <Box>
            {/* Drop Zone */}
            <Box
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragging
                        ? 'primary.main'
                        : isDisabled
                            ? 'action.disabled'
                            : 'divider',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: isDragging ? 'action.hover' : 'background.default',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isDisabled ? 0.6 : 1,
                    '&:hover': {
                        borderColor: isDisabled ? 'action.disabled' : 'primary.main',
                        bgcolor: isDisabled ? 'background.default' : 'action.hover',
                    },
                }}
            >
                {/* Upload Icon */}
                <CloudUpload
                    sx={{
                        fontSize: 48,
                        color: isDragging ? 'primary.main' : 'action.active',
                        mb: 2,
                    }}
                />

                {/* Upload Text */}
                <Typography variant="body1" gutterBottom>
                    {isUploading
                        ? 'Uploading...'
                        : isDragging
                            ? 'Drop file here'
                            : 'Drag and drop a file here, or click to browse'}
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block">
                    Max 50MB · Images, PDFs, Word, Excel, Text files
                </Typography>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept={ALLOWED_MIME_TYPES.join(',')}
                    style={{ display: 'none' }}
                    disabled={isDisabled}
                />
            </Box>

            {/* Upload Progress */}
            {isUploading && (
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Uploading...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {uploadProgress}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>
            )}

            {/* Validation Error */}
            {validationError && !isUploading && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setValidationError(null)}>
                    {validationError}
                </Alert>
            )}
        </Box>
    );
};

export default AttachmentUpload;