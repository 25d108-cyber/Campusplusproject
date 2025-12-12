import { useState } from 'react';
import { Users, Plus, Edit2, Save, X } from 'lucide-react';
import type { TimeSlot } from '../lib/mockData';

export type FacultyMember = {
  id: string;
  name: string;
  title: string;
  department: string;
  subjects: string[];
  schedule?: { [day: string]: TimeSlot[] };
};

type ManageFacultyProps = {
  facultyList: FacultyMember[];
  onAddFaculty: (faculty: Omit<FacultyMember, 'id'>) => void;
  onUpdateSchedule: (facultyId: string, schedule: { [day: string]: TimeSlot[] }) => void;
  onBack: () => void;
};

export function ManageFaculty({ facultyList, onAddFaculty, onUpdateSchedule, onBack }: ManageFacultyProps) {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: 'Dr.',
    department: '',
    subjects: '',
  });
  const [editingSchedule, setEditingSchedule] = useState<{ [day: string]: TimeSlot[] }>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.department || !formData.subjects) {
      setError('All fields are required');
      return;
    }

    const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
    
    onAddFaculty({
      name: formData.name,
      title: formData.title,
      department: formData.department,
      subjects: subjectsArray,
    });

    setSuccess('Faculty member added successfully!');
    setFormData({ name: '', title: 'Dr.', department: '', subjects: '' });
    
    setTimeout(() => {
      setSuccess('');
      setView('list');
    }, 2000);
  };

  const handleEditSchedule = (faculty: FacultyMember) => {
    setSelectedFaculty(faculty);
    
    // Initialize schedule with empty slots if not exists
    const initialSchedule: { [day: string]: TimeSlot[] } = {};
    days.forEach(day => {
      initialSchedule[day] = faculty.schedule?.[day] || periods.map((time, idx) => ({
        time,
        period: idx + 1,
        available: time === '1:00 PM - 2:00 PM' ? false : true,
        subject: time === '1:00 PM - 2:00 PM' ? 'Lunch Break' : undefined,
      }));
    });
    
    setEditingSchedule(initialSchedule);
    setView('edit');
  };

  const updateSlot = (day: string, periodIdx: number, field: 'subject' | 'className', value: string) => {
    setEditingSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, idx) => 
        idx === periodIdx 
          ? { ...slot, [field]: value, available: !value && !slot.className && slot.time !== '1:00 PM - 2:00 PM' }
          : slot
      ),
    }));
  };

  const clearSlot = (day: string, periodIdx: number) => {
    setEditingSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, idx) => 
        idx === periodIdx && slot.time !== '1:00 PM - 2:00 PM'
          ? { time: slot.time, period: slot.period, available: true }
          : slot
      ),
    }));
  };

  const handleSaveSchedule = () => {
    if (selectedFaculty) {
      onUpdateSchedule(selectedFaculty.id, editingSchedule);
      setSuccess('Schedule updated successfully!');
      setTimeout(() => {
        setSuccess('');
        setView('list');
        setSelectedFaculty(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Manage Faculty</h2>
                <p className="text-sm text-gray-600">Add faculty members and manage their schedules</p>
              </div>
            </div>
            <button
              onClick={() => setView('add')}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Faculty
            </button>
          </div>

          <div className="grid gap-4">
            {facultyList.map(faculty => (
              <div key={faculty.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900">{faculty.title} {faculty.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{faculty.department}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {faculty.subjects.map((subject, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditSchedule(faculty)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </>
      )}

      {view === 'add' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Add New Faculty</h2>
              <p className="text-sm text-gray-600">Enter faculty member details</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm">✓ {success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm">✕ {error}</p>
            </div>
          )}

          <form onSubmit={handleAddFaculty} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <select
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select Department</option>
                <option value="AI & DS">AI & DS</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Subjects (comma-separated)</label>
              <textarea
                value={formData.subjects}
                onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                placeholder="e.g., Machine Learning, Deep Learning, AI Fundamentals"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Faculty
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'edit' && selectedFaculty && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Edit Schedule</h2>
                <p className="text-sm text-gray-600">{selectedFaculty.title} {selectedFaculty.name}</p>
              </div>
            </div>
            <button
              onClick={handleSaveSchedule}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Schedule
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm">✓ {success}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-500">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm text-white">
                    Time / Day
                  </th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 px-4 py-3 text-sm text-white">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period, periodIdx) => (
                  <tr key={periodIdx}>
                    <td className="border border-gray-300 px-4 py-3 bg-gray-50 text-sm">
                      Period {periodIdx + 1}<br />
                      <span className="text-xs text-gray-600">{period}</span>
                    </td>
                    {days.map(day => {
                      const slot = editingSchedule[day]?.[periodIdx];
                      const isLunch = period === '1:00 PM - 2:00 PM';
                      
                      return (
                        <td key={`${day}-${periodIdx}`} className="border border-gray-300 px-2 py-2">
                          {isLunch ? (
                            <div className="text-center text-sm text-gray-600 py-2">
                              Lunch Break
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <input
                                type="text"
                                placeholder="Subject"
                                value={slot?.subject || ''}
                                onChange={e => updateSlot(day, periodIdx, 'subject', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                              />
                              <input
                                type="text"
                                placeholder="Class"
                                value={slot?.className || ''}
                                onChange={e => updateSlot(day, periodIdx, 'className', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                              />
                              {(slot?.subject || slot?.className) && (
                                <button
                                  onClick={() => clearSlot(day, periodIdx)}
                                  className="w-full px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center gap-1"
                                >
                                  <X className="w-3 h-3" />
                                  Clear
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSaveSchedule}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Schedule
            </button>
            <button
              onClick={() => setView('list')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
