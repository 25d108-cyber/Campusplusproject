import { GraduationCap, UserCircle, Shield } from 'lucide-react';

type WelcomeProps = {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
};

export function Welcome({ onStudentLogin, onAdminLogin }: WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-white mb-2">
            Campus + Project
          </h1>
          <p className="text-gray-300">Your campus management solution</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-4 border border-white/20">
          <button
            onClick={onStudentLogin}
            className="w-full bg-blue-400 text-slate-900 py-4 px-6 rounded-xl hover:bg-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <UserCircle className="w-6 h-6" />
            Student Login
          </button>

          <button
            onClick={onAdminLogin}
            className="w-full bg-purple-400 text-slate-900 py-4 px-6 rounded-xl hover:bg-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Shield className="w-6 h-6" />
            Admin Login
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Powered by PSG iTech
        </p>
      </div>
    </div>
  );
}
