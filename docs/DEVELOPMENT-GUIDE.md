# Smart Feeds - Development Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [State Management](#state-management)
- [Component Development](#component-development)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| npm | 8.x or higher | Package manager |
| Git | Latest | Version control |
| Docker | Latest (optional) | Containerization |
| VSCode | Latest (recommended) | IDE |

### Recommended VSCode Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript React code snippets** - React snippets
- **Auto Rename Tag** - HTML/JSX tag renaming
- **GitLens** - Git integration
- **Thunder Client** - API testing

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/smart-feeds.git
cd smart-feeds
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env` file in project root:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8888
REACT_APP_API_VERSION=v1

# Keycloak Configuration
REACT_APP_KEYCLOAK_URL=https://auth.openlearnhub.io.vn
REACT_APP_KEYCLOAK_REALM=OpenLearnHub
REACT_APP_KEYCLOAK_CLIENT_ID=news-frontend

# Feature Flags
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_ANALYTICS=false

# Other Configuration
REACT_APP_DEFAULT_LANGUAGE=en
REACT_APP_ITEMS_PER_PAGE=20
```

### 4. Start Development Server

```bash
npm start
```

Application will be available at `http://localhost:3007`

### 5. Docker Setup (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down
```

## Project Structure

### Directory Layout

```
smart-feeds/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Reusable components
│   │   └── features/     # Feature components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities
│   ├── config/           # Configuration
│   ├── App.tsx           # Root component
│   └── index.tsx         # Entry point
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md            # Project readme
```

### Key Directories Explained

- **components/common**: Reusable UI components (Button, Modal, Input)
- **components/features**: Business logic components (ArticleCard, BoardForm)
- **contexts**: Global state management (AuthContext, ThemeContext)
- **hooks**: Custom React hooks (useDebounce, useLocalStorage)
- **pages**: Route-level components (ArticlesPage, BoardsPage)
- **services**: API communication layer
- **types**: TypeScript interfaces and types
- **utils**: Helper functions and utilities

## Development Workflow

### 1. Feature Development Flow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Develop feature
# - Write code
# - Add tests
# - Update documentation

# 3. Run tests
npm test

# 4. Commit changes
git add .
git commit -m "feat: add your feature description"

# 5. Push branch
git push origin feature/your-feature-name

# 6. Create pull request
```

### 2. Component Development Process

1. **Plan Component**
   - Define props interface
   - Identify state requirements
   - Plan component hierarchy

2. **Create Component Structure**
   ```typescript
   // components/features/YourFeature/YourComponent.tsx
   import React from 'react';
   import styled from 'styled-components';

   interface YourComponentProps {
     // Define props
   }

   export const YourComponent: React.FC<YourComponentProps> = (props) => {
     // Component logic
     return <Container>...</Container>;
   };

   const Container = styled.div`
     // Styles
   `;
   ```

3. **Export Component**
   ```typescript
   // components/features/YourFeature/index.ts
   export { YourComponent } from './YourComponent';
   ```

### 3. Adding New Features

1. **Create Type Definitions**
   ```typescript
   // types/yourFeature.types.ts
   export interface YourFeature {
     id: string;
     name: string;
     // ... other properties
   }
   ```

2. **Create Service Layer**
   ```typescript
   // services/yourFeatureService.ts
   import { apiClient } from './apiClient';
   
   export const yourFeatureService = {
     getAll: (params?: any) => apiClient.get('/your-feature', { params }),
     getById: (id: string) => apiClient.get(`/your-feature/${id}`),
     create: (data: any) => apiClient.post('/your-feature', data),
     update: (id: string, data: any) => apiClient.put(`/your-feature/${id}`, data),
     delete: (id: string) => apiClient.delete(`/your-feature/${id}`)
   };
   ```

3. **Create Context (if needed)**
   ```typescript
   // contexts/YourFeatureContext/YourFeatureContext.tsx
   const YourFeatureContext = createContext<YourFeatureContextType | null>(null);
   ```

4. **Create Page Component**
   ```typescript
   // pages/YourFeaturePage/YourFeaturePage.tsx
   export const YourFeaturePage: React.FC = () => {
     // Page logic
   };
   ```

## Coding Standards

### TypeScript Guidelines

1. **Use Explicit Types**
   ```typescript
   // ✅ Good
   const count: number = 0;
   const name: string = 'Smart Feeds';
   
   // ❌ Bad
   const count = 0;
   const name = 'Smart Feeds';
   ```

2. **Interface Naming**
   ```typescript
   // ✅ Good
   interface UserProfile {
     id: string;
     name: string;
   }
   
   // ❌ Bad
   interface IUserProfile {  // Don't use 'I' prefix
     id: string;
     name: string;
   }
   ```

3. **Type vs Interface**
   ```typescript
   // Use interface for objects
   interface User {
     id: string;
     name: string;
   }
   
   // Use type for unions, aliases
   type Status = 'pending' | 'active' | 'inactive';
   type ID = string | number;
   ```

### React Best Practices

1. **Functional Components**
   ```typescript
   // Always use functional components
   export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
     return <div>{prop1}</div>;
   };
   ```

2. **Hooks Usage**
   ```typescript
   // Custom hooks start with 'use'
   export const useCustomHook = () => {
     const [state, setState] = useState();
     // Hook logic
     return { state, setState };
   };
   ```

3. **Event Handlers**
   ```typescript
   // Name handlers with 'handle' prefix
   const handleClick = (event: React.MouseEvent) => {
     // Handler logic
   };
   ```

### Styling Guidelines

1. **Styled Components**
   ```typescript
   // Use semantic names
   const Container = styled.div`
     padding: ${({ theme }) => theme.spacing.md};
   `;
   
   const Title = styled.h1`
     color: ${({ theme }) => theme.colors.primary};
   `;
   ```

2. **Theme Usage**
   ```typescript
   // Always use theme values
   const Button = styled.button`
     background: ${({ theme }) => theme.colors.primary};
     padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
     border-radius: ${({ theme }) => theme.borderRadius.md};
   `;
   ```

### File Naming Conventions

- **Components**: PascalCase (e.g., `ArticleCard.tsx`)
- **Utilities**: camelCase (e.g., `dateUtils.ts`)
- **Types**: camelCase with `.types.ts` (e.g., `article.types.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `articleService.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDebounce.ts`)

## State Management

### Context API Pattern

1. **Create Context**
   ```typescript
   // contexts/ExampleContext/ExampleContext.tsx
   interface ExampleContextType {
     data: any[];
     loading: boolean;
     error: Error | null;
     fetchData: () => Promise<void>;
   }
   
   const ExampleContext = createContext<ExampleContextType | null>(null);
   ```

2. **Create Provider**
   ```typescript
   export const ExampleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [data, setData] = useState<any[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);
     
     const fetchData = async () => {
       setLoading(true);
       try {
         const response = await exampleService.getAll();
         setData(response.data);
       } catch (err) {
         setError(err as Error);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <ExampleContext.Provider value={{ data, loading, error, fetchData }}>
         {children}
       </ExampleContext.Provider>
     );
   };
   ```

3. **Create Hook**
   ```typescript
   // contexts/ExampleContext/useExample.ts
   export const useExample = () => {
     const context = useContext(ExampleContext);
     if (!context) {
       throw new Error('useExample must be used within ExampleProvider');
     }
     return context;
   };
   ```

### State Management Best Practices

1. **Separate Concerns**
   - UI state in components (modals, toggles)
   - Business data in contexts
   - Form state in form libraries or local state

2. **Avoid Over-Nesting**
   - Don't nest contexts unnecessarily
   - Use composition over nesting

3. **Performance Optimization**
   - Split contexts by domain
   - Use useMemo for expensive computations
   - Use useCallback for stable references

## Component Development

### Component Structure Template

```typescript
// components/features/Example/ExampleComponent.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../../contexts/ToastContext';
import { exampleService } from '../../../services';
import type { ExampleType } from '../../../types';

interface ExampleComponentProps {
  id: string;
  onUpdate?: (data: ExampleType) => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({ 
  id, 
  onUpdate 
}) => {
  const [data, setData] = useState<ExampleType | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await exampleService.getById(id);
      setData(response.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState />;

  return (
    <Container>
      <Title>{data.name}</Title>
      {/* Component content */}
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingState = styled.div`
  /* Loading styles */
`;

const EmptyState = styled.div`
  /* Empty state styles */
`;
```

### Common Patterns

1. **Loading States**
   ```typescript
   if (loading) {
     return <LoadingScreen />;
   }
   ```

2. **Error Handling**
   ```typescript
   if (error) {
     return <ErrorMessage message={error.message} />;
   }
   ```

3. **Empty States**
   ```typescript
   if (!data || data.length === 0) {
     return <EmptyState message="No items found" />;
   }
   ```

4. **Conditional Rendering**
   ```typescript
   return (
     <Container>
       {showHeader && <Header />}
       <Content>
         {items.map(item => (
           <Item key={item.id} {...item} />
         ))}
       </Content>
       {hasMore && <LoadMoreButton onClick={loadMore} />}
     </Container>
   );
   ```

## API Integration

### Using the API Client

1. **Basic Usage**
   ```typescript
   import { apiClient } from '../services/apiClient';
   
   // GET request
   const response = await apiClient.get('/articles');
   
   // POST request
   const newArticle = await apiClient.post('/articles', {
     title: 'New Article',
     content: 'Content here'
   });
   
   // PUT request
   const updated = await apiClient.put(`/articles/${id}`, updateData);
   
   // DELETE request
   await apiClient.delete(`/articles/${id}`);
   ```

2. **With Parameters**
   ```typescript
   const response = await apiClient.get('/articles', {
     params: {
       page: 0,
       size: 20,
       sort: 'createdAt,desc'
     }
   });
   ```

3. **Error Handling**
   ```typescript
   try {
     const response = await apiClient.get('/articles');
     // Handle success
   } catch (error) {
     if (error.response?.status === 404) {
       // Handle not found
     } else {
       // Handle other errors
     }
   }
   ```

### Service Layer Pattern

```typescript
// services/articleService.ts
export const articleService = {
  // Get paginated articles
  getArticles: (params?: ArticleParams) => 
    apiClient.get<PaginatedResponse<Article>>('/articles', { params }),
  
  // Get single article
  getArticle: (id: string) => 
    apiClient.get<Article>(`/articles/${id}`),
  
  // Create article
  createArticle: (data: CreateArticleDto) => 
    apiClient.post<Article>('/articles', data),
  
  // Update article
  updateArticle: (id: string, data: UpdateArticleDto) => 
    apiClient.put<Article>(`/articles/${id}`, data),
  
  // Delete article
  deleteArticle: (id: string) => 
    apiClient.delete(`/articles/${id}`),
  
  // Custom endpoint
  trackView: (id: string) => 
    apiClient.post(`/articles/${id}/track-view`)
};
```

## Testing

### Unit Testing

1. **Component Testing**
   ```typescript
   // ExampleComponent.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { ExampleComponent } from './ExampleComponent';
   
   describe('ExampleComponent', () => {
     it('renders correctly', () => {
       render(<ExampleComponent title="Test" />);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
     
     it('handles click events', () => {
       const handleClick = jest.fn();
       render(<ExampleComponent onClick={handleClick} />);
       fireEvent.click(screen.getByRole('button'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```

2. **Hook Testing**
   ```typescript
   // useExample.test.ts
   import { renderHook, act } from '@testing-library/react-hooks';
   import { useExample } from './useExample';
   
   describe('useExample', () => {
     it('returns initial state', () => {
       const { result } = renderHook(() => useExample());
       expect(result.current.value).toBe(0);
     });
   });
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test ExampleComponent.test.tsx
```

## Build & Deployment

### Development Build

```bash
# Start development server
npm start

# Build for development
npm run build
```

### Production Build

```bash
# Create production build
npm run build

# Analyze bundle size
npm run build -- --stats
```

### Build Output

```
build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
├── manifest.json
└── robots.txt
```

### Deployment Checklist

1. **Pre-deployment**
   - [ ] Run tests: `npm test`
   - [ ] Check TypeScript: `npx tsc --noEmit`
   - [ ] Update environment variables
   - [ ] Update version in package.json

2. **Build**
   - [ ] Create production build: `npm run build`
   - [ ] Test build locally: `npx serve -s build`
   - [ ] Check bundle size

3. **Deploy**
   - [ ] Upload to hosting service
   - [ ] Verify environment variables
   - [ ] Test deployed application
   - [ ] Monitor for errors

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **Module not found**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   
   # Update TypeScript definitions
   npm install --save-dev @types/react @types/node
   ```

3. **Build failures**
   ```bash
   # Clear build cache
   rm -rf build
   
   # Check for circular dependencies
   npx madge --circular src
   ```

4. **API connection issues**
   - Check `.env` file configuration
   - Verify API URL is correct
   - Check CORS settings
   - Verify authentication token

### Debug Mode

Enable debug mode in `.env`:
```bash
REACT_APP_ENABLE_DEBUG=true
```

This enables:
- Console logging
- Redux DevTools (if using Redux)
- React Developer Tools
- Network request logging

### Performance Profiling

1. **React DevTools Profiler**
   - Install React Developer Tools
   - Use Profiler tab to identify slow components

2. **Chrome DevTools**
   - Performance tab for runtime analysis
   - Network tab for API performance
   - Lighthouse for overall performance audit

### Getting Help

1. **Documentation**
   - Check project README
   - Review code comments
   - Read API documentation

2. **Team Resources**
   - Slack channel: #smart-feeds-dev
   - Wiki: internal-wiki/smart-feeds
   - Issue tracker: github.com/org/smart-feeds/issues

3. **External Resources**
   - React documentation
   - TypeScript handbook
   - Stack Overflow