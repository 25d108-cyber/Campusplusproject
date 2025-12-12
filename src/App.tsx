import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { StudentLogin } from './components/StudentLogin';
import { AdminLogin } from './components/AdminLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { mockDB } from './lib/mockData';
import type { StudentData } from './components/AddStudent';
import type { FacultyMember } from './components/ManageFaculty';
import type { TimeSlot } from './lib/mockData';

export type User = {
  rollNo: string;
  name: string;
};

export type Report = {
  id: string;
  rollNo: string;
  studentName: string;
  type: 'report' | 'emergency';
  description: string;
  location?: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
};

export type MeetRequest = {
  id: string;
  rollNo: string;
  studentName: string;
  department: string;
  faculty: string;
  preferredDates: string[];
  timeRange: string;
  message: string;
  timestamp: string;
  status: 'Pending' | 'Offered' | 'Booked' | 'Resolved';
  offeredSlots?: { date: string; time: string }[];
  bookedSlot?: { date: string; time: string };
};

export type Notification = {
  id: string;
  rollNo: string;
  message: string;
  timestamp: string;
  type: 'report' | 'emergency' | 'meeting' | 'admin';
  read: boolean;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'welcome' | 'student-login' | 'admin-login' | 'student-dashboard' | 'admin-dashboard'
  >('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [meetRequests, setMeetRequests] = useState<MeetRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [students, setStudents] = useState<(User & { class: string; department: string; year: string })[]>(
    mockDB.students.map(s => ({ ...s, class: 'A', department: 'AI & DS', year: '3' }))
  );
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(() => {
    // Initialize faculty list from mockDB
    const allFaculty: FacultyMember[] = [];
    mockDB.departments.forEach(dept => {
      dept.faculty.forEach((fac, idx) => {
        allFaculty.push({
          id: `faculty-${dept.name}-${idx}`,
          name: fac.name,
          title: fac.title,
          department: dept.name,
          subjects: [],
        });
      });
    });
    return allFaculty;
  });

  // Mock API handlers
  const handleStudentLogin = (rollNo: string): User | null => {
    const user = students.find(s => s.rollNo === rollNo);
    if (user) {
      setCurrentUser({ rollNo: user.rollNo, name: user.name });
      setCurrentPage('student-dashboard');
      return { rollNo: user.rollNo, name: user.name };
    }
    return null;
  };

  const handleAdminLogin = (id: string, password: string): boolean => {
    if (id === 'admin@psgitech' && password === 'pass@admin') {
      setCurrentPage('admin-dashboard');
      return true;
    }
    return false;
  };

  const handleSubmitReport = (
    type: 'report' | 'emergency',
    description: string,
    location?: string
  ) => {
    if (!currentUser) return;

    const newReport: Report = {
      id: `${type}-${Date.now()}`,
      rollNo: currentUser.rollNo,
      studentName: currentUser.name,
      type,
      description,
      location,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    setReports(prev => [...prev, newReport]);

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      rollNo: currentUser.rollNo,
      message: `Your ${type === 'report' ? 'issue report' : 'emergency request'} has been submitted and is pending review.`,
      timestamp: new Date().toISOString(),
      type,
      read: false,
    };

    setNotifications(prev => [...prev, notification]);
  };

  const handleSubmitMeetRequest = (
    department: string,
    faculty: string,
    preferredDates: string[],
    timeRange: string,
    message: string
  ) => {
    if (!currentUser) return;

    const newRequest: MeetRequest = {
      id: `meet-${Date.now()}`,
      rollNo: currentUser.rollNo,
      studentName: currentUser.name,
      department,
      faculty,
      preferredDates,
      timeRange,
      message,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    setMeetRequests(prev => [...prev, newRequest]);

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      rollNo: currentUser.rollNo,
      message: `Your meeting request with ${faculty} has been submitted.`,
      timestamp: new Date().toISOString(),
      type: 'meeting',
      read: false,
    };

    setNotifications(prev => [...prev, notification]);
  };

  const handleOfferMeetingSlots = (
    requestId: string,
    offeredSlots: { date: string; time: string }[]
  ) => {
    setMeetRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'Offered' as const, offeredSlots }
          : req
      )
    );

    const request = meetRequests.find(r => r.id === requestId);
    if (request) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        rollNo: request.rollNo,
        message: `${request.faculty} has offered meeting slots for your request.`,
        timestamp: new Date().toISOString(),
        type: 'meeting',
        read: false,
      };

      setNotifications(prev => [...prev, notification]);
    }
  };

  const handleBookMeetingSlot = (requestId: string, slot: { date: string; time: string }) => {
    setMeetRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'Booked' as const, bookedSlot: slot }
          : req
      )
    );

    const request = meetRequests.find(r => r.id === requestId);
    if (request) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        rollNo: request.rollNo,
        message: `Your meeting with ${request.faculty} has been confirmed for ${slot.date} at ${slot.time}.`,
        timestamp: new Date().toISOString(),
        type: 'meeting',
        read: false,
      };

      setNotifications(prev => [...prev, notification]);
    }
  };

  const handleResolveReport = (reportId: string) => {
    setReports(prev =>
      prev.map(rep =>
        rep.id === reportId ? { ...rep, status: 'Resolved' as const } : rep
      )
    );

    const report = reports.find(r => r.id === reportId);
    if (report) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        rollNo: report.rollNo,
        message: `Your ${report.type === 'report' ? 'issue' : 'emergency request'} has been resolved.`,
        timestamp: new Date().toISOString(),
        type: 'admin',
        read: false,
      };

      setNotifications(prev => [...prev, notification]);
    }
  };

  const handleUpdateReportStatus = (reportId: string, status: Report['status']) => {
    setReports(prev =>
      prev.map(rep => (rep.id === reportId ? { ...rep, status } : rep))
    );

    const report = reports.find(r => r.id === reportId);
    if (report) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        rollNo: report.rollNo,
        message: `Your ${report.type} status has been updated to: ${status}`,
        timestamp: new Date().toISOString(),
        type: 'admin',
        read: false,
      };

      setNotifications(prev => [...prev, notification]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('welcome');
  };

  const getUserNotifications = (rollNo: string) => {
    return notifications.filter(n => n.rollNo === rollNo);
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleAddStudent = (student: StudentData) => {
    const newStudent = {
      rollNo: student.rollNo,
      name: student.name,
      class: student.class,
      department: student.department,
      year: student.year,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleAddFaculty = (faculty: Omit<FacultyMember, 'id'>) => {
    const newFaculty: FacultyMember = {
      id: `faculty-${Date.now()}`,
      ...faculty,
    };
    setFacultyList(prev => [...prev, newFaculty]);
  };

  const handleUpdateSchedule = (facultyId: string, schedule: { [day: string]: TimeSlot[] }) => {
    setFacultyList(prev =>
      prev.map(fac =>
        fac.id === facultyId ? { ...fac, schedule } : fac
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {currentPage === 'welcome' && (
        <Welcome
          onStudentLogin={() => setCurrentPage('student-login')}
          onAdminLogin={() => setCurrentPage('admin-login')}
        />
      )}

      {currentPage === 'student-login' && (
        <StudentLogin
          onLogin={handleStudentLogin}
          onBack={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'student-dashboard' && currentUser && (
        <StudentDashboard
          user={currentUser}
          onSubmitReport={handleSubmitReport}
          notifications={notifications.filter(n => n.rollNo === currentUser.rollNo)}
          onMarkNotificationRead={handleMarkNotificationRead}
          facultyList={facultyList}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin-dashboard' && (
        <AdminDashboard
          reports={reports}
          meetRequests={meetRequests}
          facultyList={facultyList}
          onResolveReport={handleResolveReport}
          onUpdateReportStatus={handleUpdateReportStatus}
          onOfferMeetingSlots={handleOfferMeetingSlots}
          onAddStudent={handleAddStudent}
          onAddFaculty={handleAddFaculty}
          onUpdateSchedule={handleUpdateSchedule}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}