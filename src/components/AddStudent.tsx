import { useState } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';

export type StudentData = {
  rollNo: string;
  name: string;
  class: string;
  department: string;
  year: string;
};

type AddStudentProps = {
  onAddStudent: (student: StudentData) => void;
  onBack: () => void;
};

export function AddStudent({ onAddStudent, onBack }: AddStudentProps) {
  const [formData, setFormData] = useState<StudentData>({
    rollNo: '',
    name: '',
    class: '',
    department: '',
    year: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.rollNo || !formData.name || !formData.class || !formData.department || !formData.year) {
      setError('All fields are required');
      return;
    }

    if (formData.rollNo.length !== 12) {
      setError('Roll number must be 12 digits');
      return;
    }

    if (!/^\d+$/.test(formData.rollNo)) {
      setError('Roll number must contain only numbers');
      return;
    }

    onAddStudent(formData);
    setSuccess(true);
    
    // Reset form
    setFormData({
      rollNo: '',
      name: '',
      class: '',
      department: '',
      year: '',
    });

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Add New Student</h2>
            <p className="text-sm text-gray-600">Register a new student in the system</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 text-sm">✓ Student added successfully!</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">✕ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="rollNo" className="block text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNo"
              value={formData.rollNo}
              onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
              placeholder="Enter 12-digit roll number"
              maxLength={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <label htmlFor="class" className="block text-gray-700 mb-2">
              Class
            </label>
            <input
              type="text"
              id="class"
              value={formData.class}
              onChange={e => setFormData({ ...formData, class: e.target.value })}
              placeholder="e.g., A, B, C"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-gray-700 mb-2">
              Year
            </label>
            <select
              id="year"
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}
