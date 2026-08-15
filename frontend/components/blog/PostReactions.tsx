'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Heart, ThumbsUp, ThumbsDown, CheckCircle, XCircle, Lightbulb, HeartHandshake } from 'lucide-react';

interface PostReactionsProps {
  postSlug: string;
  lang?: string;
}

export default function PostReactions({ postSlug, lang = 'en' }: PostReactionsProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userId] = useState(() => 'user_' + Math.random().toString(36).substring(2, 10));

  const primary = themeColors.primary || '#3b82f6';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !postSlug) return;
    fetch('/api/blog/reactions?slug=' + postSlug + '&user_id=' + userId)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const c: Record<string, number> = {};
          (d.counts || []).forEach((item: any) => { c[item.reaction_type] = item.count; });
          setCounts(c);
          setUserReactions(d.userReactions || []);
        }
        setLoading(false);
      });
  }, [mounted, postSlug, userId]);

  const toggleReaction = async (type: string) => {
    const res = await fetch('/api/blog/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: postSlug, reaction_type: type, user_id: userId }),
    });
    const data = await res.json();
    if (data.success) {
      const c: Record<string, number> = {};
      (data.counts || []).forEach((item: any) => { c[item.reaction_type] = item.count; });
      setCounts(c);
      setUserReactions(data.userReactions || []);
    }
  };

  if (!mounted || loading) return null;

  const reactions = [
    { type: 'like', icon: ThumbsUp, label: 'Like', activeColor: '#3b82f6' },
    { type: 'love', icon: Heart, label: 'Love', activeColor: '#ef4444' },
    { type: 'helpful', icon: CheckCircle, label: 'Helpful', activeColor: '#10b981' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', activeColor: '#f59e0b' },
    { type: 'dislike', icon: ThumbsDown, label: 'Dislike', activeColor: '#94a3b8' },
    { type: 'not_helpful', icon: XCircle, label: 'Not Helpful', activeColor: '#ef4444' },
  ];

  const labels: Record<string, any> = {
    en: { reactions: 'Reactions', comments: 'Comments', writeComment: 'Write a comment...', submit: 'Submit', name: 'Your Name', email: 'Email (optional)' },
    ur: { reactions: 'ری ایکشنز', comments: 'تبصرے', writeComment: 'تبصرہ لکھیں...', submit: 'جمع کریں', name: 'آپ کا نام', email: 'ای میل' },
    hi: { reactions: 'प्रतिक्रियाएं', comments: 'टिप्पणियाँ', writeComment: 'टिप्पणी लिखें...', submit: 'जमा करें', name: 'आपका नाम', email: 'ईमेल' },
    ar: { reactions: 'تفاعلات', comments: 'تعليقات', writeComment: 'اكتب تعليقاً...', submit: 'إرسال', name: 'اسمك', email: 'البريد' },
  };
  const l = labels[lang] || labels.en;

  return (
    <div style={{ fontFamily: themeColors.fontFamily }}>
      {/* Reaction Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '20px 0', borderTop: '1px solid ' + border, borderBottom: '1px solid ' + border, marginBottom: '20px', justifyContent: 'center' }}>
        {reactions.map(r => {
          const isActive = userReactions.includes(r.type);
          const count = counts[r.type] || 0;
          return (
            <button key={r.type} onClick={() => toggleReaction(r.type)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                borderRadius: '20px', border: '1.5px solid ' + (isActive ? r.activeColor : border),
                background: isActive ? r.activeColor + '15' : 'transparent',
                color: isActive ? r.activeColor : textSecondary,
                fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
              }}>
              <r.icon size={16} fill={isActive ? r.activeColor : 'none'} />
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Comment Form */}
      <div style={{ marginTop: '20px', padding: '20px', background: themeColors.surface || '#fff', borderRadius: '12px', border: '1px solid ' + border }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: themeColors.text?.primary, marginBottom: '12px' }}>💬 {l.comments}</h3>
        <input placeholder={l.name} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid ' + border, marginBottom: '8px', fontSize: '13px', background: 'transparent', color: themeColors.text?.primary }} />
        <textarea placeholder={l.writeComment} rows={3}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid ' + border, marginBottom: '8px', fontSize: '13px', resize: 'vertical', background: 'transparent', color: themeColors.text?.primary }} />
        <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: primary, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
          {l.submit}
        </button>
      </div>
    </div>
  );
}
