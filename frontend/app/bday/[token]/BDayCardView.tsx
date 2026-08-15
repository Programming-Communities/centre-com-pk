'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function BDayCardView({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<any>(null);

  useEffect(() => {
    fetchCardData();
  }, [token]);

  const fetchCardData = async () => {
    try {
      const res = await fetch(`/api/token/create?token=${token}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Card not found or expired');
      } else {
        setCardData(data);
      }
    } catch (err) {
      setError('Failed to load shared card');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-white mb-2">Card Not Available</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <a href="https://www.centre.com.pk/tools/calculators/age-calculator" 
             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Calculate Your Age
          </a>
        </div>
      </div>
    );
  }

  const { data, sections, selectedEmoji, customMessage } = cardData;
  const colors = ['#2563eb', '#4338ca'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ 
      background: `linear-gradient(135deg, ${colors[0]}dd, ${colors[1]}dd)` 
    }}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ 
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` 
      }}>
        <div className="relative p-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-15 bg-white blur-2xl" />
          
          <div className="relative text-center">
            {sections?.showEmoji && <div className="text-4xl mb-2">{selectedEmoji || '🎂'}</div>}
            {data?.isBirthdayToday && (
              <div className="mb-3 p-2 rounded-xl bg-white/20 text-white font-bold text-sm">🎂🎉 TODAY IS THEIR BIRTHDAY! 🎉🎂</div>
            )}
            {sections?.showYears && (
              <>
                <div className="text-6xl font-black text-white">{data?.years}</div>
                <div className="text-lg text-white/80 font-semibold mb-4">YEARS OLD</div>
              </>
            )}
            {sections?.showTotalDays && (
              <div className="p-3 rounded-xl bg-white/20 mb-2">
                <div className="text-xl font-bold text-white">{Number(data?.totalDays).toLocaleString()}</div>
                <div className="text-xs text-white/70">📅 Total Days Lived</div>
              </div>
            )}
            {customMessage && (
              <div className="mt-3 p-3 rounded-xl bg-white/10">
                <p className="text-sm text-white italic">&ldquo;{customMessage}&rdquo;</p>
              </div>
            )}
            <div className="text-center text-xs text-white/40 mt-4">centre.com.pk</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a href="https://www.centre.com.pk/tools/calculators/age-calculator"
           className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg">
          Calculate Your Age Free →
        </a>
      </div>
    </div>
  );
}
