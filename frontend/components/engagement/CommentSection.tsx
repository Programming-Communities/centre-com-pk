'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Send, User, ThumbsUp, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  userName: string;
  userAvatar: string | null;
  createdAt: string;
  userId: number;
}

export default function CommentSection({ postId }: { postId: number }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Please sign in to comment');
      return;
    }
    if (!comment.trim()) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: comment }),
      });
      
      if (res.ok) {
        setComment('');
        fetchComments();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    
    try {
      await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h3>
      
      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full p-3 rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-secondary resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-surface border border-border rounded-xl text-center">
          <p className="text-text-secondary">
            Please{' '}
            <Link href="/auth/signin" className="text-primary font-medium hover:underline">
              sign in
            </Link>{' '}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-text-secondary py-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 p-4 bg-surface border border-border rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {c.userAvatar ? (
                  <img src={c.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-text-primary">{c.userName}</span>
                  <span className="text-xs text-text-secondary">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-text-secondary">{c.content}</p>
                
                {session && (session.user as any)?.id === c.userId && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
