import { useEffect, useRef, useCallback } from 'react';
import type { Homework, Subject } from '../types';

const NOTIFICATION_HOUR = 15; // 3:00 PM
const NOTIFICATION_MINUTE = 0;

export function useNotifications(homework: Homework[], subjects: Subject[]) {
    const notificationSentToday = useRef(false);
    const permissionGranted = useRef(Notification.permission === 'granted');

    // Request permission on first load
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            permissionGranted.current = true;
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            permissionGranted.current = permission === 'granted';
            return permission === 'granted';
        }

        return false;
    }, []);

    // Format homework list for notification
    const formatHomeworkList = useCallback((homeworkList: Homework[]): string => {
        return homeworkList.slice(0, 5).map(hw => {
            const subject = subjects.find(s => s.id === hw.subjectId);
            const subjectName = subject?.name || 'נושא';
            const dueDate = new Date(hw.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let dateText = '';
            if (dueDate <= today) {
                dateText = '(היום!)';
            } else if (dueDate.getTime() === tomorrow.getTime()) {
                dateText = '(מחר)';
            }

            return `• ${subjectName} ${dateText}`;
        }).join('\n');
    }, [subjects]);

    // Show notification
    const showNotification = useCallback(() => {
        if (homework.length === 0 || !permissionGranted.current) {
            return;
        }

        const body = formatHomeworkList(homework);
        const notification = new Notification('📚 שיעורי בית ממתינים!', {
            body: body + (homework.length > 5 ? `\n...ועוד ${homework.length - 5}` : ''),
            icon: '/vite.svg',
            tag: 'homework-reminder', // Prevents duplicate notifications
            requireInteraction: false
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
    }, [homework, formatHomeworkList]);

    // Check if it's time for notification
    const checkNotificationTime = useCallback(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Reset the flag at midnight
        if (currentHour === 0 && currentMinute === 0) {
            notificationSentToday.current = false;
        }

        // Check if it's notification time (15:00)
        if (
            currentHour === NOTIFICATION_HOUR &&
            currentMinute >= NOTIFICATION_MINUTE &&
            currentMinute < NOTIFICATION_MINUTE + 5 && // 5 minute window
            !notificationSentToday.current
        ) {
            notificationSentToday.current = true;
            showNotification();
        }
    }, [showNotification]);

    // Request permission on mount
    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    // Set up interval to check time
    useEffect(() => {
        // Check immediately on load
        checkNotificationTime();

        // Check every minute
        const interval = setInterval(checkNotificationTime, 60000);

        return () => clearInterval(interval);
    }, [checkNotificationTime]);

    return {
        requestPermission,
        showNotification,
        isSupported: 'Notification' in window,
        permission: typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    };
}
