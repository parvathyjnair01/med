import { useState, useEffect, useCallback } from 'react';
import { Medicine, MedicineLog } from '../types/medicine';
import { getTodayString, getCurrentTime } from '../utils/dateUtils';

interface PendingReminder {
  medicine: Medicine;
  time: string;
  id: string;
}

export const useReminders = (medicines: Medicine[], logs: MedicineLog[]) => {
  const [pendingReminder, setPendingReminder] = useState<PendingReminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  const showBrowserNotification = useCallback((medicine: Medicine, time: string) => {
    if (notificationPermission === 'granted') {
      const notification = new Notification(`Time to take ${medicine.name}`, {
        body: `${medicine.dosage} at ${formatTime(time)}`,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: `medicine-${medicine.id}-${time}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        setPendingReminder({
          medicine,
          time,
          id: `${medicine.id}-${time}`
        });
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }, [notificationPermission]);

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const checkForReminders = useCallback(() => {
    const today = getTodayString();
    const currentTime = getCurrentTime();
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    medicines.forEach(medicine => {
      medicine.times.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const medicineTimeInMinutes = hours * 60 + minutes;
        
        // Check if it's time for this medicine (within 1 minute)
        const timeDifference = Math.abs(currentTimeInMinutes - medicineTimeInMinutes);
        
        if (timeDifference <= 1) {
          // Check if already logged
          const existingLog = logs.find(log => 
            log.medicineId === medicine.id && 
            log.date === today && 
            log.time === time
          );

          if (!existingLog) {
            // Show notification and popup
            showBrowserNotification(medicine, time);
            setPendingReminder({
              medicine,
              time,
              id: `${medicine.id}-${time}`
            });
          }
        }
      });
    });
  }, [medicines, logs, showBrowserNotification]);

  // Check for reminders every minute
  useEffect(() => {
    const interval = setInterval(checkForReminders, 60000);
    // Also check immediately
    checkForReminders();
    
    return () => clearInterval(interval);
  }, [checkForReminders]);

  const snoozeReminder = useCallback(() => {
    if (pendingReminder) {
      setPendingReminder(null);
      // Set a timeout to show the reminder again in 5 minutes
      setTimeout(() => {
        showBrowserNotification(pendingReminder.medicine, pendingReminder.time);
        setPendingReminder(pendingReminder);
      }, 5 * 60 * 1000); // 5 minutes
    }
  }, [pendingReminder, showBrowserNotification]);

  const dismissReminder = useCallback(() => {
    setPendingReminder(null);
  }, []);

  return {
    pendingReminder,
    snoozeReminder,
    dismissReminder,
    notificationPermission
  };
};