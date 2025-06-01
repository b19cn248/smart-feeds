import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../ToastContext';
import { notificationService, NotificationResponse } from '../../services/notificationService';
import { PageResponse } from '../../types/common';
import keycloak from '../../config/keycloak';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: number;
    title: string;
    content: string;
    url?: string;
    timestamp: string;
    type: NotificationType;
    read: boolean;
}

interface NotificationContextValue {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    loadNotifications: () => Promise<void>;
    loadUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    toggleNotificationPanel: () => void;
    isNotificationPanelOpen: boolean;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const mapNotificationType = (type: string): NotificationType => {
    switch (type.toLowerCase()) {
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        default:
            return 'info';
    }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { showToast } = useToast();

    const loadUnreadCount = async () => {
        try {
            // Ensure keycloak is initialized and token is valid
            if (!keycloak.token) {
                console.log('No keycloak token available, skipping unread count');
                return;
            }
            console.log('Loading unread count...');
            const response = await notificationService.countUnreadNotifications();
            console.log('Unread count response:', response);
            if (response && response.data !== undefined) {
                const count = response.data;
                console.log('Setting unread count to:', count);
                setUnreadCount(count);
            }
        } catch (error) {
            console.error('Error loading unread count:', error);
            showToast('error', 'Error', 'Failed to load unread count');
        }
    };

    const loadNotifications = async () => {
        console.log('Loading notifications...');
        setLoading(true);
        try {
            const response = await notificationService.getNotifications();
            console.log('Raw API response:', response);
            
            if (response && response.data && response.data.content) {
                console.log('Processing notifications from response.data.content');
                const mappedNotifications = response.data.content.map((notification: NotificationResponse) => ({
                    id: notification.id,
                    title: notification.title,
                    content: notification.content,
                    url: notification.url,
                    timestamp: notification.timestamp,
                    type: mapNotificationType(notification.notificationType),
                    read: notification.read
                }));
                
                console.log('Mapped notifications:', mappedNotifications);
                setNotifications(mappedNotifications);
            } else {
                console.error('Invalid response format:', response);
                showToast('error', 'Error', 'Invalid notification data format');
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            showToast('error', 'Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        console.log('Marking notification as read:', id);
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );
            // Update unread count after marking as read
            await loadUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
            showToast('error', 'Error', 'Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        console.log('Marking all notifications as read');
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            // Update unread count after marking all as read
            await loadUnreadCount();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            showToast('error', 'Error', 'Failed to mark all notifications as read');
        }
    };

    const toggleNotificationPanel = async () => {
        console.log('Toggling notification panel, current state:', isNotificationPanelOpen);
        setIsNotificationPanelOpen(prev => !prev);
        // Always update unread count when clicking the bell
        await loadUnreadCount();
        if (!isNotificationPanelOpen) {
            console.log('Panel will open, loading notifications...');
            await loadNotifications();
        }
    };

    useEffect(() => {
        console.log('NotificationProvider mounted, loading initial data...');
        const loadInitialData = async () => {
            try {
                // Wait for keycloak to be initialized
                if (!keycloak.token) {
                    console.log('Waiting for keycloak initialization...');
                    await new Promise(resolve => {
                        const checkToken = () => {
                            if (keycloak.token) {
                                resolve(true);
                            } else {
                                setTimeout(checkToken, 100);
                            }
                        };
                        checkToken();
                    });
                }
                console.log('Starting initial data load...');
                await loadUnreadCount();
                await loadNotifications();
                console.log('Initial data load completed');
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };
        loadInitialData();
    }, []);

    console.log('Current notifications state:', {
        notifications,
        unreadCount,
        isPanelOpen: isNotificationPanelOpen
    });

    const value = {
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        loadUnreadCount,
        markAsRead,
        markAllAsRead,
        toggleNotificationPanel,
        isNotificationPanelOpen
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 