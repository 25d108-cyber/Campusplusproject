import { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';

type AdminLoginProps = {
  onLogin: (id: string, password: string) => boolean;
  onBack: () => void;
};

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = onLogin(id, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-400 mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-white mb-2">Admin Login</h2>
            <p className="text-sm text-gray-300">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="adminId" className="block text-gray-300 mb-2">
                Admin ID
              </label>
              <input
                id="adminId"
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="admin@psgitech"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-400 text-slate-900 py-3 px-6 rounded-xl hover:bg-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}