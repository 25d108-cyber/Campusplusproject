import { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { FacultyMember } from './ManageFaculty';

type FacultyTimetableProps = {
  facultyList: FacultyMember[];
  onBack: () => void;
};

export function FacultyTimetable({ facultyList, onBack }: FacultyTimetableProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
    setSelectedFacultyId('');
  };

  const handleFacultyChange = (facultyId: string) => {
    setSelectedFacultyId(facultyId);
  };

  // Get unique departments
  const departments = Array.from(new Set(facultyList.map(f => f.department)));
  
  // Get faculty for selected department
  const facultyInDept = selectedDepartment
    ? facultyList.filter(f => f.department === selectedDepartment)
    : [];

  // Get selected faculty member
  const selectedFaculty = facultyList.find(f => f.id === selectedFacultyId);

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Faculty Timetable</h2>
            <p className="text-sm text-gray-600">View faculty schedules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="department" className="block text-gray-700 mb-2">
              Select Department
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={e => handleDepartmentChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Choose a department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="faculty" className="block text-gray-700 mb-2">
              Select Faculty
            </label>
            <select
              id="faculty"
              value={selectedFacultyId}
              onChange={e => handleFacultyChange(e.target.value)}
              disabled={!selectedDepartment}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
              <option value="">Choose a faculty</option>
              {facultyInDept.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFaculty && selectedFaculty.schedule && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Weekly Schedule - {selectedFaculty.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-purple-500">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm text-white">
                      Period / Day
                    </th>
                    {days.map(day => (
                      <th
                        key={day}
                        className="border border-gray-300 px-4 py-3 text-center text-sm text-white"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time, timeIdx) => (
                    <tr key={time} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700 bg-gray-50">
                        <div>Period {timeIdx + 1}</div>
                        <div className="text-xs text-gray-500">{time}</div>
                      </td>
                      {days.map(day => {
                        const slot = selectedFaculty.schedule?.[day]?.[timeIdx];
                        return (
                          <td
                            key={day}
                            className={`border border-gray-300 px-3 py-3 text-center text-sm ${
                              slot?.subject === 'Lunch Break'
                                ? 'bg-amber-50'
                                : slot?.available
                                ? 'bg-green-50'
                                : slot
                                ? 'bg-blue-50'
                                : 'bg-gray-100'
                            }`}
                          >
                            {slot?.subject === 'Lunch Break' ? (
                              <div className="text-amber-700">🍽️ Lunch Break</div>
                            ) : slot?.available ? (
                              <div className="text-green-700">Free</div>
                            ) : slot ? (
                              <div>
                                <div className="text-indigo-700">{slot.subject}</div>
                                <div className="text-xs text-gray-600 mt-1">{slot.className}</div>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-gray-300"></div>
                <span className="text-gray-600">Class Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-gray-300"></div>
                <span className="text-gray-600">Free Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-50 border border-gray-300"></div>
                <span className="text-gray-600">Lunch Break</span>
              </div>
            </div>
          </div>
        )}

        {selectedFaculty && !selectedFaculty.schedule && (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
            <p>No schedule available for {selectedFaculty.name}</p>
            <p className="text-sm mt-2">Schedule can be set by admin in Manage Faculty section</p>
          </div>
        )}

        {!selectedFaculty && (
          <div className="text-center text-gray-500 py-8">
            Select a department and faculty to view their timetable
          </div>
        )}
      </div>
    </div>
  );
}