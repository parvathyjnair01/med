import React from 'react';
import { Bell, BellOff } from 'lucide-react';

interface NotificationPermissionProps {
  permission: NotificationPermission;
  onRequestPermission: () => void;
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  permission,
  onRequestPermission
}) => {
  if (permission === 'granted') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Notifications Enabled</p>
            <p className="text-xs text-green-600">You'll receive reminders when it's time to take your medicine</p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <BellOff className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">Notifications Blocked</p>
            <p className="text-xs text-red-600">Please enable notifications in your browser settings to receive medicine reminders</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-800">Enable Notifications</p>
            <p className="text-xs text-blue-600">Get reminded when it's time to take your medicine</p>
          </div>
        </div>
        <button
          onClick={onRequestPermission}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Enable
        </button>
      </div>
    </div>
  );
};