import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold mb-4 text-blue-600 dark:text-blue-400">404</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all"
          >
            <Search className="w-5 h-5" /> Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
