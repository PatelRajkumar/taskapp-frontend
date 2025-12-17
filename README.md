# TaskApp Frontend

Modern, responsive frontend for TaskApp - a comprehensive project management system built with React, TypeScript, Material-UI, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Tailwind CSS v3
- **State Management**: TanStack Query (React Query) + React Context
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Rich Text Editor**: Tiptap
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080` (Spring Boot)

## 🛠️ Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Copy `.env` and adjust if needed
   - Default API URL: `http://localhost:8080/api`

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── api/                    # API integration layer
│   ├── client.ts           # Axios instance with interceptors
│   ├── endpoints/          # API endpoint functions
│   └── types/              # API request/response types
├── components/             # React components
│   ├── common/             # Reusable components
│   ├── layout/             # Layout components
│   ├── auth/               # Authentication components
│   ├── projects/           # Project-related components
│   ├── issues/             # Issue-related components
│   ├── comments/           # Comment components
│   └── attachments/        # Attachment components
├── pages/                  # Page components (routes)
│   ├── auth/               # Login, Register, etc.
│   ├── dashboard/          # Dashboard page
│   ├── projects/           # Project pages
│   ├── issues/             # Issue pages
│   ├── profile/            # Profile page
│   └── admin/              # Admin pages
├── hooks/                  # Custom React hooks
├── context/                # React Context providers
├── utils/                  # Utility functions
│   ├── constants.ts        # App constants & enums
│   ├── storage.ts          # LocalStorage helpers
│   ├── validation.ts       # Validation schemas
│   └── formatters.ts       # Data formatting utilities
├── routes/                 # Route definitions
├── theme/                  # MUI theme configuration
└── types/                  # TypeScript type definitions
```

## 🔐 Authentication

- JWT-based authentication with access & refresh tokens
- Tokens stored in localStorage
- Automatic token refresh on 401 responses
- Protected routes with role-based access control

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1976d2)
- **Secondary**: Pink (#dc004e)
- **Success**: Green (#4caf50)
- **Warning**: Orange (#ff9800)
- **Error**: Red (#f44336)

### Typography
- Font Family: Roboto
- Base Font Size: 16px
- Spacing: 8px base unit

### Components
- Material-UI components with custom theme
- Tailwind utility classes for layout
- Consistent 8px border radius

## 📦 Building for Production

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Output**: `dist/` folder contains optimized production build

3. **Integration with Spring Boot**:
   ```bash
   # Copy build to Spring Boot static folder
   cp -r dist/* ../backend/src/main/resources/static/
   ```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080/api)
- `VITE_APP_NAME` - Application name
- `VITE_ENABLE_NOTIFICATIONS` - Enable in-app notifications
- `VITE_NOTIFICATION_POLL_INTERVAL` - Notification polling interval (ms)

### Vite Proxy

Development server proxies API requests to backend:
- `/api/*` → `http://localhost:8080/api/*`

## 🧪 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Follow React best practices
- Use functional components with hooks

### State Management
- **Server State**: TanStack Query (caching, refetching)
- **Auth State**: React Context
- **Form State**: React Hook Form
- **UI State**: Component state

### API Integration
- All API calls through centralized endpoints
- Type-safe request/response with TypeScript
- Error handling via interceptors
- Loading & error states with React Query

## 🤝 Contributing

1. Follow existing code structure
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test thoroughly before committing

## 📝 License

Private project - All rights reserved

## 🆘 Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Change port in vite.config.ts or use different port
npm run dev -- --port 3000
```

**API connection issues**:
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API_BASE_URL in .env

**Build errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions, contact the development team.