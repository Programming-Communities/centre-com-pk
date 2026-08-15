'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Heart, Star, Laugh, Frown, Angry } from 'lucide-react';

const reactions = [
  { type: 'like', icon: ThumbsUp, label: 'Like', color: 'blue' },
  { type: 'love', icon: Heart, label: 'Love', color: 'pink' },
  { type: 'wow', icon: Star, label: 'Wow', color: 'yellow' },
  { type: 'funny', icon: Laugh, label: 'Funny', color: 'green' },
  { type: 'sad', icon: Frown, label: 'Sad', color: 'purple' },
  { type: 'dislike', icon: ThumbsDown, label: 'Dislike', color: 'red' },
  { type: 'angry', icon: Angry, label: 'Angry', color: 'orange' },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  red: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
};

export default function ReactionButtons({ postId, initialCounts = {} }: { 
  postId: number; 
  initialCounts?: Record<string, number>;
}) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let sid = localStorage.getItem('centers_session');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('centers_session', sid);
    }
    setSessionId(sid);
    
    // Check if user already reacted
    const savedReaction = localStorage.getItem(`reaction_${postId}`);
    if (savedReaction) setUserReaction(savedReaction);
  }, [postId]);

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/reactions?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || {});
        if (data.userReaction) setUserReaction(data.userReaction);
      }
    } catch {}
  };

  const handleReaction = async (type: string) => {
    if (loading) return;
    
    // Toggle if same reaction clicked
    const newReaction = userReaction === type ? null : type;
    
    setLoading(true);
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reaction: newReaction, sessionId }),
      });
      
      if (res.ok) {
        setUserReaction(newReaction);
        if (newReaction) {
          localStorage.setItem(`reaction_${postId}`, newReaction);
        } else {
          localStorage.removeItem(`reaction_${postId}`);
        }
        fetchReactions(); // Refresh counts
      }
    } catch (err) {
      console.error('Reaction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {reactions.map(({ type, icon: Icon, label, color }) => {
        const colors = colorMap[color];
        const isActive = userReaction === type;
        const count = counts[type] || 0;
        
        if (count === 0 && !isActive) return null;
        
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border
              ${isActive 
                ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm` 
                : 'bg-surface text-text-secondary border-border hover:bg-surface-hover'
              } disabled:opacity-50`}
            title={label}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
