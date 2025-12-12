import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Calendar, Shield } from 'lucide-react';
import type { Notification } from '../App';

type NotificationsProps = {
  notifications: Notification[];
  onMarkAsRead: (notifId: string) => void;
  onBack: () => void;
};

export function Notifications({ notifications, onMarkAsRead, onBack }: NotificationsProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'report':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'report':
        return 'bg-orange-50 border-orange-200';
      case 'emergency':
        return 'bg-red-50 border-red-200';
      case 'meeting':
        return 'bg-blue-50 border-blue-200';
      case 'admin':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">
              We'll notify you about updates and important information
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(notif => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && onMarkAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${getBackgroundColor(
                    notif.type,
                    notif.read
                  )} ${notif.read ? 'opacity-60' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {notifications.length > 0 && notifications.some(n => !n.read) && (
          <button
            onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))}
            className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Mark All as Read
          </button>
        )}
      </div>
    </div>
  );
}