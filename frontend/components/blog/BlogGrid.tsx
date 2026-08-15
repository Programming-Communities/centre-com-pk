import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: any[];
  lang: string;
  columns?: 2 | 3 | 4;
}

export default function BlogGrid({ posts, lang, columns = 3 }: BlogGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} lang={lang} />
      ))}
    </div>
  );
}
