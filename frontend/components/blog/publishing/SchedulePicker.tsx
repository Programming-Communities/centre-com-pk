'use client';

import { useState } from 'react';

interface SchedulePickerProps {
  onSchedule: (date: string) => void;
  onCancel: () => void;
  lang: string;
}

export default function SchedulePicker({ onSchedule, onCancel, lang }: SchedulePickerProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    if (date && time) {
      const dateTime = `${date}T${time}:00`;
      onSchedule(dateTime);
    }
  };

  return (
    <div className="schedule-picker bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold mb-3">Schedule Publish</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-1">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSchedule}
            disabled={!date || !time}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            Schedule
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
