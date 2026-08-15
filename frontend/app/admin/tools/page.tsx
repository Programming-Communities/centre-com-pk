import { db } from '@/lib/db';
import { toolContent } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Wrench, Edit, Eye, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminToolsPage() {
  const tools = await db.select().from(toolContent).orderBy(desc(toolContent.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tool Content</h1>
          <p className="text-text-secondary mt-1">Manage long-form content for each tool (800+ words)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-secondary">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No tool content yet</p>
            <p className="text-sm">Content will appear here once added to tools</p>
          </div>
        )}
        
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/admin/tools/${tool.toolSlug}`}
            className="bg-surface border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {tool.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tool.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {tool.status}
              </span>
            </div>
            <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
              {tool.title || tool.toolSlug}
            </h3>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>🌐 {tool.lang}</span>
              <span>👁 {tool.viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <Edit className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
              <span className="text-sm text-text-secondary group-hover:text-primary transition-colors">Edit Content</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
