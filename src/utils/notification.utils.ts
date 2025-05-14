import { ToastType } from '../types';

/**
 * Trả về thông báo chuẩn hóa cho các hành động thêm article
 */
export const getArticleActionMessage = {
    save: {
        success: (title: string): { type: ToastType; title: string; message: string } => ({
            type: 'success',
            title: 'Article Saved',
            message: `"${truncateText(title, 30)}" has been saved successfully`
        }),
        failure: (error?: Error): { type: ToastType; title: string; message: string } => ({
            type: 'error',
            title: 'Save Failed',
            message: `Could not save article. ${error?.message || 'Please try again later.'}`
        }),
        alreadyExists: (title: string): { type: ToastType; title: string; message: string } => ({
            type: 'warning',
            title: 'Already Saved',
            message: `"${truncateText(title, 30)}" is already in this board`
        })
    },
    add: {
        success: (title: string): { type: ToastType; title: string; message: string } => ({
            type: 'success',
            title: 'Article Added',
            message: `"${truncateText(title, 30)}" has been added successfully`
        }),
        failure: (error?: Error): { type: ToastType; title: string; message: string } => ({
            type: 'error',
            title: 'Add Failed',
            message: `Could not add article. ${error?.message || 'Please try again later.'}`
        }),
        invalidUrl: (): { type: ToastType; title: string; message: string } => ({
            type: 'error',
            title: 'Invalid URL',
            message: 'Please enter a valid URL'
        })
    },
    remove: {
        success: (title: string): { type: ToastType; title: string; message: string } => ({
            type: 'success',
            title: 'Article Removed',
            message: `"${truncateText(title, 30)}" has been removed successfully`
        }),
        failure: (error?: Error): { type: ToastType; title: string; message: string } => ({
            type: 'error',
            title: 'Remove Failed',
            message: `Could not remove article. ${error?.message || 'Please try again later.'}`
        })
    }
};

/**
 * Hàm giúp truncate text và thêm dấu ellipsis nếu cần
 */
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}