import { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

type ReportIssueProps = {
  onSubmit: (type: 'report', description: string, location?: string) => void;
  onBack: () => void;
};

export function ReportIssue({ onSubmit, onBack }: ReportIssueProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit('report', description, location || undefined);
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
          <h3 className="text-gray-900 mb-2">Issue Reported Successfully</h3>
          <p className="text-gray-600">We'll notify you once it's reviewed.</p>
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

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Report an Issue</h2>
            <p className="text-sm text-gray-600">Describe the problem you're facing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Issue Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g., Main Building, 2nd Floor"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}