# Smart Feeds - Business Logic Documentation

## Table of Contents
- [Overview](#overview)
- [Domain Model](#domain-model)
- [Entity Relationships](#entity-relationships)
- [Business Rules](#business-rules)
- [Core Workflows](#core-workflows)
- [Data Processing](#data-processing)
- [Permission System](#permission-system)
- [Business Constraints](#business-constraints)

## Overview

Smart Feeds is a content aggregation and management platform that enables users to:
- Aggregate content from multiple RSS sources
- Organize sources into themed folders
- Create personal and collaborative content boards
- Share and collaborate on content within teams
- Discover and explore new content sources

## Domain Model

### Core Entities

#### 1. **Article**
The fundamental content unit in the system.

```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  author?: string;
  publish_date: string;
  image_url?: string;
  source: Source;
  hashtags: string[];
  view_count?: number;
}
```

**Business Rules:**
- Articles are immutable once fetched from sources
- Each article belongs to exactly one source
- Articles can be saved to multiple boards
- Article content is sanitized for security

#### 2. **Source**
Represents RSS feeds or content providers.

```typescript
interface Source {
  id: string;
  name: string;
  url: string;
  type: string;
  categories: Category[];
  language?: string;
  active: boolean;
  created_by?: string;
  created_at: string;
}
```

**Business Rules:**
- Sources must have valid RSS/Atom feed URLs
- Sources can belong to multiple categories
- Inactive sources stop fetching new articles
- Users can create custom sources

#### 3. **Folder**
Organizational unit for grouping sources by theme.

```typescript
interface Folder {
  id: string;
  name: string;
  theme: FolderTheme;
  sources: Source[];
  user_id: string;
  created_at: string;
  is_favorite?: boolean;
}

enum FolderTheme {
  TECH = 'tech',      // Blue theme
  SPORT = 'sport',    // Red theme
  NEWS = 'news',      // Green theme
  FINANCE = 'finance', // Yellow theme
  ENTERTAINMENT = 'entertainment', // Purple theme
  HEALTH = 'health'   // Pink theme
}
```

**Business Rules:**
- Each folder has a predefined theme with associated color
- Folders are user-specific (private)
- A source can belong to multiple folders
- Folders can be marked as favorites

#### 4. **Board**
Personal content collection for saving articles.

```typescript
interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  is_public: boolean;
  user_id: string;
  articles: BoardArticle[];
  created_at: string;
}

interface BoardArticle {
  article: Article;
  board_id: string;
  added_at: string;
  note?: string;
}
```

**Business Rules:**
- Boards are personal (user-specific)
- Articles can be added with optional notes
- Public boards can be shared via URL
- Articles can be added by ID or URL

#### 5. **Team**
Organizational unit for user collaboration.

```typescript
interface Team {
  id: string;
  name: string;
  description?: string;
  enterprise_id?: string;
  members: TeamMember[];
  created_at: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: string;
  joined_at: string;
}
```

**Business Rules:**
- Teams can be associated with enterprises
- Members have roles (admin, member)
- Team creators become admins by default

#### 6. **TeamBoard**
Collaborative content board for teams.

```typescript
interface TeamBoard {
  id: string;
  name: string;
  description?: string;
  team_id: string;
  articles: TeamBoardArticle[];
  members: TeamBoardMember[];
  created_at: string;
}

interface TeamBoardMember {
  user_id: string;
  permission: TeamBoardPermission;
}

enum TeamBoardPermission {
  ADMIN = 'ADMIN',  // Full control
  EDIT = 'EDIT',    // Can add/remove content
  VIEW = 'VIEW'     // Read-only access
}
```

**Business Rules:**
- Team boards belong to exactly one team
- Permission hierarchy: ADMIN > EDIT > VIEW
- Board creators get ADMIN permission
- Articles support notes, highlights, and discussions

#### 7. **Category**
Content classification system.

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  article_count?: number;
}
```

**Business Rules:**
- Categories are system-defined
- Sources can belong to multiple categories
- Used for content discovery and filtering

## Entity Relationships

### Entity Relationship Diagram

```
User
 ├─* Folder (1:N)
 │    └─* Source (N:N via FolderSource)
 ├─* Board (1:N)
 │    └─* Article (N:N via BoardArticle)
 ├─* Source (1:N - created sources)
 └─* Team (N:N via TeamMember)
      └─* TeamBoard (1:N)
           ├─* Article (N:N via TeamBoardArticle)
           ├─* Note (1:N)
           ├─* Highlight (1:N)
           └─* Member (N:N via TeamBoardMember)

Source
 ├─* Category (N:N)
 ├─* Article (1:N)
 └─* Folder (N:N via FolderSource)

Article
 ├── Source (N:1)
 ├─* Board (N:N via BoardArticle)
 ├─* TeamBoard (N:N via TeamBoardArticle)
 └─* Hashtag (1:N)
```

### Relationship Rules

1. **User-Folder**: One-to-many, user owns folders
2. **Folder-Source**: Many-to-many, sources can be in multiple folders
3. **Source-Article**: One-to-many, source produces articles
4. **Board-Article**: Many-to-many with metadata (notes)
5. **Team-TeamBoard**: One-to-many, team owns boards
6. **TeamBoard-Article**: Many-to-many with rich metadata

## Business Rules

### Content Management Rules

1. **Article Fetching**
   - Articles are fetched periodically from active sources
   - Duplicate articles (same URL) are not created
   - Article content is sanitized before storage
   - Published date determines article ordering

2. **Source Management**
   - Sources must provide valid RSS/Atom feeds
   - Inactive sources don't fetch new articles
   - Sources can be shared across users via folders
   - Source categories help with discovery

3. **Folder Organization**
   - Each folder has a theme-based color scheme
   - Folders can contain unlimited sources
   - Sources can belong to multiple folders
   - Folder articles are aggregated from all sources

4. **Board Curation**
   - Articles can be saved to multiple boards
   - Each save can include a personal note
   - Boards can be public or private
   - Articles can be added via URL (auto-fetch)

### Collaboration Rules

1. **Team Management**
   - Users can create and join multiple teams
   - Team creators become administrators
   - Teams can have enterprise associations
   - Members can be added/removed by admins

2. **Team Board Permissions**
   - **ADMIN**: Create, update, delete board; manage members
   - **EDIT**: Add/remove articles, create notes/highlights
   - **VIEW**: Read-only access to content
   - Permissions are board-specific, not team-wide

3. **Content Sharing**
   - Public boards have shareable URLs
   - Team boards are accessible to team members only
   - Articles can be shared between personal and team boards
   - Notes and highlights are board-specific

### Discovery Rules

1. **Category System**
   - Articles inherit categories from sources
   - Categories enable filtered browsing
   - Trending calculated by view count and recency
   - Discovery promotes diverse content

2. **Search and Filter**
   - Search covers title, content, and summary
   - Filters: category, date range, source
   - Hashtags enable topic-based discovery
   - Recent vs. all-time views for trending

## Core Workflows

### 1. Content Aggregation Workflow

```
1. User creates folder with theme
2. User adds sources to folder
3. System fetches articles from sources
4. Articles displayed in folder view
5. User can switch view modes (cards/magazine/list)
```

### 2. Content Curation Workflow

```
1. User browses articles (folder/discovery)
2. User clicks save to board
3. System shows board selection modal
4. User selects board and adds note (optional)
5. Article saved with metadata
6. User can view board collection
```

### 3. Team Collaboration Workflow

```
1. User creates team
2. User invites members
3. Team admin creates team board
4. Members add articles based on permissions
5. Members add notes/highlights
6. Team discusses content
7. Optional: Generate newsletter
```

### 4. Content Discovery Workflow

```
1. User visits discovery page
2. System shows:
   - Top stories
   - Trending articles
   - Category sections
   - Trending topics
3. User explores by category/topic
4. User can save interesting articles
5. User can follow new sources
```

## Data Processing

### Article Processing Pipeline

```
RSS Feed → Fetch → Parse → Sanitize → Deduplicate → Store → Index
                      ↓
                  Extract:
                  - Title
                  - Content
                  - Summary
                  - Metadata
                  - Hashtags
```

### Content Ranking Algorithm

1. **Recency Score**: Newer articles ranked higher
2. **Engagement Score**: Based on views, saves, shares
3. **Source Quality**: Established sources weighted higher
4. **Diversity Factor**: Prevents single-source dominance
5. **User Relevance**: Based on folders and reading history

### Newsletter Generation

```
1. Collect articles from team board
2. Apply filters (date range, categories)
3. Sort by relevance/engagement
4. Format content (title, summary, link)
5. Schedule delivery (immediate/daily/weekly/monthly)
6. Track opens and clicks
```

## Permission System

### Permission Matrix

| Action | Board Owner | Team Admin | Editor | Viewer |
|--------|-------------|------------|--------|--------|
| View content | ✓ | ✓ | ✓ | ✓ |
| Add articles | ✓ | ✓ | ✓ | ✗ |
| Remove articles | ✓ | ✓ | ✓ | ✗ |
| Add notes | ✓ | ✓ | ✓ | ✗ |
| Delete board | ✓ | ✓ | ✗ | ✗ |
| Manage members | ✓ | ✓ | ✗ | ✗ |
| Update settings | ✓ | ✓ | ✗ | ✗ |

### Access Control Rules

1. **Personal Content**: User has full control
2. **Team Content**: Permission-based access
3. **Public Content**: Read-only for non-owners
4. **System Content**: Admin-only management

## Business Constraints

### Technical Constraints

1. **Rate Limiting**
   - API calls limited per user/minute
   - RSS fetch frequency limited
   - Bulk operations have size limits

2. **Data Limits**
   - Maximum sources per folder
   - Maximum articles per board
   - Maximum members per team
   - Note/highlight length limits

3. **Performance Constraints**
   - Pagination for large datasets
   - Lazy loading for images
   - Cache TTL for static data
   - Background processing for feeds

### Business Policy Constraints

1. **Content Policy**
   - No duplicate articles in same board
   - Sanitized HTML content only
   - Valid RSS/Atom feeds required
   - Appropriate content guidelines

2. **Collaboration Policy**
   - Team boards require team membership
   - Permission changes affect immediately
   - Deleted teams archive boards
   - Member limits per team

3. **Data Retention**
   - Articles retained for defined period
   - User data deleted on account removal
   - Audit logs for sensitive actions
   - Backup and recovery policies

## Integration Points

### External Integrations

1. **RSS/Atom Feeds**: Content sources
2. **Keycloak**: Authentication/authorization
3. **Email Service**: Notifications/newsletters
4. **Analytics**: Usage tracking
5. **CDN**: Image/asset delivery

### Internal Integrations

1. **Search Service**: Full-text search
2. **Recommendation Engine**: Content suggestions
3. **Notification Service**: Real-time updates
4. **Export Service**: Data portability
5. **Audit Service**: Activity logging