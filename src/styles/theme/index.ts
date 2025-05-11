// src/styles/theme/index.ts
export const theme = {
    colors: {
        primary: {
            main: '#2E7CF6',
            light: 'rgba(46, 124, 246, 0.1)',
            hover: '#1E6CE6',
        },
        secondary: '#FF8A3D',
        tertiary: '#6C5CE7',
        success: '#10B981',
        error: '#EF4444',
        warning: '#FBBF24',
        info: '#2E7CF6',
        gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
        },
        background: {
            primary: '#F8FAFC',
            secondary: '#FFFFFF',
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
        },
        logo: '#0F172A', // Thêm màu cho logo
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: {
            xs: '12px',
            sm: '13px',
            md: '14px',
            lg: '16px',
            xl: '18px',
            '2xl': '20px',
            '3xl': '24px',
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
    },
    radii: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.06), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },
    transitions: {
        fast: 'all 0.1s ease',
        default: 'all 0.2s ease',
        slow: 'all 0.3s ease',
    },
    breakpoints: {
        xs: '0px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
    },
    zIndices: {
        hide: -1,
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        overlay: 1300,
        modal: 1400,
        popover: 1500,
        tooltip: 1600,
        notification: 1700,
    },
};

export type Theme = typeof theme;

// src/styles/theme/index.ts
// Chỉ thay đổi phần darkTheme, giữ nguyên phần còn lại

export const darkTheme: Partial<Theme> = {
    colors: {
        primary: {
            main: '#3B82F6', // Màu xanh sáng hơn cho khả năng hiển thị tốt hơn trong dark mode
            light: 'rgba(59, 130, 246, 0.15)',
            hover: '#2563EB',
        },
        // Thêm thuộc tính thiếu
        secondary: '#FF9F43', // Màu cam nhạt hơn để phù hợp với dark mode
        tertiary: '#A29BFE', // Màu tím nhạt hơn để phù hợp với dark mode
        background: {
            primary: '#0F172A',
            secondary: '#1E293B',
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
        gray: {
            50: '#0F172A',
            100: '#1E293B',
            200: '#334155',
            300: '#475569',
            400: '#64748B',
            500: '#94A3B8',
            600: '#CBD5E1',
            700: '#E2E8F0',
            800: '#F1F5F9',
            900: '#F8FAFC',
        },
        // Điều chỉnh các màu chức năng
        success: '#10B981',
        error: '#F87171',
        warning: '#F59E0B',
        info: '#60A5FA',
        logo: '#F8FAFC', // Thêm màu logo trong dark mode để dễ đọc
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
        md: '0 4px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.6), 0 4px 6px rgba(0, 0, 0, 0.5)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.7), 0 10px 10px rgba(0, 0, 0, 0.6)',
    },
};