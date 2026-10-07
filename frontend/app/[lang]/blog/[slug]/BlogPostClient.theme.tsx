'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronRight, Clock, Eye, Heart, MessageCircle,
  Share2, Bookmark, ThumbsUp, ThumbsDown, Lightbulb, CheckCircle,
  XCircle, Printer, Copy, Check, List, ChevronDown, ChevronUp,
  Facebook, Twitter, Linkedin, Globe
} from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { sanitizeHtml } from '@/lib/sanitize';

export default function BlogPostClient(props: any) {
  const {
    post, lang, htmlContent, relatedPosts, translations, headings,
    likeCount: initLikes, reactionCounts: initReactions,
    commentCount: initComments, comments: initCommentsList,
    sessionUser, readTime, displayViews, authorName, categoryCount
  } = props;
  
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initLikes);
  const [reactions, setReactions] = useState<Record<string, number>>(initReactions || {});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTOC, setShowTOC] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(17);
  const [userId] = useState(() => 'u_' + Math.random().toString(36).substring(2, 10));
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';
  const isRTL = lang === 'ur' || lang === 'ar';
  
  useEffect(() => { setMounted(true); }, []);
  
  // Load user reactions from DB
  useEffect(() => {
    if (!mounted) return;
    fetch(`/api/blog/reactions?slug=${post.slug}&user_id=${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setUserReactions(d.userReactions || []);
          const c: Record<string, number> = {};
          (d.counts || []).forEach((x: any) => { c[x.reaction_type] = x.count; });
          setReactions(c);
        }
      })
      .catch(() => {});
  }, [mounted, post.slug, userId]);
  
  // Reading progress
  useEffect(() => {
    const h = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(dh > 0 ? Math.round((st / dh) * 100) : 0);
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  
  const toggleReaction = async (type: string) => {
    const r = await fetch('/api/blog/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: post.slug, reaction_type: type, user_id: userId })
    });
    const d = await r.json();
    if (d.success) {
      setUserReactions(d.userReactions || []);
      const c: Record<string, number> = {};
      (d.counts || []).forEach((x: any) => { c[x.reaction_type] = x.count; });
      setReactions(c);
    }
  };
  
  const toggleLike = async () => {
    const r = await fetch('/api/blog/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postSlug: post.slug, userId })
    });
    const d = await r.json();
    if (d.success) { setLiked(d.liked); setLikes(d.likes); }
  };
  
  const toggleBookmark = async () => {
    const r = await fetch('/api/blog/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postSlug: post.slug, userId })
    });
    const d = await r.json();
    if (d.success) setBookmarked(d.bookmarked);
  };
  
  const submitComment = async () => {
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    const r = await fetch('/api/blog/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: post.id,
        content: commentText,
        name: commentName || 'Guest',
        email: commentEmail,
        userId: sessionUser?.userId
      })
    });
    const d = await r.json();
    if (d.success) {
      setCommentText('');
      setCommentName('');
      setCommentEmail('');
      // Reload page to show new comment
      window.location.reload();
    }
    setSubmittingComment(false);
  };
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }
  
  const REACTIONS = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: '#3b82f6' },
    { type: 'love', icon: Heart, label: 'Love', color: '#ef4444' },
    { type: 'helpful', icon: CheckCircle, label: 'Helpful', color: '#10b981' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: '#f59e0b' },
    { type: 'dislike', icon: ThumbsDown, label: 'Dislike', color: '#94a3b8' },
  ];
  
  return (
    <main style={{ backgroundColor: bg, fontFamily, minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Reading Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 9999, backgroundColor: border }}>
        <div style={{ height: '100%', width: `${readingProgress}%`, backgroundColor: primary, transition: 'width 0.1s' }} />
      </div>
      
      {/* Top Action Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: surface, borderBottom: `1px solid ${border}`, padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <Link href={`/${lang}/blog`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: textSecondary, textDecoration: 'none', fontSize: '13px' }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setFontSize(s => Math.min(22, s + 1))} style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${border}`, background: 'transparent', color: textSecondary, cursor: 'pointer', fontSize: '12px' }}>A+</button>
          <button onClick={() => setFontSize(s => Math.max(14, s - 1))} style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${border}`, background: 'transparent', color: textSecondary, cursor: 'pointer', fontSize: '12px' }}>A-</button>
          <button onClick={() => window.print()} style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${border}`, background: 'transparent', color: textSecondary, cursor: 'pointer' }}><Printer size={14} /></button>
          <button onClick={copyUrl} style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${border}`, background: 'transparent', color: copied ? '#10b981' : textSecondary, cursor: 'pointer' }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
        </div>
      </div>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 100px' }}>
        
        {/* Breadcrumbs */}
        <nav style={{ padding: '16px 0', fontSize: '12px', color: textSecondary, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Link href={`/${lang}`} style={{ color: textSecondary, textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={10} style={{ display: 'inline', margin: '0 4px' }} />
          <Link href={`/${lang}/blog`} style={{ color: textSecondary, textDecoration: 'none' }}>Blog</Link>
          {post.category && (
            <>
              <ChevronRight size={10} style={{ display: 'inline', margin: '0 4px' }} />
              <Link href={`/${lang}/blog?category=${post.category}`} style={{ color: textSecondary, textDecoration: 'none' }}>{post.category.replace(/-/g, ' ').toUpperCase()}</Link>
            </>
          )}
          <ChevronRight size={10} style={{ display: 'inline', margin: '0 4px' }} />
          <span style={{ color: primary }}>{post.title.substring(0, 50)}...</span>
        </nav>
        
        {/* Category Badge */}
        {post.category && (
          <Link href={`/${lang}/blog?category=${post.category}`} style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: primary + '15', color: primary, textDecoration: 'none', marginBottom: '16px' }}>
            {post.category.replace(/-/g, ' ').toUpperCase()} ({categoryCount} articles)
          </Link>
        )}
        
        {/* Title */}
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: textPrimary, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px' }}>
          {post.title}
        </h1>
        
        {/* Meta Bar */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', fontSize: '13px', color: textSecondary, marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${border}` }}>
          <span>✍️ {authorName}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {readTime} min read</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {displayViews} views</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={14} /> {initComments} comments</span>
        </div>
        
        {/* Language Switcher */}
        {translations.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${border}`, backgroundColor: surface, flexWrap: 'wrap' }}>
            <Globe size={14} style={{ color: textSecondary }} />
            {translations.map((t: any) => (
              <a key={t.lang} href={`/${t.lang}/blog/${t.slug}`} style={{
                padding: '4px 12px', borderRadius: '6px', fontSize: '12px',
                fontWeight: t.lang === lang ? 700 : 400,
                backgroundColor: t.lang === lang ? primary : 'transparent',
                color: t.lang === lang ? '#fff' : textSecondary,
                textDecoration: 'none',
                border: t.lang === lang ? 'none' : `1px solid ${border}`
              }}>
                {{ en: '🇬🇧 EN', ur: '🇵🇰 UR', hi: '🇮🇳 HI', ar: '🇸🇦 AR' }[t.lang] || t.lang.toUpperCase()}
              </a>
            ))}
          </div>
        )}
        
        {/* Table of Contents */}
        {headings.length > 2 && (
          <div style={{ border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', backgroundColor: surface }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowTOC(!showTOC)}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>
                <List size={16} style={{ display: 'inline', marginRight: '8px', color: primary }} />
                Table of Contents
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}>
                {showTOC ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
            {showTOC && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', borderTop: `1px solid ${border}`, paddingTop: '12px' }}>
                {headings.map((h: any) => (
                  <li key={h.id} style={{ padding: h.level === 3 ? '3px 0 3px 16px' : '5px 0', borderBottom: `1px solid ${border}10` }}>
                    <a href={`#${h.id}`} style={{ color: primary, textDecoration: 'none', fontSize: '13px' }}>{h.text}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Article Content */}
        <article style={{ fontSize: `${fontSize}px`, lineHeight: 1.9, color: textPrimary }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} />
        
        {/* Tool CTA */}
        {post.tool_slug && (
          <div style={{ marginTop: '32px', padding: '24px', borderRadius: '16px', textAlign: 'center', background: `linear-gradient(135deg, ${primary}10, ${primary}05)`, border: `2px solid ${primary}30` }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '8px' }}>
              Try the {post.tool_name || post.tool_slug.replace(/-/g, ' ')} Tool Now
            </h3>
            <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '16px' }}>
              Free, fast, accurate — no registration required.
            </p>
            <Link
              href={`/${lang}/tools/${post.category || 'calculators'}/${post.tool_slug}`}
              style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', backgroundColor: primary, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '16px' }}
            >
              Open {post.tool_name || 'Tool'} →
            </Link>
          </div>
        )}
        
        {/* Reactions Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '24px 0', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, marginTop: '32px' }}>
          {REACTIONS.map(r => {
            const isActive = userReactions.includes(r.type);
            const count = reactions[r.type] || 0;
            return (
              <button
                key={r.type}
                onClick={() => toggleReaction(r.type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', borderRadius: '24px',
                  border: `1.5px solid ${isActive ? r.color : border}`,
                  backgroundColor: isActive ? r.color + '15' : 'transparent',
                  color: isActive ? r.color : textSecondary,
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <r.icon size={16} fill={isActive ? r.color : 'none'} />
                <span>{r.label}</span>
                {count > 0 && (
                  <span style={{ backgroundColor: isActive ? r.color + '30' : border, padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Author Bio */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface, marginTop: '24px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `linear-gradient(135deg, ${primary}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '22px', flexShrink: 0 }}>
            {authorName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: textPrimary, fontSize: '15px' }}>{authorName}</div>
            <div style={{ fontSize: '13px', color: textSecondary }}>Content Team at Centre.com.pk — Free Online Tools Platform</div>
          </div>
        </div>
        
        {/* Share Bar */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', padding: '20px 0', marginTop: '16px', borderTop: `1px solid ${border}` }}>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ color: '#1DA1F2', padding: '10px', borderRadius: '50%', backgroundColor: '#1DA1F210' }}>
            <Twitter size={20} />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ color: '#1877F2', padding: '10px', borderRadius: '50%', backgroundColor: '#1877F210' }}>
            <Facebook size={20} />
          </a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ color: '#0A66C2', padding: '10px', borderRadius: '50%', backgroundColor: '#0A66C210' }}>
            <Linkedin size={20} />
          </a>
          <button onClick={copyUrl} style={{ color: copied ? '#10b981' : textSecondary, padding: '10px', borderRadius: '50%', border: `1px solid ${border}`, backgroundColor: 'transparent', cursor: 'pointer' }}>
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <button onClick={toggleBookmark} style={{ color: bookmarked ? primary : textSecondary, padding: '10px', borderRadius: '50%', border: `1px solid ${bookmarked ? primary : border}`, backgroundColor: bookmarked ? primary + '15' : 'transparent', cursor: 'pointer' }}>
            <Bookmark size={20} fill={bookmarked ? primary : 'none'} />
          </button>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '16px' }}>📚 Related Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {relatedPosts.map((rp: any) => (
                <Link key={rp.id} href={`/${lang}/blog/${rp.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: surface, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${border}`, height: '100%' }}>
                    <div style={{ height: '100px', background: rp.featured_image ? `url(${rp.featured_image}) center/cover` : `linear-gradient(135deg, ${primary}, #7c3aed)` }} />
                    <div style={{ padding: '12px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, lineHeight: 1.3, margin: '0 0 4px' }}>{rp.title}</h3>
                      <span style={{ fontSize: '11px', color: textSecondary }}>{rp.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        <div style={{ marginTop: '32px', borderTop: `1px solid ${border}`, paddingTop: '24px' }}>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: textPrimary, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '16px' }}
          >
            <MessageCircle size={20} style={{ color: primary }} />
            Comments ({initComments})
            {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {showComments && (
            <div>
              {/* Comment Form */}
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
                {!sessionUser && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="Your Name"
                      style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: bg, color: textPrimary, fontSize: '13px', outline: 'none' }}
                    />
                    <input
                      value={commentEmail}
                      onChange={e => setCommentEmail(e.target.value)}
                      placeholder="Email"
                      style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: bg, color: textPrimary, fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${border}`, backgroundColor: bg, color: textPrimary, fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box', outline: 'none' }}
                />
                <button
                  onClick={submitComment}
                  disabled={submittingComment || !commentText.trim()}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: primary, color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: submittingComment ? 0.7 : 1 }}
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
              
              {/* Comments List */}
              {initCommentsList?.length === 0 ? (
                <p style={{ color: textSecondary, fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {initCommentsList?.map((c: any) => (
                    <div key={c.id} style={{ padding: '14px', borderRadius: '10px', border: `1px solid ${border}`, backgroundColor: surface }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: primary + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary, fontWeight: 600, fontSize: '14px' }}>
                          {(c.user_name || c.guest_name || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: textPrimary }}>{c.user_name || c.guest_name || 'Anonymous'}</div>
                          <div style={{ fontSize: '11px', color: textSecondary }}>{new Date(c.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: textPrimary, lineHeight: 1.6, margin: 0 }}>{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}