import { api } from './api';
import { PageResponse } from '../types/common';
import { getApiUrl } from '../config/env';

export interface NotificationResponse {
    id: number;
    title: string;
    content: string;
    titleEn: string;
    contentEn: string;
    url: string;
    timestamp: string;
    notificationType: string;
    senderId: number;
    recipientId: number;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationDto {
    title: string;
    content: string;
    titleEn?: string;
    contentEn?: string;
    url?: string;
    notificationType: string;
    senderId?: number;
    recipientId?: number;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notificationService = {
    getNotifications: async (page = 0, size = 10) => {
        console.log('Calling getNotifications API...');
        try {
            const response = await api.get<ApiResponse<PageResponse<NotificationResponse>>>('/notifications', {
                params: { 
                    page, 
                    size,
                    sort: 'createdAt,desc'
                }
            });
            console.log('getNotifications API response:', response);
            return response.data;
        } catch (error) {
            console.error('getNotifications API error:', error);
            throw error;
        }
    },

    countUnreadNotifications: async () => {
        console.log('Calling countUnreadNotifications API...');
        try {
            const response = await api.get<ApiResponse<number>>('/notifications/count/unread');
            console.log('countUnreadNotifications API response:', response);
            return response.data;
        } catch (error) {
            console.error('countUnreadNotifications API error:', error);
            throw error;
        }
    },

    markAsRead: async (id: number) => {
        console.log('Calling markAsRead API for id:', id);
        try {
            const response = await api.put(`/notifications/${id}/read`);
            console.log('markAsRead API response:', response);
            return response.data;
        } catch (error) {
            console.error('markAsRead API error:', error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        console.log('Calling markAllAsRead API...');
        try {
            const response = await api.put('/notifications/read-all');
            console.log('markAllAsRead API response:', response);
            return response.data;
        } catch (error) {
            console.error('markAllAsRead API error:', error);
            throw error;
        }
    },

    sendNotification: async (notification: NotificationDto, usernames: string[]) => {
        console.log('Calling sendNotification API...', { notification, usernames });
        try {
            const response = await api.post('/notifications/send', notification, {
                params: { usernames }
            });
            console.log('sendNotification API response:', response);
            return response.data;
        } catch (error) {
            console.error('sendNotification API error:', error);
            throw error;
        }
    },

    sendLogoutNotification: async (notification: NotificationDto, usernames: string[]) => {
        console.log('Calling sendLogoutNotification API...', { notification, usernames });
        try {
            const response = await api.post('/notifications/send/logout', notification, {
                params: { usernames }
            });
            console.log('sendLogoutNotification API response:', response);
            return response.data;
        } catch (error) {
            console.error('sendLogoutNotification API error:', error);
            throw error;
        }
    }
}; 