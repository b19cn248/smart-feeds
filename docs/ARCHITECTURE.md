# Smart Feeds - Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Security Architecture](#security-architecture)
- [Data Flow](#data-flow)
- [Deployment Architecture](#deployment-architecture)

## Overview

Smart Feeds is a modern web application for content aggregation and management, built with React and TypeScript. It allows users to organize RSS feeds, create content boards, collaborate in teams, and discover new content sources.

### Key Features
- 📰 RSS feed aggregation and management
- 📁 Folder-based source organization
- 📋 Personal and team boards for content curation
- 👥 Team collaboration with permission management
- 🔍 Content discovery and search
- 🔔 Real-time notifications
- 🌙 Dark/Light theme support

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React SPA)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   UI Layer  │  │ State Mgmt   │  │  Service Layer   │  │
│  │ Components  │  │  (Context)   │  │  (API Clients)   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layer                      │
│                         (Keycloak)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Bearer Token
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API (REST)                      │
│                 smart.feeds.api.openlearnhub.io.vn          │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

The frontend follows a component-based architecture with clear separation of concerns:

```
src/
├── components/          # UI Components
│   ├── common/         # Reusable components
│   └── features/       # Feature-specific components
├── contexts/           # React Context for state management
├── services/           # API communication layer
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── styles/             # Global styles and theme
```

## Technology Stack

### Frontend Technologies

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Core Framework** | React | 19.1.0 | UI library |
| **Language** | TypeScript | 4.9.5 | Type safety |
| **Routing** | React Router | 7.5.3 | SPA routing |
| **Styling** | Styled Components | 6.1.17 | CSS-in-JS |
| **UI Library** | Material-UI | 5.17.1 | Component library |
| **HTTP Client** | Axios | 1.9.0 | API communication |
| **Authentication** | Keycloak.js | 26.2.0 | SSO integration |
| **Build Tool** | Create React App | 5.0.1 | Build configuration |

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint (via CRA)
- **Testing**: Jest + React Testing Library
- **Containerization**: Docker + Docker Compose
- **Version Control**: Git

## Project Structure

### Directory Organization

```
smart-feeds/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   ├── Input/
│   │   │   └── ...
│   │   └── features/     # Feature-specific components
│   │       ├── article/
│   │       ├── board/
│   │       ├── folder/
│   │       ├── team/
│   │       └── ...
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── styles/           # Global styles and theme
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── App.tsx           # Root component
├── .env                  # Environment variables
├── package.json          # Dependencies
└── docker-compose.yml    # Docker configuration
```

### Component Architecture

Components are organized into three categories:

1. **Common Components**: Reusable UI building blocks
   - Button, Input, Modal, Card, Toast, etc.
   - No business logic, purely presentational
   - Highly configurable through props

2. **Feature Components**: Business-specific components
   - Article management (ArticleCard, ArticleDetail)
   - Board management (BoardCard, BoardForm)
   - Team collaboration (TeamBoard, TeamMemberList)
   - Source organization (FolderCard, SourcePicker)

3. **Page Components**: Route-level containers
   - Compose feature components
   - Handle route parameters
   - Manage page-level state

## Design Patterns

### 1. Context Pattern for State Management

The application uses React Context API for global state management:

```typescript
// Example: AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  // Authentication logic
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Service Layer Pattern

All API communication is abstracted into service modules:

```typescript
// Example: boardService.ts
export const boardService = {
  getBoards: (params) => apiClient.get('/boards', { params }),
  createBoard: (data) => apiClient.post('/boards', data),
  updateBoard: (id, data) => apiClient.put(`/boards/${id}`, data),
  deleteBoard: (id) => apiClient.delete(`/boards/${id}`)
};
```

### 3. Custom Hooks Pattern

Business logic is encapsulated in custom hooks:

```typescript
// Example: useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 4. Component Composition

Complex UI is built through component composition:

```typescript
<MainLayout>
  <Header />
  <Sidebar />
  <ContentArea>
    <RouterOutlet />
  </ContentArea>
</MainLayout>
```

## Security Architecture

### Authentication Flow

```
User Login Request
        │
        ▼
    Keycloak
        │
        ├─── Validate Credentials
        │
        ├─── Generate JWT Token
        │
        └─── Return Token
              │
              ▼
        Frontend Store Token
              │
              ▼
    API Requests with Bearer Token
              │
              ▼
        Backend Validates Token
```

### Security Features

1. **OAuth 2.0 / OpenID Connect**: Via Keycloak integration
2. **JWT Token Management**: Automatic refresh before expiry
3. **Protected Routes**: Authentication-based access control
4. **HTTPS**: All API communication encrypted
5. **CORS**: Configured for allowed origins
6. **XSS Protection**: DOMPurify for content sanitization
7. **Environment Variables**: Sensitive data kept in .env files

## Data Flow

### Unidirectional Data Flow

```
User Action → Component → Context/Hook → Service → API
                ↓                           ↓
            Local State                Response
                ↓                           ↓
            UI Update ← Context Update ← Process Data
```

### State Management Strategy

1. **Global State** (Context):
   - User authentication
   - Theme preferences
   - Notifications
   - Cached data (folders, teams)

2. **Local State** (useState):
   - Form inputs
   - UI toggles
   - Temporary data

3. **Server State**:
   - Fetched on demand
   - Cached in context when appropriate
   - Invalidated on mutations

## Deployment Architecture

### Development Environment

```yaml
# docker-compose.yml
services:
  smart-feeds:
    build: .
    ports:
      - "3007:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8888
      - CHOKIDAR_USEPOLLING=true
```

### Production Environment

1. **Frontend Hosting**: Static file hosting (CDN)
2. **API Endpoint**: https://smart.feeds.api.openlearnhub.io.vn
3. **Authentication**: Keycloak SSO server
4. **SSL/TLS**: HTTPS encryption
5. **Load Balancing**: API gateway level

### Environment Configuration

```bash
# Production
REACT_APP_API_URL=https://smart.feeds.api.openlearnhub.io.vn
REACT_APP_KEYCLOAK_URL=https://auth.openlearnhub.io.vn
REACT_APP_KEYCLOAK_REALM=OpenLearnHub
REACT_APP_KEYCLOAK_CLIENT_ID=news-frontend

# Development
REACT_APP_API_URL=http://localhost:8888
REACT_APP_ENABLE_DEBUG=true
```

## Performance Considerations

1. **Code Splitting**: Lazy loading for routes
2. **Memoization**: React.memo for expensive components
3. **Debouncing**: Search and API calls
4. **Pagination**: Server-side pagination for lists
5. **Caching**: Context-based caching for static data
6. **Image Optimization**: Lazy loading for article images

## Monitoring and Logging

1. **Web Vitals**: Performance metrics collection
2. **Error Boundaries**: Graceful error handling
3. **Console Logging**: Development environment debugging
4. **API Error Tracking**: Centralized error handling

## Future Considerations

1. **State Management**: Consider Redux/Zustand for complex state
2. **Testing**: Increase test coverage
3. **PWA**: Progressive Web App capabilities
4. **Internationalization**: Multi-language support
5. **Real-time Updates**: WebSocket integration
6. **Offline Support**: Service worker implementation