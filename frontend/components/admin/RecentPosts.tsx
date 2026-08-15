import Link from 'next/link';
import { Eye, Calendar, Edit } from 'lucide-react';

export default function RecentPosts({ posts }: { posts: any[] }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">Recent Posts</h2>
        <Link href="/admin/posts/new" className="text-sm text-primary font-medium hover:underline">
          + New Post
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}`}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {post.status}
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.viewCount || 0}
                </span>
              </div>
            </div>
            <Edit className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
