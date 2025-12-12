import { useState } from 'react';
import { ArrowLeft, UserCircle, AlertCircle } from 'lucide-react';
import type { User } from '../App';

type StudentLoginProps = {
  onLogin: (rollNo: string) => User | null;
  onBack: () => void;
};

export function StudentLogin({ onLogin, onBack }: StudentLoginProps) {
  const [rollNo, setRollNo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rollNo.length !== 12) {
      setError('Roll number must be 12 digits');
      return;
    }

    const user = onLogin(rollNo);
    if (!user) {
      setError('Invalid roll number. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-400 mb-4 shadow-lg">
              <UserCircle className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-white mb-2">Student Login</h2>
            <p className="text-sm text-gray-300">Enter your 12-digit roll number</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rollNo" className="block text-gray-300 mb-2">
                Roll Number
              </label>
              <input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder="e.g., 715535243011"
                maxLength={12}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">{rollNo.length}/12 digits</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-400 text-slate-900 py-3 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}