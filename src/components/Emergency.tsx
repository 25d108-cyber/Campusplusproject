import { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

type EmergencyProps = {
  onSubmit: (type: 'emergency', description: string, location?: string) => void;
  onBack: () => void;
};

export function Emergency({ onSubmit, onBack }: EmergencyProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit('emergency', description, location || undefined);
    setSubmitted(true);

    setTimeout(() => {
      setDescription('');
      setLocation('');
      setSubmitted(false);
      onBack();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Emergency Reported</h3>
          <p className="text-gray-600">Help is on the way. Stay safe!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Report Emergency</h2>
            <p className="text-sm text-red-600">For urgent situations requiring immediate attention</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800">
            ⚠️ This is for emergencies only. Your report will be prioritized and sent to campus security immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Emergency Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Current Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g., Main Building, 2nd Floor, Room 204"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Report Emergency Now
          </button>
        </form>
      </div>
    </div>
  );
}