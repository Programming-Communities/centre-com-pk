'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';

interface Comment {
  id: number;
  post_id: number;
  user_id: number | null;
  parent_id: number | null;
  content: string;
  status: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: number;
  lang: string;
  userId?: number;
  userEmail?: string;
  userName?: string;
}

export default function CommentSection({ postId, lang, userId, userEmail, userName }: CommentSectionProps) {
  const { t } = useTranslation(lang);
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [guestName, setGuestName] = useState(userName || '');
  const [guestEmail, setGuestEmail] = useState(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/comments?postId=${postId}`);
      const data = await res.json();
      if (data.success) {
        // Build nested tree
        const tree = buildCommentTree(data.comments);
        setComments(tree);
      }
    } catch (e) {
      console.error('Failed to fetch comments:', e);
    } finally {
      setLoading(false);
    }
  };

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const map: Record<number, Comment> = {};
    const roots: Comment[] = [];

    // Initialize map
    flatComments.forEach((c) => {
      map[c.id] = { ...c, replies: [] };
    });

    // Build tree
    flatComments.forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies!.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        postId,
        content: newComment,
        parentId: replyTo,
      };

      if (userId) {
        payload.userId = userId;
      } else {
        payload.name = guestName;
        payload.email = guestEmail;
      }

      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setNewComment('');
        setReplyTo(null);
        fetchComments();
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (e) {
      console.error('Error posting comment:', e);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    setReplyContent('');
    // Scroll to comment form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ur' ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [localReply, setLocalReply] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const handleSubmitReply = async () => {
      if (!localReply.trim()) return;
      setSubmittingReply(true);
      try {
        const payload: any = {
          postId,
          content: localReply,
          parentId: comment.id,
        };

        if (userId) {
          payload.userId = userId;
        } else {
          payload.name = guestName;
          payload.email = guestEmail;
        }

        const res = await fetch('/api/blog/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          setLocalReply('');
          setShowReplyForm(false);
          fetchComments();
        } else {
          alert(data.error || 'Failed to post reply');
        }
      } catch (e) {
        console.error('Error posting reply:', e);
        alert('Failed to post reply. Please try again.');
      } finally {
        setSubmittingReply(false);
      }
    };

    return (
      <div className={`mb-6 ${depth > 0 ? 'ml-4 md:ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4 md:pl-6' : ''}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {comment.user?.avatar ? (
              <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-lg">
                {(comment.user?.name || comment.guest_name || 'A')[0].toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {comment.user?.name || comment.guest_name || 'Anonymous'}
              </span>
              {comment.user?.id && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  {comment.user.id === userId ? 'You' : ''}
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(comment.created_at)}
              </span>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {comment.content}
            </div>

            {/* Actions */}
            <div className="flex gap-4 text-xs">
              <button
                onClick={() => handleReply(comment.id)}
                className="text-primary hover:underline"
              >
                Reply
              </button>
              {comment.user_id === userId && (
                <button className="text-red-500 hover:underline">Delete</button>
              )}
            </div>

            {/* Reply form (inline) */}
            {showReplyForm && (
              <div className="mt-3">
                <textarea
                  value={localReply}
                  onChange={(e) => setLocalReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitReply}
                    disabled={submittingReply || !localReply.trim()}
                    className="px-3 py-1 bg-primary text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {submittingReply ? 'Posting...' : 'Post Reply'}
                  </button>
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3 className="text-2xl font-bold mb-6">{t('comments.title') || 'Comments'}</h3>

      {/* Comment Form */}
      <div id="comment-form" className="mb-8">
        <form onSubmit={handleSubmitComment} className="space-y-3">
          {!userId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t('comments.name') || 'Your name'}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                required
              />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={t('comments.email') || 'Your email'}
                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                required
              />
            </div>
          )}
          
          <textarea
            value={replyTo ? replyContent : newComment}
            onChange={(e) => replyTo ? setReplyContent(e.target.value) : setNewComment(e.target.value)}
            placeholder={
              replyTo 
                ? t('comments.reply_placeholder') || 'Write a reply...'
                : t('comments.placeholder') || 'Share your thoughts...'
            }
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[100px]"
            required
          />
          
          {replyTo && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Replying to comment</span>
              <button onClick={cancelReply} className="text-red-500 hover:underline">Cancel</button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting 
              ? (t('comments.posting') || 'Posting...') 
              : (replyTo 
                  ? (t('comments.post_reply') || 'Post Reply') 
                  : (t('comments.post_comment') || 'Post Comment')
                )
            }
          </button>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {t('comments.no_comments') || 'No comments yet. Be the first!'}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
