import { useState } from 'react';
import { Bell, AlertTriangle, Calendar, LogOut, Menu, X } from 'lucide-react';
import { ReportIssue } from './ReportIssue';
import { Emergency } from './Emergency';
import { FacultyTimetable } from './FacultyTimetable';
import { Notifications } from './Notifications';
import type { User, Notification } from '../App';
import type { FacultyMember } from './ManageFaculty';

type StudentDashboardProps = {
  user: User;
  onSubmitReport: (type: 'report' | 'emergency', description: string, location?: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (notifId: string) => void;
  facultyList: FacultyMember[];
  onLogout: () => void;
};

export function StudentDashboard({
  user,
  onSubmitReport,
  notifications,
  onMarkNotificationRead,
  facultyList,
  onLogout,
}: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<
    'menu' | 'report' | 'emergency' | 'timetable' | 'notifications'
  >('menu');
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBack = () => {
    setCurrentView('menu');
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h3 className="text-gray-900">Welcome, {user.name}</h3>
              <p className="text-xs text-gray-500">{user.rollNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
            >
              <LogOut className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {currentView === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setCurrentView('report')}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Report Issue</h3>
              <p className="text-sm text-gray-600">Report campus issues and track status</p>
            </button>

            <button
              onClick={() => setCurrentView('timetable')}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Faculty Timetable</h3>
              <p className="text-sm text-gray-600">View faculty schedules</p>
            </button>

            <button
              onClick={() => setCurrentView('emergency')}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group md:col-span-2"
            >
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Emergency</h3>
              <p className="text-sm text-gray-600">Report urgent situations requiring immediate attention</p>
            </button>

            <button
              onClick={onLogout}
              className="md:hidden bg-gray-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group md:col-span-2"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-gray-900 mb-2">Logout</h3>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </button>
          </div>
        )}

        {currentView === 'report' && (
          <ReportIssue onSubmit={onSubmitReport} onBack={handleBack} />
        )}

        {currentView === 'emergency' && (
          <Emergency onSubmit={onSubmitReport} onBack={handleBack} />
        )}

        {currentView === 'timetable' && (
          <FacultyTimetable onBack={handleBack} facultyList={facultyList} />
        )}

        {currentView === 'notifications' && (
          <Notifications
            notifications={notifications}
            onMarkAsRead={onMarkNotificationRead}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}