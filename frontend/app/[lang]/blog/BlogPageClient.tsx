'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Search, Grid3X3, List, Clock, Eye, Heart, ArrowUpRight, 
  Sparkles, TrendingUp, Filter, X, ThumbsUp, BookOpen, 
  ChevronDown, SlidersHorizontal, Bookmark, Share2, Loader2
} from 'lucide-react';
import InlineLoader from '@/components/ui/InlineLoader';

interface BlogPost {
  id: string; tool_slug: string; tool_name: string; category: string;
  lang: string; title: string; slug: string; excerpt: string;
  content: string; image_url: string; author: string;
  is_featured: number; views: number; likes: number; read_time: number;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  'calculators': '#3b82f6', 'image-tools': '#8b5cf6', 'pdf-tools': '#ef4444',
  'code-tools': '#10b981', 'text-tools': '#f59e0b', 'security-tools': '#f97316',
  'design-tools': '#ec4899'
};

export default function BlogPageClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSort, setActiveSort] = useState<'latest' | 'popular' | 'helpful' | 'trending'>('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === 'ur' || lang === 'ar';

  const bg = themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors.primary || '#3b82f6';

  const labels: Record<string, any> = {
    en: { hero: 'Blog & Guides', heroSub: 'Expert tips, tutorials & guides', search: 'Search articles...', all: 'All', latest: 'Latest', popular: 'Popular', helpful: 'Most Helpful', trending: 'Trending', readMore: 'Read Article', noPosts: 'No posts found. Check back soon!', readTime: 'min read', loading: 'Loading more posts...' },
    ur: { hero: 'بلاگ', heroSub: 'ٹپس اور گائیڈز', search: 'تلاش کریں...', all: 'تمام', latest: 'تازہ', popular: 'مقبول', helpful: 'مددگار', trending: 'ٹرینڈنگ', readMore: 'مزید', noPosts: 'کوئی پوسٹ نہیں', readTime: 'منٹ', loading: 'مزید لوڈ...' },
    hi: { hero: 'ब्लॉग', heroSub: 'टिप्स और गाइड', search: 'खोजें...', all: 'सभी', latest: 'नवीनतम', popular: 'लोकप्रिय', helpful: 'सहायक', trending: 'ट्रेंडिंग', readMore: 'और पढ़ें', noPosts: 'कोई पोस्ट नहीं', readTime: 'मिनट', loading: 'लोड हो रहा...' },
    ar: { hero: 'المدونة', heroSub: 'نصائح وأدلة', search: 'بحث...', all: 'الكل', latest: 'الأحدث', popular: 'شائع', helpful: 'مفيد', trending: 'رائج', readMore: 'اقرأ', noPosts: 'لا منشورات', readTime: 'دقائق', loading: 'جاري التحميل...' },
  };
  const l = labels[lang] || labels.en;

  const categories = ['all', 'calculators', 'image-tools', 'pdf-tools', 'code-tools', 'text-tools', 'security-tools', 'design-tools'];
  const catLabels: Record<string, Record<string, string>> = {
    en: { all: 'All', 'calculators': 'Calculators', 'image-tools': 'Image', 'pdf-tools': 'PDF', 'code-tools': 'Code', 'text-tools': 'Text', 'security-tools': 'Security', 'design-tools': 'Design' },
    ur: { all: 'تمام', 'calculators': 'کیلکولیٹر', 'image-tools': 'تصاویر', 'pdf-tools': 'PDF', 'code-tools': 'کوڈ', 'text-tools': 'ٹیکسٹ', 'security-tools': 'سیکیورٹی', 'design-tools': 'ڈیزائن' },
    hi: { all: 'सभी', 'calculators': 'कैलकुलेटर', 'image-tools': 'इमेज', 'pdf-tools': 'PDF', 'code-tools': 'कोड', 'text-tools': 'टेक्स्ट', 'security-tools': 'सिक्योरिटी', 'design-tools': 'डिज़ाइन' },
    ar: { all: 'الكل', 'calculators': 'حاسبة', 'image-tools': 'صور', 'pdf-tools': 'PDF', 'code-tools': 'برمجة', 'text-tools': 'نصوص', 'security-tools': 'أمان', 'design-tools': 'تصميم' },
  };

  const getCatLabel = (cat: string) => catLabels[lang]?.[cat] || catLabels.en[cat] || cat;

  const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ lang, page: String(pageNum), limit: '9' });
      if (activeCategory) params.set('category', activeCategory);
      if (search) params.set('search', search);
      if (activeSort === 'popular') params.set('sort', 'views');
      if (activeSort === 'helpful') params.set('sort', 'helpful');

      const res = await fetch('/api/blog?' + params.toString());
      const data = await res.json();
      
      if (data.success) {
        if (append) {
          setPosts(prev => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(data.posts.length === 9);
      }
    } catch (err) { console.error(err); }
    
    setLoading(false);
    setLoadingMore(false);
  }, [lang, activeCategory, search, activeSort]);

  useEffect(() => { setPage(1); fetchPosts(1, false); }, [fetchPosts]);

  // Infinite Scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setPage(prev => {
          const next = prev + 1;
          fetchPosts(next, true);
          return next;
        });
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, fetchPosts]);

  const toggleBookmark = (slug: string) => {
    setBookmarkedPosts(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const sharePost = (slug: string, title: string) => {
    const url = window.location.origin + '/' + lang + '/blog/' + slug;
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: themeColors.fontFamily }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, ' + primary + '08, ' + (themeColors.secondary || '#7c3aed') + '08)', borderBottom: '1px solid ' + border, padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: primary + '15', padding: '6px 16px', borderRadius: '20px', marginBottom: '20px' }}>
            <Sparkles size={16} color={primary} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: primary }}>50+ Free Tools</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>📝 {l.hero}</h1>
          <p style={{ fontSize: '18px', color: textSecondary, margin: '0 0 30px' }}>{l.heroSub}</p>
          
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input type="text" placeholder={l.search} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '16px 50px', fontSize: '15px', borderRadius: '12px', border: '2px solid ' + border, backgroundColor: surface, color: textPrimary, boxSizing: 'border-box' }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}><X size={18} /></button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat === 'all' ? '' : cat); setPage(1); }}
              style={{ padding: '10px 18px', borderRadius: '10px', border: '1.5px solid ' + ((cat === 'all' && !activeCategory) || activeCategory === cat ? (categoryColors[cat] || primary) : border), backgroundColor: ((cat === 'all' && !activeCategory) || activeCategory === cat) ? (categoryColors[cat] || primary) + '15' : surface, color: ((cat === 'all' && !activeCategory) || activeCategory === cat) ? (categoryColors[cat] || primary) : textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              {cat !== 'all' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: categoryColors[cat] || '#999', display: 'inline-block', marginRight: '6px' }} />}
              {getCatLabel(cat)}
            </button>
          ))}
        </div>

        {/* Sort + View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['latest', 'popular', 'helpful', 'trending'] as const).map(s => (
              <button key={s} onClick={() => { setActiveSort(s); setPage(1); }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid ' + (activeSort === s ? primary : border), backgroundColor: activeSort === s ? primary + '15' : surface, color: activeSort === s ? primary : textSecondary, fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {s === 'latest' && <Clock size={14} />}
                {s === 'popular' && <TrendingUp size={14} />}
                {s === 'helpful' && <ThumbsUp size={14} />}
                {s === 'trending' && <Sparkles size={14} />}
                {l[s]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: surface, borderRadius: '8px', padding: '3px', border: '1px solid ' + border }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'grid' ? primary + '20' : 'transparent', color: viewMode === 'grid' ? primary : textSecondary, cursor: 'pointer' }}><Grid3X3 size={18} /></button>
            <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'list' ? primary + '20' : 'transparent', color: viewMode === 'list' ? primary : textSecondary, cursor: 'pointer' }}><List size={18} /></button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <InlineLoader size="lg" text="Loading posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: textPrimary, marginBottom: '8px' }}>{l.noPosts}</h3>
          </div>
        ) : (
          <>
            <div style={viewMode === 'grid' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' } : { display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posts.map(post => (
                <div key={post.id} style={{ position: 'relative' }}>
                  <Link href={'/' + lang + '/blog/' + post.slug} style={{ textDecoration: 'none' }}>
                    <div style={{
                      backgroundColor: surface, borderRadius: '12px', overflow: 'hidden',
                      border: '1px solid ' + border, transition: 'transform 0.2s, box-shadow 0.2s',
                      display: viewMode === 'list' ? 'flex' : 'block',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      {/* Image */}
                      <div style={{
                        height: viewMode === 'list' ? '180px' : '200px',
                        width: viewMode === 'list' ? '280px' : '100%', flexShrink: 0,
                        background: post.image_url ? 'url(' + post.image_url + ') center/cover' : 'linear-gradient(135deg, ' + (categoryColors[post.category] || primary) + ', ' + (themeColors.secondary || '#7c3aed') + ')',
                        position: 'relative'
                      }}>
                        {post.is_featured === 1 && (
                          <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '6px', backgroundColor: '#fbbf24', color: '#000', fontSize: '11px', fontWeight: 700 }}>⭐ Featured</span>
                        )}
                        {/* Hover Preview */}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                          <p style={{ color: '#fff', fontSize: '13px', textAlign: 'center', lineHeight: 1.5 }}>{post.excerpt}</p>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div style={{ padding: '20px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: (categoryColors[post.category] || primary) + '15', color: categoryColors[post.category] || primary }}>
                            {getCatLabel(post.category)}
                          </span>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: textSecondary, background: isDarkMode ? '#334155' : '#f1f5f9', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={10} /> {post.read_time || 5}{l.readTime}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: textPrimary, marginBottom: '8px', lineHeight: 1.3 }}>{post.title}</h3>
                        <p style={{ fontSize: '13px', color: textSecondary, marginBottom: '12px', lineHeight: 1.5 }}>{post.excerpt?.substring(0, 120)}...</p>
                        
                        {/* Stats */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: textSecondary, borderTop: '1px solid ' + border, paddingTop: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <span title="Views"><Eye size={12} style={{ marginRight: '3px', display: 'inline' }} />{post.views || 0}</span>
                            <span title="Likes"><Heart size={12} style={{ marginRight: '3px', display: 'inline' }} />{post.likes || 0}</span>
                            <span title="Read Time">⏱️ {post.read_time || 5}m</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={(e) => { e.preventDefault(); toggleBookmark(post.slug); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                              title="Bookmark">
                              <Bookmark size={14} fill={bookmarkedPosts.includes(post.slug) ? primary : 'none'} color={bookmarkedPosts.includes(post.slug) ? primary : textSecondary} />
                            </button>
                            <button onClick={(e) => { e.preventDefault(); sharePost(post.slug, post.title); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                              title="Share">
                              <Share2 size={14} color={textSecondary} />
                            </button>
                            <span style={{ color: primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {l.readMore} <ArrowUpRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '40px 0' }}>
              {loadingMore && <InlineLoader text={l.loading} />}
              {!hasMore && posts.length > 0 && (
                <p style={{ color: textSecondary, fontSize: '13px' }}>— You've reached the end —</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
