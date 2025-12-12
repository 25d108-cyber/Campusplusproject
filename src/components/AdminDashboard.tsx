import { useState } from 'react';
import { LogOut, AlertTriangle, Calendar, FileText, Shield, UserPlus, Users } from 'lucide-react';
import type { Report, MeetRequest } from '../App';
import { AddStudent, type StudentData } from './AddStudent';
import { ManageFaculty, type FacultyMember } from './ManageFaculty';
import type { TimeSlot } from '../lib/mockData';

type AdminDashboardProps = {
  reports: Report[];
  meetRequests: MeetRequest[];
  facultyList: FacultyMember[];
  onResolveReport: (reportId: string) => void;
  onUpdateReportStatus: (reportId: string, status: Report['status']) => void;
  onOfferMeetingSlots: (requestId: string, slots: { date: string; time: string }[]) => void;
  onAddStudent: (student: StudentData) => void;
  onAddFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  onUpdateSchedule: (facultyId: string, schedule: { [day: string]: TimeSlot[] }) => void;
  onLogout: () => void;
};

export function AdminDashboard({
  reports,
  meetRequests,
  facultyList,
  onResolveReport,
  onUpdateReportStatus,
  onOfferMeetingSlots,
  onAddStudent,
  onAddFaculty,
  onUpdateSchedule,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'issues' | 'emergencies' | 'addStudent' | 'manageFaculty'>('issues');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [offerSlots, setOfferSlots] = useState<{ date: string; time: string }[]>([
    { date: '', time: '' },
  ]);

  const issues = reports.filter(r => r.type === 'report');
  const emergencies = reports.filter(r => r.type === 'emergency');

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleOfferSlots = (requestId: string) => {
    const validSlots = offerSlots.filter(s => s.date && s.time);
    if (validSlots.length > 0) {
      onOfferMeetingSlots(requestId, validSlots);
      setSelectedRequest(null);
      setOfferSlots([{ date: '', time: '' }]);
    }
  };

  const addSlot = () => {
    setOfferSlots([...offerSlots, { date: '', time: '' }]);
  };

  const updateSlot = (index: number, field: 'date' | 'time', value: string) => {
    const updated = [...offerSlots];
    updated[index][field] = value;
    setOfferSlots(updated);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-900">Admin Dashboard</h3>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'issues'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Student Issues ({issues.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('emergencies')}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'emergencies'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergencies ({emergencies.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('addStudent')}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'addStudent'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Student
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manageFaculty')}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === 'manageFaculty'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Faculty
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'issues' && (
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No student issues reported</p>
              </div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900 mb-1">Issue #{issue.id}</h3>
                      <p className="text-sm text-gray-600">
                        Reported by: {issue.studentName} ({issue.rollNo})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimestamp(issue.timestamp)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-700">{issue.description}</p>
                    {issue.location && (
                      <p className="text-sm text-gray-600 mt-2">
                        📍 Location: {issue.location}
                      </p>
                    )}
                  </div>

                  {issue.status !== 'Resolved' && (
                    <div className="flex gap-2">
                      {issue.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateReportStatus(issue.id, 'In Progress')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Mark In Progress
                        </button>
                      )}
                      <button
                        onClick={() => onResolveReport(issue.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div className="space-y-4">
            {emergencies.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No emergencies reported</p>
              </div>
            ) : (
              emergencies.map(emergency => (
                <div
                  key={emergency.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900 mb-1">Emergency #{emergency.id}</h3>
                      <p className="text-sm text-gray-600">
                        Reported by: {emergency.studentName} ({emergency.rollNo})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(emergency.timestamp)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                        emergency.status
                      )}`}
                    >
                      {emergency.status}
                    </span>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
                    <p className="text-gray-900">{emergency.description}</p>
                    {emergency.location && (
                      <p className="text-sm text-red-700 mt-2">
                        📍 Location: {emergency.location}
                      </p>
                    )}
                  </div>

                  {emergency.status !== 'Resolved' && (
                    <div className="flex gap-2">
                      {emergency.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateReportStatus(emergency.id, 'In Progress')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Mark In Progress
                        </button>
                      )}
                      <button
                        onClick={() => onResolveReport(emergency.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'addStudent' && (
          <AddStudent onAddStudent={onAddStudent} onBack={() => setActiveTab('issues')} />
        )}

        {activeTab === 'manageFaculty' && (
          <ManageFaculty
            facultyList={facultyList}
            onAddFaculty={onAddFaculty}
            onUpdateSchedule={onUpdateSchedule}
            onBack={() => setActiveTab('issues')}
          />
        )}
      </div>
    </div>
  );
}