/**
 * Application-wide constants
 * These should match the backend enums and configurations
 */

// Issue Status (matches backend IssueStatus enum)
export const ISSUE_STATUS = {
  TODO: 'TODO',
  INPROGRESS: 'INPROGRESS',
  DONE: 'DONE',
} as const;

export type IssueStatus = typeof ISSUE_STATUS[keyof typeof ISSUE_STATUS];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  TODO: 'To Do',
  INPROGRESS: 'In Progress',
  DONE: 'Done',
};

export const ISSUE_STATUS_COLORS: Record<IssueStatus, string> = {
  TODO: '#2196f3', // Blue
  INPROGRESS: '#ff9800', // Orange
  DONE: '#4caf50', // Green
};

// Issue Priority (matches backend IssuePriority enum)
export const ISSUE_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type IssuePriority = typeof ISSUE_PRIORITY[keyof typeof ISSUE_PRIORITY];

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const ISSUE_PRIORITY_COLORS: Record<IssuePriority, string> = {
  LOW: '#4caf50', // Green
  MEDIUM: '#ff9800', // Orange
  HIGH: '#f44336', // Red
};

export const ISSUE_PRIORITY_LEVELS: Record<IssuePriority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Issue Type (matches backend IssueType enum)
export const ISSUE_TYPE = {
  TASK: 'TASK',
  BUG: 'BUG',
} as const;

export type IssueType = typeof ISSUE_TYPE[keyof typeof ISSUE_TYPE];

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  TASK: 'Task',
  BUG: 'Bug',
};

export const ISSUE_TYPE_COLORS: Record<IssueType, string> = {
  TASK: '#2196f3', // Blue
  BUG: '#f44336', // Red
};

// Project Visibility (matches backend ProjectVisibility enum)
export const PROJECT_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
} as const;

export type ProjectVisibility = typeof PROJECT_VISIBILITY[keyof typeof PROJECT_VISIBILITY];

export const PROJECT_VISIBILITY_LABELS: Record<ProjectVisibility, string> = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
};

// Project Roles (matches backend ProjectRole enum)
export const PROJECT_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
} as const;

export type ProjectRole = typeof PROJECT_ROLE[keyof typeof PROJECT_ROLE];

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
};

export const PROJECT_ROLE_COLORS: Record<ProjectRole, string> = {
  OWNER: '#9c27b0', // Purple
  ADMIN: '#2196f3', // Blue
  MEMBER: '#4caf50', // Green
  VIEWER: '#9e9e9e', // Grey
};

export const PROJECT_ROLE_LEVELS: Record<ProjectRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

// System Roles (matches backend system roles)
export const SYSTEM_ROLE = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

export type SystemRole = typeof SYSTEM_ROLE[keyof typeof SYSTEM_ROLE];

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LAST_NOTIFICATION_CHECK: 'lastNotificationCheck',
  NOTIFICATION_READ_IDS: 'notificationReadIds',
  THEME_MODE: 'themeMode',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_SORT_ORDER: 'desc' as const,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB in bytes
  MAX_SIZE_LABEL: '50MB',
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ARCHIVES: ['application/zip', 'application/x-rar-compressed'],
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy', // Jan 01, 2024
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm', // Jan 01, 2024 14:30
  API: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // ISO format
  RELATIVE_THRESHOLD: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 1,
} as const;

// Notification Polling
export const NOTIFICATION_CONFIG = {
  POLL_INTERVAL: 30000, // 30 seconds
  MAX_NOTIFICATIONS: 50,
} as const;

// Validation Rules (matching backend constraints)
export const VALIDATION_RULES = {
  PROJECT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 5000,
  },
  ISSUE: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 500,
    DESCRIPTION_MAX_LENGTH: 10000,
  },
  COMMENT: {
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 5000,
  },
  USER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 255,
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 100,
  },
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  NOTIFICATION_DURATION: 5000, // 5 seconds
} as const;