# Smart Feeds - UI Components Guide

## Table of Contents
- [Overview](#overview)
- [Design System](#design-system)
- [Common Components](#common-components)
- [Feature Components](#feature-components)
- [Layout Components](#layout-components)
- [Component Hierarchy](#component-hierarchy)
- [Usage Guidelines](#usage-guidelines)
- [Styling Conventions](#styling-conventions)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

## Overview

Smart Feeds uses a component-based architecture with a clear separation between reusable UI components and feature-specific components. The design system ensures consistency across the application while maintaining flexibility for customization.

### Component Categories

1. **Common Components**: Reusable UI building blocks
2. **Feature Components**: Business-specific components
3. **Layout Components**: Application structure components
4. **Page Components**: Route-level containers

## Design System

### Color Palette

#### Primary Colors
```typescript
const colors = {
  primary: '#2E7CF6',        // Blue - Primary brand color
  secondary: '#6B7280',      // Gray - Secondary actions
  success: '#10B981',        // Green - Success states
  warning: '#FBBF24',        // Yellow - Warning states
  error: '#F43F5E',          // Red - Error states
  info: '#3B82F6',           // Blue - Info states
}
```

#### Gray Scale
```typescript
const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
}
```

#### Theme Colors (Folder Themes)
```typescript
const themeColors = {
  tech: '#2E7CF6',           // Blue
  sport: '#F43F5E',          // Red
  news: '#10B981',           // Green
  finance: '#FBBF24',        // Yellow
  entertainment: '#8B5CF6',   // Purple
  health: '#EC4899',         // Pink
}
```

### Typography

```typescript
const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
}
```

### Spacing

```typescript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}
```

### Border Radius

```typescript
const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%',
}
```

### Breakpoints

```typescript
const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
}
```

## Common Components

### Button

A versatile button component with multiple variants and states.

**Location**: `src/components/common/Button/Button.tsx`

#### Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}
```

#### Usage
```typescript
import { Button } from '../components/common/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Article
</Button>

// Button with icon
<Button variant="secondary" icon={<PlusIcon />} iconPosition="left">
  Add Source
</Button>

// Loading state
<Button variant="primary" loading>
  Saving...
</Button>

// Disabled state
<Button variant="primary" disabled>
  Cannot Save
</Button>
```

#### Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| `primary` | Main actions | Save, Create, Submit |
| `secondary` | Secondary actions | Cancel, Edit |
| `ghost` | Subtle actions | View More, Settings |
| `danger` | Destructive actions | Delete, Remove |

### Input

Form input component with validation and icon support.

**Location**: `src/components/common/Input/Input.tsx`

#### Props
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
```

#### Usage
```typescript
import { Input } from '../components/common/Input';

<Input
  label="Article Title"
  placeholder="Enter article title"
  value={title}
  onChange={setTitle}
  error={titleError}
  required
/>

// With icon
<Input
  placeholder="Search articles..."
  icon={<SearchIcon />}
  iconPosition="left"
  value={searchTerm}
  onChange={setSearchTerm}
/>
```

### Modal

Overlay modal component for dialogs and forms.

**Location**: `src/components/common/Modal/Modal.tsx`

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}
```

#### Usage
```typescript
import { Modal } from '../components/common/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Create New Board"
  size="md"
>
  <BoardForm onSubmit={handleCreateBoard} />
</Modal>

// With custom footer
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Confirm Delete"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

### Card

Container component for content sections.

**Location**: `src/components/common/Card/Card.tsx`

#### Props
```typescript
interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
}
```

#### Usage
```typescript
import { Card } from '../components/common/Card';

<Card padding="lg" shadow="md" hover>
  <h3>Article Title</h3>
  <p>Article summary...</p>
</Card>

// Clickable card
<Card onClick={() => navigate('/article/123')} hover>
  <ArticleContent />
</Card>
```

### Toast

Notification component for user feedback.

**Location**: `src/components/common/Toast/Toast.tsx`

#### Usage
```typescript
import { useToast } from '../contexts/ToastContext';

const { showToast } = useToast();

// Success toast
showToast('Article saved successfully!', 'success');

// Error toast
showToast('Failed to save article', 'error');

// Info toast
showToast('New articles available', 'info');

// Warning toast
showToast('Please verify your changes', 'warning');
```

### LoadingScreen

Full-screen loading indicator.

**Location**: `src/components/common/LoadingScreen/LoadingScreen.tsx`

#### Usage
```typescript
import { LoadingScreen } from '../components/common/LoadingScreen';

if (loading) {
  return <LoadingScreen />;
}
```

## Feature Components

### Article Components

#### ArticleCard

Displays article preview with image, title, and metadata.

**Location**: `src/components/features/article/ArticleCard/ArticleCard.tsx`

```typescript
interface ArticleCardProps {
  article: Article;
  viewMode?: 'card' | 'magazine' | 'title-only';
  onSave?: (article: Article) => void;
  onShare?: (article: Article) => void;
  showActions?: boolean;
}

<ArticleCard
  article={article}
  viewMode="card"
  onSave={handleSaveArticle}
  showActions={true}
/>
```

#### ArticleDetail

Full article view with content and actions.

**Location**: `src/components/features/article/ArticleDetail/ArticleDetail.tsx`

```typescript
interface ArticleDetailProps {
  articleId: string;
  onClose?: () => void;
  showSaveButton?: boolean;
}

<ArticleDetail
  articleId="123"
  onClose={() => setShowDetail(false)}
  showSaveButton={true}
/>
```

#### ViewModes

Different article display modes.

**Locations**:
- `src/components/features/article/ViewModes/CardsView.tsx`
- `src/components/features/article/ViewModes/MagazineView.tsx`
- `src/components/features/article/ViewModes/TitleOnlyView.tsx`

```typescript
// Cards View
<CardsView articles={articles} onArticleClick={handleArticleClick} />

// Magazine View
<MagazineView articles={articles} onArticleClick={handleArticleClick} />

// Title Only View
<TitleOnlyView articles={articles} onArticleClick={handleArticleClick} />
```

### Board Components

#### BoardCard

Displays board information with article count.

**Location**: `src/components/features/board/BoardCard/BoardCard.tsx`

```typescript
interface BoardCardProps {
  board: Board;
  onClick?: (board: Board) => void;
  onEdit?: (board: Board) => void;
  onDelete?: (board: Board) => void;
  showActions?: boolean;
}

<BoardCard
  board={board}
  onClick={handleBoardClick}
  onEdit={handleEditBoard}
  onDelete={handleDeleteBoard}
  showActions={true}
/>
```

#### BoardForm

Form for creating and editing boards.

**Location**: `src/components/features/board/BoardForm/BoardForm.tsx`

```typescript
interface BoardFormProps {
  board?: Board;
  onSubmit: (data: BoardFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

<BoardForm
  board={editingBoard}
  onSubmit={handleSubmitBoard}
  onCancel={() => setShowForm(false)}
  loading={isSubmitting}
/>
```

### Folder Components

#### FolderCard

Displays folder with theme color and source count.

**Location**: `src/components/features/folder/FolderCard/FolderCard.tsx`

```typescript
interface FolderCardProps {
  folder: Folder;
  onClick?: (folder: Folder) => void;
  onEdit?: (folder: Folder) => void;
  onDelete?: (folder: Folder) => void;
  showActions?: boolean;
}

<FolderCard
  folder={folder}
  onClick={handleFolderClick}
  onEdit={handleEditFolder}
  showActions={true}
/>
```

#### SourcePicker

Multi-select component for choosing sources.

**Location**: `src/components/features/folder/SourcePicker/SourcePicker.tsx`

```typescript
interface SourcePickerProps {
  selectedSources: Source[];
  onSourcesChange: (sources: Source[]) => void;
  availableSources: Source[];
  loading?: boolean;
}

<SourcePicker
  selectedSources={selectedSources}
  onSourcesChange={setSelectedSources}
  availableSources={availableSources}
/>
```

### Team Components

#### TeamCard

Displays team information and member count.

**Location**: `src/components/features/team/TeamCard/TeamCard.tsx`

```typescript
interface TeamCardProps {
  team: Team;
  onClick?: (team: Team) => void;
  currentUserRole?: string;
  showActions?: boolean;
}

<TeamCard
  team={team}
  onClick={handleTeamClick}
  currentUserRole="admin"
  showActions={true}
/>
```

#### TeamMemberList

Lists team members with roles and actions.

**Location**: `src/components/features/team/TeamMemberList/TeamMemberList.tsx`

```typescript
interface TeamMemberListProps {
  members: TeamMember[];
  currentUserRole: string;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: string) => void;
}

<TeamMemberList
  members={teamMembers}
  currentUserRole="admin"
  onRemoveMember={handleRemoveMember}
  onUpdateRole={handleUpdateRole}
/>
```

## Layout Components

### MainLayout

Primary application layout with header, sidebar, and content area.

**Location**: `src/components/features/layout/MainLayout/MainLayout.tsx`

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  showPadding?: boolean;
}

<MainLayout showPadding={true}>
  <PageContent />
</MainLayout>
```

### Header

Application header with navigation and user controls.

**Location**: `src/components/features/layout/Header/Header.tsx`

```typescript
interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

<Header
  onMenuToggle={handleMenuToggle}
  showMenuButton={true}
/>
```

### Sidebar

Navigation sidebar with menu items and user profile.

**Location**: `src/components/features/layout/Sidebar/Sidebar.tsx`

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

<Sidebar
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
/>
```

## Component Hierarchy

### Application Structure

```
App
├── ThemeProvider
├── ToastProvider
├── AuthProvider
├── Other Context Providers
└── BrowserRouter
    └── Routes
        └── Route
            └── MainLayout
                ├── Header
                ├── Sidebar
                └── Page Component
                    ├── Feature Components
                    ├── Common Components
                    └── Content
```

### Component Composition Pattern

```typescript
// Page Level
<ArticlesPage>
  <PageHeader>
    <ViewSelector />
    <SearchInput />
  </PageHeader>
  <PageContent>
    <ArticleList>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </ArticleList>
  </PageContent>
</ArticlesPage>

// Feature Level
<ArticleCard>
  <Card>
    <ArticleImage />
    <ArticleContent>
      <ArticleTitle />
      <ArticleSummary />
      <ArticleMetadata />
    </ArticleContent>
    <ArticleActions>
      <Button>Save</Button>
      <Button>Share</Button>
    </ArticleActions>
  </Card>
</ArticleCard>
```

## Usage Guidelines

### Component Selection

1. **Start with Common Components**
   - Use Button for all clickable actions
   - Use Input for form fields
   - Use Card for content containers
   - Use Modal for overlays

2. **Compose Feature Components**
   - Combine common components for business logic
   - Follow established patterns
   - Maintain consistency with existing components

3. **Custom Components**
   - Only create when existing components don't meet needs
   - Follow naming conventions
   - Document props and usage

### Props Best Practices

1. **Keep Props Simple**
   ```typescript
   // ✅ Good
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     onClick: () => void;
     children: React.ReactNode;
   }
   
   // ❌ Bad - too many props
   interface ButtonProps {
     primaryColor: string;
     secondaryColor: string;
     hoverColor: string;
     // ... too many styling props
   }
   ```

2. **Use Composition Over Configuration**
   ```typescript
   // ✅ Good - composition
   <Modal>
     <ModalHeader>Title</ModalHeader>
     <ModalBody>Content</ModalBody>
     <ModalFooter>Actions</ModalFooter>
   </Modal>
   
   // ❌ Bad - configuration
   <Modal
     title="Title"
     content="Content"
     actions={[]}
     showHeader={true}
     showFooter={true}
   />
   ```

3. **Default Props**
   ```typescript
   const Button: React.FC<ButtonProps> = ({
     variant = 'primary',
     size = 'md',
     disabled = false,
     ...props
   }) => {
     // Component implementation
   };
   ```

## Styling Conventions

### Styled Components

1. **Component-Level Styles**
   ```typescript
   const Container = styled.div`
     display: flex;
     flex-direction: column;
     padding: ${({ theme }) => theme.spacing.lg};
     background: ${({ theme }) => theme.colors.background.primary};
   `;
   
   const Title = styled.h2`
     color: ${({ theme }) => theme.colors.text.primary};
     font-size: ${({ theme }) => theme.typography.fontSize.xl};
     margin-bottom: ${({ theme }) => theme.spacing.md};
   `;
   ```

2. **Theme Usage**
   ```typescript
   // Always use theme values
   const Button = styled.button<{ variant: string }>`
     background: ${({ theme, variant }) => 
       variant === 'primary' ? theme.colors.primary : theme.colors.secondary
     };
     padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
     border-radius: ${({ theme }) => theme.borderRadius.md};
     font-size: ${({ theme }) => theme.typography.fontSize.md};
   `;
   ```

3. **Responsive Styles**
   ```typescript
   const ResponsiveContainer = styled.div`
     display: grid;
     grid-template-columns: 1fr;
     gap: ${({ theme }) => theme.spacing.md};
     
     @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
       grid-template-columns: repeat(2, 1fr);
     }
     
     @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
       grid-template-columns: repeat(3, 1fr);
     }
   `;
   ```

### CSS-in-JS Best Practices

1. **Organize Styles**
   ```typescript
   // Group related styles
   const CardStyles = {
     Container: styled.div`
       /* container styles */
     `,
     Header: styled.header`
       /* header styles */
     `,
     Content: styled.div`
       /* content styles */
     `,
     Footer: styled.footer`
       /* footer styles */
     `,
   };
   ```

2. **Conditional Styles**
   ```typescript
   const Button = styled.button<{ variant: string; disabled: boolean }>`
     background: ${({ theme, variant, disabled }) => {
       if (disabled) return theme.colors.gray[300];
       return variant === 'primary' ? theme.colors.primary : theme.colors.secondary;
     }};
     
     cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
     opacity: ${({ disabled }) => disabled ? 0.6 : 1};
   `;
   ```

## Responsive Design

### Breakpoint Strategy

1. **Mobile First**
   ```typescript
   const Container = styled.div`
     /* Mobile styles (default) */
     padding: ${({ theme }) => theme.spacing.sm};
     
     /* Tablet and up */
     @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
       padding: ${({ theme }) => theme.spacing.lg};
     }
     
     /* Desktop and up */
     @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
       padding: ${({ theme }) => theme.spacing.xl};
     }
   `;
   ```

2. **Grid Layouts**
   ```typescript
   const ArticleGrid = styled.div`
     display: grid;
     gap: ${({ theme }) => theme.spacing.md};
     
     /* Mobile: 1 column */
     grid-template-columns: 1fr;
     
     /* Tablet: 2 columns */
     @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
       grid-template-columns: repeat(2, 1fr);
     }
     
     /* Desktop: 3 columns */
     @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
       grid-template-columns: repeat(3, 1fr);
     }
   `;
   ```

3. **Responsive Typography**
   ```typescript
   const ResponsiveHeading = styled.h1`
     font-size: ${({ theme }) => theme.typography.fontSize.xl};
     
     @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
       font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
     }
     
     @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
       font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
     }
   `;
   ```

### Component Responsiveness

1. **Sidebar Behavior**
   - Mobile: Overlay sidebar (drawer)
   - Desktop: Fixed sidebar (persistent)

2. **Navigation**
   - Mobile: Hamburger menu
   - Desktop: Full navigation

3. **Article Views**
   - Mobile: Single column
   - Tablet: Two columns
   - Desktop: Three columns

## Accessibility

### ARIA Support

1. **Semantic HTML**
   ```typescript
   const Button = styled.button.attrs(({ disabled }) => ({
     'aria-disabled': disabled,
     role: 'button',
   }))`
     /* styles */
   `;
   ```

2. **Focus Management**
   ```typescript
   const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
     const modalRef = useRef<HTMLDivElement>(null);
     
     useEffect(() => {
       if (isOpen && modalRef.current) {
         modalRef.current.focus();
       }
     }, [isOpen]);
     
     return (
       <ModalOverlay>
         <ModalContent
           ref={modalRef}
           tabIndex={-1}
           role="dialog"
           aria-modal="true"
         >
           {children}
         </ModalContent>
       </ModalOverlay>
     );
   };
   ```

3. **Keyboard Navigation**
   ```typescript
   const useKeyPress = (targetKey: string, callback: () => void) => {
     useEffect(() => {
       const handleKeyPress = (event: KeyboardEvent) => {
         if (event.key === targetKey) {
           callback();
         }
       };
       
       window.addEventListener('keydown', handleKeyPress);
       return () => window.removeEventListener('keydown', handleKeyPress);
     }, [targetKey, callback]);
   };
   ```

### Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG guidelines
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] ARIA attributes are used appropriately
- [ ] Screen reader compatibility is tested

## Performance Considerations

### Component Optimization

1. **React.memo**
   ```typescript
   const ArticleCard = React.memo<ArticleCardProps>(({ article, onSave }) => {
     return (
       <Card>
         {/* Component content */}
       </Card>
     );
   });
   ```

2. **useCallback**
   ```typescript
   const ArticleList: React.FC = ({ articles }) => {
     const handleSaveArticle = useCallback((article: Article) => {
       // Save logic
     }, []);
     
     return (
       <div>
         {articles.map(article => (
           <ArticleCard
             key={article.id}
             article={article}
             onSave={handleSaveArticle}
           />
         ))}
       </div>
     );
   };
   ```

3. **Lazy Loading**
   ```typescript
   const LazyArticleDetail = React.lazy(() => import('./ArticleDetail'));
   
   <Suspense fallback={<LoadingScreen />}>
     <LazyArticleDetail articleId={articleId} />
   </Suspense>
   ```

### Bundle Optimization

1. **Code Splitting**
   ```typescript
   // Route-level splitting
   const ArticlesPage = lazy(() => import('../pages/ArticlesPage'));
   const BoardsPage = lazy(() => import('../pages/BoardsPage'));
   ```

2. **Dynamic Imports**
   ```typescript
   const handleExport = async () => {
     const { exportToCSV } = await import('../utils/exportUtils');
     exportToCSV(data);
   };
   ```

This comprehensive UI Components Guide provides developers with everything they need to understand, use, and extend the Smart Feeds component system effectively.