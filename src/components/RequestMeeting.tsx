import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

type RequestMeetingProps = {
  department: string;
  faculty: string;
  onSubmit: (
    department: string,
    faculty: string,
    preferredDates: string[],
    timeRange: string,
    message: string
  ) => void;
  onCancel: () => void;
};

export function RequestMeeting({
  department,
  faculty,
  onSubmit,
  onCancel,
}: RequestMeetingProps) {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [date3, setDate3] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dates = [date1, date2, date3].filter(d => d);
    if (dates.length === 0 || !timeRange.trim() || !message.trim()) return;

    onSubmit(department, faculty, dates, timeRange, message);
    setSubmitted(true);

    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-gray-900">Request Submitted!</p>
        <p className="text-sm text-gray-600 mt-1">We'll notify you when {faculty} responds.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h4 className="text-gray-900 mb-4">Request Meeting with {faculty}</h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2 text-sm">
            Preferred Dates (select at least one)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
            <input
              type="date"
              value={date2}
              onChange={e => setDate2(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
            <input
              type="date"
              value={date3}
              onChange={e => setDate3(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="timeRange" className="block text-gray-700 mb-2 text-sm">
            Preferred Time Range *
          </label>
          <input
            id="timeRange"
            type="text"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            placeholder="e.g., 2:00 PM - 4:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 mb-2 text-sm">
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Briefly describe the purpose of the meeting..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm resize-none"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-all text-sm"
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}