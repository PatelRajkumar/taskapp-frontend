/**
 * AttachmentFileIcon Component
 * Displays appropriate icon based on file MIME type
 */

import {
    InsertDriveFile,
    Image,
    PictureAsPdf,
    Description,
    GridOn,
    TextSnippet,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

export interface AttachmentFileIconProps extends SvgIconProps {
    /**
     * MIME type of the file
     */
    mimeType: string;
}

/**
 * AttachmentFileIcon - Returns appropriate icon for file type
 * 
 * Icon mapping:
 * - Images (jpeg, png, gif) → ImageOutlined
 * - PDF → PictureAsPdfOutlined
 * - Word docs → DescriptionOutlined
 * - Excel sheets → GridOnOutlined
 * - Text files → TextSnippetOutlined
 * - Default → InsertDriveFileOutlined
 * 
 * @example
 * <AttachmentFileIcon mimeType="image/jpeg" fontSize="large" />
 * <AttachmentFileIcon mimeType="application/pdf" color="error" />
 */
export const AttachmentFileIcon = ({ mimeType, ...props }: AttachmentFileIconProps) => {
    // Images
    if (mimeType.startsWith('image/')) {
        return <Image {...props} />;
    }

    // PDF
    if (mimeType === 'application/pdf') {
        return <PictureAsPdf {...props} />;
    }

    // Word documents
    if (
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return <Description {...props} />;
    }

    // Excel spreadsheets
    if (
        mimeType === 'application/vnd.ms-excel' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        return <GridOn {...props} />;
    }

    // Text files
    if (mimeType.startsWith('text/')) {
        return <TextSnippet {...props} />;
    }

    // Default
    return <InsertDriveFile {...props} />;
};

export default AttachmentFileIcon;