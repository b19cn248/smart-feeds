# Smart Feeds - API Documentation

## Table of Contents
- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [Authentication](#authentication)
- [Common Patterns](#common-patterns)
- [API Endpoints](#api-endpoints)
  - [Articles](#articles)
  - [Boards](#boards)
  - [Categories](#categories)
  - [Explore](#explore)
  - [Folders](#folders)
  - [Sources](#sources)
  - [Teams](#teams)
  - [Team Boards](#team-boards)
  - [Top Stories](#top-stories)
  - [Notifications](#notifications)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

The Smart Feeds API is a RESTful service that provides endpoints for content aggregation, organization, and collaboration. All endpoints follow REST conventions and return JSON responses.

## Base Configuration

### API Base URLs

| Environment | Base URL |
|-------------|----------|
| Production | `https://smart.feeds.api.openlearnhub.io.vn/api/v1` |
| Development | `http://localhost:8888/api/v1` |

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer {access_token}
Accept: application/json
```

## Authentication

Smart Feeds uses Keycloak for authentication with JWT tokens.

### Authentication Flow

1. User authenticates with Keycloak
2. Keycloak returns access token
3. Include token in Authorization header
4. Token auto-refreshes when near expiry

### Token Management

```javascript
// Token included automatically via apiClient
const response = await apiClient.get('/boards');

// Manual token refresh handled internally
// Tokens refresh when expiring within 30 seconds
```

## Common Patterns

### Pagination

Most list endpoints support pagination:

```http
GET /endpoint?page=0&size=20&sort=createdAt,desc
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 0 | Page number (0-based) |
| size | number | 20 | Items per page |
| sort | string | - | Sort field and direction |

### Response Format

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## API Endpoints

### Articles

#### Get Articles List
```http
GET /articles?page={page}&size={size}
```

**Query Parameters:**
- `page` (number): Page number (default: 0)
- `size` (number): Page size (default: 20)

**Response:**
```json
{
  "data": {
    "content": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "summary": "string",
        "url": "string",
        "author": "string",
        "publish_date": "2024-01-01T00:00:00Z",
        "image_url": "string",
        "source": {
          "id": "string",
          "name": "string"
        },
        "hashtags": ["string"]
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20
  }
}
```

#### Get Article by ID
```http
GET /articles/{id}
```

**Response:** Single article object

### Boards

#### Get Boards List
```http
GET /boards?page={page}&size={size}&sort={sort}
```

**Query Parameters:**
- `page` (number): Page number
- `size` (number): Page size
- `sort` (string): Sort criteria (e.g., "createdAt,desc")

**Response:**
```json
{
  "data": {
    "content": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "color": "#hex",
        "icon": "string",
        "is_public": false,
        "article_count": 0,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Get Board Details
```http
GET /boards/{id}
```

**Response:** Board with articles

#### Create Board
```http
POST /boards
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "color": "#hex",
  "icon": "string",
  "is_public": false
}
```

#### Update Board
```http
PUT /boards/{id}
```

**Request Body:** Same as create

#### Delete Board
```http
DELETE /boards/{id}
```

#### Add Article to Board
```http
POST /boards/{boardId}/articles
```

**Request Body:**
```json
{
  "article_id": "string",
  "note": "string (optional)"
}
```

#### Add Article from URL
```http
POST /boards/{boardId}/articles/url
```

**Request Body:**
```json
{
  "url": "string",
  "note": "string (optional)"
}
```

#### Remove Article from Board
```http
DELETE /boards/{boardId}/articles/{articleId}
```

### Categories

#### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "article_count": 0
    }
  ]
}
```

#### Get Articles by Category
```http
GET /categories/{categoryId}/articles?page={page}&size={size}
```

### Explore

#### Get Explore Collections
```http
GET /explore/collections?page={page}&size={size}
```

#### Get Collection Articles
```http
GET /explore/collections/{collectionId}/articles?page={page}&size={size}
```

#### Get Recent Articles
```http
GET /explore/recent?page={page}&size={size}
```

#### Search Articles
```http
GET /explore/search?keyword={keyword}&page={page}&size={size}
```

**Query Parameters:**
- `keyword` (string): Search term
- `page` (number): Page number
- `size` (number): Page size

#### Get Explore Page Data
```http
GET /explore?collection_size={size}&articles_per_collection={count}&top_stories_size={size}&trending_topics_size={size}
```

### Folders

#### Get Folders List
```http
GET /folders?page={page}&size={size}
```

**Response:**
```json
{
  "data": {
    "content": [
      {
        "id": "string",
        "name": "string",
        "theme": "tech|sport|news|finance|entertainment|health",
        "source_count": 0,
        "is_favorite": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Get Folder Details
```http
GET /folders/{id}
```

**Response:** Folder with sources

#### Create Folder
```http
POST /folders
```

**Request Body:**
```json
{
  "name": "string",
  "theme": "tech|sport|news|finance|entertainment|health"
}
```

#### Update Folder
```http
PUT /folders/{id}
```

#### Add Sources to Folder
```http
POST /folders/{folderId}/sources
```

**Request Body:**
```json
{
  "source_ids": ["string"]
}
```

#### Remove Source from Folder
```http
DELETE /folders/{folderId}/sources/{sourceId}
```

#### Get Folders with Articles
```http
GET /folders/with-articles?page={page}&size={size}&article_size={size}&keyword={keyword}
```

#### Get Folder Articles
```http
GET /folders/{folderId}/articles?page={page}&size={size}&sort={sort}
```

### Sources

#### Get Sources List
```http
GET /sources?page={page}&size={size}
```

**Response:**
```json
{
  "data": {
    "content": [
      {
        "id": "string",
        "name": "string",
        "url": "string",
        "type": "rss|atom",
        "categories": [{}],
        "language": "en|vi",
        "active": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Get Source Details
```http
GET /sources/{id}
```

#### Create Source
```http
POST /sources
```

**Request Body:**
```json
{
  "name": "string",
  "url": "string",
  "type": "rss",
  "category_ids": ["string"],
  "language": "en"
}
```

#### Update Source
```http
PUT /sources/{id}
```

#### Delete Source
```http
DELETE /sources/{id}
```

#### Get Source Articles
```http
GET /sources/{id}/articles?page={page}&size={size}
```

### Teams

#### Get Teams List
```http
GET /teams?page={page}&size={size}&sort={sort}
```

#### Create Team
```http
POST /teams
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "enterprise_id": "string (optional)"
}
```

#### Add Team Member
```http
POST /teams/{teamId}/members
```

**Request Body:**
```json
{
  "user_id": "string",
  "role": "admin|member"
}
```

#### Get Team Members
```http
GET /teams/{teamId}/members
```

#### Remove Team Member
```http
DELETE /teams/{teamId}/members/{memberId}
```

### Team Boards

#### Get Team Boards
```http
GET /team-boards?page={page}&size={size}&sort={sort}
```

#### Get Boards by Team
```http
GET /team-boards/by-team/{teamId}?page={page}&size={size}
```

#### Get Team Board Details
```http
GET /team-boards/{id}?page={page}&size={size}
```

**Response:** Board with articles and pagination

#### Create Team Board
```http
POST /team-boards
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "team_id": "string"
}
```

#### Update Team Board
```http
PUT /team-boards/{id}
```

#### Delete Team Board
```http
DELETE /team-boards/{id}
```

#### Share Team Board
```http
POST /team-boards/{id}/share
```

**Request Body:**
```json
{
  "user_ids": ["string"],
  "permission": "ADMIN|EDIT|VIEW"
}
```

#### Update Member Permission
```http
PUT /team-boards/{boardId}/members/{userId}
```

**Request Body:**
```json
{
  "permission": "ADMIN|EDIT|VIEW"
}
```

#### Remove Board Member
```http
DELETE /team-boards/{boardId}/members/{userId}
```

#### Add Article to Team Board
```http
POST /team-boards/{boardId}/articles
```

**Request Body:**
```json
{
  "article_id": "string",
  "note": "string (optional)"
}
```

#### Remove Article from Team Board
```http
DELETE /team-boards/{boardId}/articles/{articleId}
```

#### Get Article Notes
```http
GET /team-boards/{boardId}/articles/{articleId}/notes
```

#### Add Article Note
```http
POST /team-boards/{boardId}/notes
```

**Request Body:**
```json
{
  "article_id": "string",
  "content": "string"
}
```

#### Get Article Highlights
```http
GET /team-boards/{boardId}/articles/{articleId}/highlights
```

#### Add Highlight
```http
POST /team-boards/{boardId}/highlights
```

**Request Body:**
```json
{
  "article_id": "string",
  "text": "string",
  "position": {
    "start": 0,
    "end": 100
  }
}
```

#### Create Newsletter
```http
POST /team-boards/{boardId}/newsletters
```

**Request Body:**
```json
{
  "title": "string",
  "schedule": "DAILY|WEEKLY|MONTHLY|IMMEDIATE",
  "recipients": ["email@example.com"],
  "filters": {
    "date_from": "2024-01-01",
    "date_to": "2024-01-31",
    "categories": ["string"]
  }
}
```

#### Get Board Members
```http
GET /team-boards/{boardId}/members
```

### Top Stories

#### Get Top Stories
```http
GET /top-stories?page={page}&size={size}
```

#### Get Trending Articles
```http
GET /top-stories/trending?page={page}&size={size}
```

#### Get Trending by Category
```http
GET /top-stories/trending/categories/{categoryId}?page={page}&size={size}
```

#### Get Trending by Tag
```http
GET /top-stories/trending/tags/{tagName}?page={page}&size={size}
```

#### Get Trending Topics
```http
GET /top-stories/trending-topics?page={page}&size={size}
```

#### Track Article View
```http
POST /top-stories/track/view/{articleId}
```

### Notifications

#### Get Notifications
```http
GET /notifications?page={page}&size={size}&sort={sort}
```

#### Count Unread Notifications
```http
GET /notifications/count/unread
```

**Response:**
```json
{
  "data": {
    "count": 5
  }
}
```

#### Mark Notification as Read
```http
PUT /notifications/{id}/read
```

#### Mark All as Read
```http
PUT /notifications/read-all
```

#### Send Notification
```http
POST /notifications/send
```

**Request Body:**
```json
{
  "user_id": "string",
  "type": "string",
  "title": "string",
  "message": "string",
  "data": {}
}
```

#### Send Logout Notification
```http
POST /notifications/send/logout
```

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Examples

### Example: Create Folder and Add Sources

```javascript
// 1. Create a new folder
const folder = await apiClient.post('/folders', {
  name: 'Tech News',
  theme: 'tech'
});

// 2. Get available sources
const sources = await apiClient.get('/sources', {
  params: { page: 0, size: 50 }
});

// 3. Add sources to folder
const techSources = sources.data.content.filter(s => 
  s.categories.some(c => c.name === 'Technology')
);

await apiClient.post(`/folders/${folder.data.id}/sources`, {
  source_ids: techSources.map(s => s.id)
});

// 4. Get folder articles
const articles = await apiClient.get(`/folders/${folder.data.id}/articles`, {
  params: { page: 0, size: 20 }
});
```

### Example: Team Collaboration Flow

```javascript
// 1. Create a team
const team = await apiClient.post('/teams', {
  name: 'Content Curators',
  description: 'Team for content curation'
});

// 2. Add members
await apiClient.post(`/teams/${team.data.id}/members`, {
  user_id: 'user123',
  role: 'member'
});

// 3. Create team board
const board = await apiClient.post('/team-boards', {
  name: 'Weekly Digest',
  description: 'Our weekly content picks',
  team_id: team.data.id
});

// 4. Add article with note
await apiClient.post(`/team-boards/${board.data.id}/articles`, {
  article_id: 'article123',
  note: 'Great analysis on AI trends'
});

// 5. Share board with specific permission
await apiClient.post(`/team-boards/${board.data.id}/share`, {
  user_ids: ['user456', 'user789'],
  permission: 'VIEW'
});
```

### Example: Search and Save Articles

```javascript
// 1. Search for articles
const searchResults = await apiClient.get('/explore/search', {
  params: {
    keyword: 'artificial intelligence',
    page: 0,
    size: 10
  }
});

// 2. Create a board for AI articles
const board = await apiClient.post('/boards', {
  name: 'AI Research',
  description: 'Collection of AI articles',
  color: '#2E7CF6',
  is_public: false
});

// 3. Save articles to board
for (const article of searchResults.data.content) {
  await apiClient.post(`/boards/${board.data.id}/articles`, {
    article_id: article.id,
    note: `Saved on ${new Date().toLocaleDateString()}`
  });
}

// 4. Track article views
for (const article of searchResults.data.content) {
  await apiClient.post(`/top-stories/track/view/${article.id}`);
}
```

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Authenticated requests**: 1000 requests per minute
- **Unauthenticated requests**: 100 requests per minute
- **Bulk operations**: Special limits apply

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Best Practices

1. **Use Pagination**: Always paginate large result sets
2. **Cache Responses**: Cache static data like categories
3. **Handle Errors**: Implement proper error handling
4. **Validate Input**: Validate data before sending
5. **Use Batch Operations**: Group related operations
6. **Monitor Rate Limits**: Track rate limit headers
7. **Implement Retries**: Retry failed requests with backoff