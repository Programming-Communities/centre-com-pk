'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import BlogEditor from '@/components/blog/editor/BlogEditor';
import SEOPanel from '@/components/blog/seo/SEOPanel';
import PublishPanel from '@/components/blog/publishing/PublishPanel';

interface EditPostClientProps {
  lang: string;
  postId: string;
  initialData?: any;
}

export default function EditPostClient({ lang, postId, initialData }: EditPostClientProps) {
  const { t } = useTranslation(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(!initialData);
  const [post, setPost] = useState(initialData || null);
  const [content, setContent] = useState(initialData?.content || '');
  const [seoData, setSeoData] = useState({
    title: initialData?.seo_title || '',
    description: initialData?.seo_description || '',
    keywords: initialData?.seo_keywords || '',
    focusKeyword: '',
  });
  const [publishData, setPublishData] = useState({
    status: initialData?.status || 'draft',
    publishedAt: initialData?.published_at || null,
  });

  useEffect(() => {
    if (!initialData) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog?id=${postId}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setContent(data.post.content || '');
        setSeoData({
          title: data.post.seo_title || '',
          description: data.post.seo_description || '',
          keywords: data.post.seo_keywords || '',
          focusKeyword: '',
        });
        setPublishData({
          status: data.post.status || 'draft',
          publishedAt: data.post.published_at || null,
        });
      }
    } catch (e) {
      console.error('Failed to fetch post:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title: post?.title || '',
          slug: post?.slug || '',
          content,
          excerpt: post?.excerpt || '',
          category: post?.category || 'general',
          status: publishData.status,
          featured_image: post?.featured_image || '',
          seo_title: seoData.title,
          seo_description: seoData.description,
          seo_keywords: seoData.keywords,
          translations: post?.translations || null,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert('Post saved successfully!');
        router.push(`/${lang}/admin/posts`);
      } else {
        alert(data.error || 'Failed to save post');
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Failed to save post');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading post...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <button
          onClick={() => router.push(`/${lang}/admin/posts`)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          Back to Posts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <input
              type="text"
              value={post?.title || ''}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Post Title"
              className="w-full text-2xl font-bold bg-transparent border-b border-gray-200 dark:border-gray-700 pb-2 focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <BlogEditor
              content={content}
              onChange={setContent}
              lang={lang}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <PublishPanel
              status={publishData.status}
              publishedAt={publishData.publishedAt}
              onChange={(data) => setPublishData({ ...publishData, ...data })}
              onSave={handleSave}
              lang={lang}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <SEOPanel
              data={seoData}
              onChange={setSeoData}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
