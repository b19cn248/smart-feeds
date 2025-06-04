export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
}; 