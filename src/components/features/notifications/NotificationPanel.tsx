import React from 'react';
import styled from 'styled-components';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';
import { formatTime } from '../../../utils/dateUtils';

const NotificationPanelContainer = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 60px;
    right: 20px;
    width: 350px;
    max-height: 500px;
    background: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    overflow-y: auto;
`;

const NotificationHeader = styled.div`
    padding: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PanelTitle = styled.h3`
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const MarkAllReadButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary.main};
    cursor: pointer;
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 4px;

    &:hover {
        background: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const NotificationList = styled.div`
    padding: 10px;
`;

const NotificationItem = styled.div<{ read: boolean }>`
    padding: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    background: ${({ read, theme }) => (read ? 'transparent' : theme.colors.gray[50])};
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.gray[100]};
    }
`;

const NotificationTitle = styled.div`
    font-weight: 600;
    margin-bottom: 5px;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const NotificationMessage = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 5px;
`;

const NotificationTime = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyState = styled.div`
    padding: 20px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

export const NotificationPanel: React.FC = () => {
    const {
        notifications,
        isNotificationPanelOpen,
        markAsRead,
        markAllAsRead
    } = useNotification();

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    const handleNotificationClick = (id: number) => {
        markAsRead(id);
    };

    return (
        <NotificationPanelContainer isOpen={isNotificationPanelOpen}>
            <NotificationHeader>
                <PanelTitle>Notifications</PanelTitle>
                {notifications.length > 0 && (
                    <MarkAllReadButton onClick={handleMarkAllRead}>
                        Mark all as read
                    </MarkAllReadButton>
                )}
            </NotificationHeader>
            <NotificationList>
                {notifications.length === 0 ? (
                    <EmptyState>No notifications</EmptyState>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            read={notification.read}
                            onClick={() => handleNotificationClick(notification.id)}
                        >
                            <NotificationTitle>{notification.title}</NotificationTitle>
                            <NotificationMessage>{notification.content}</NotificationMessage>
                            <NotificationTime>
                                {formatTime(notification.timestamp)}
                            </NotificationTime>
                        </NotificationItem>
                    ))
                )}
            </NotificationList>
        </NotificationPanelContainer>
    );
}; 