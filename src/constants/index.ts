// src/constants/index.ts
export const FOLDER_COLORS = [
    {name: 'blue', value: '#2E7CF6'},
    {name: 'red', value: '#F43F5E'},
    {name: 'green', value: '#10B981'},
    {name: 'yellow', value: '#FBBF24'},
    {name: 'purple', value: '#8B5CF6'},
    {name: 'pink', value: '#EC4899'},
] as const;

export const VIEW_TYPES = {
    ALL: 'all',
    RECENT: 'recent',
    FAVORITES: 'favorites',
} as const;

// src/constants/index.ts
export const NAV_SECTIONS = [
    {
        title: 'Main',
        items: [
            {id: 'home', icon: 'home', label: 'Home', path: '/'},
            {id: 'discover', icon: 'compass', label: 'Discover', path: '/discover'},
            {id: 'feeds', icon: 'folder', label: 'My Feeds', path: '/feeds'},
            {id: 'boards', icon: 'clipboard', label: 'Boards', path: '/boards'},
            {id: 'sources', icon: 'rss', label: 'Sources', path: '/sources'},
            {id: 'teams', icon: 'users', label: 'Teams', path: '/teams'},
            {id: 'saved', icon: 'bookmark', label: 'Saved', path: '/saved'},
            {id: 'team-boards', icon: 'chalkboard', label: 'Team Boards', path: '/team-boards'}
        ],
    },
    {
        title: 'Personal',
        items: [
            {id: 'favorites', icon: 'heart', label: 'Favorites', path: '/favorites'},
            {id: 'history', icon: 'history', label: 'History', path: '/history'},
            {id: 'notifications', icon: 'bell', label: 'Notifications', path: '/notifications'},
        ],
    },
] as const;

export const TOAST_DURATION = 3000;

export const BREAKPOINTS = {
    mobile: 576,
    tablet: 768,
    desktop: 992,
    wide: 1200,
} as const;

export const Z_INDEX = {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    notification: 1700,
} as const;

export const ANIMATION_DURATION = {
    fast: '0.1s',
    normal: '0.2s',
    slow: '0.3s',
} as const;