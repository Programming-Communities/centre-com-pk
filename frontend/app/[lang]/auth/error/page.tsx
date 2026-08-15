import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication Error | Centre.com.pk',
  robots: 'noindex, nofollow',
};

export default function AuthErrorPage({ 
  searchParams 
}: { 
  searchParams: { error?: string } 
}) {
  const errorMessages: Record<string, string> = {
    default: 'An error occurred during authentication. Please try again.',
    credentials: 'Invalid email or password. Please try again.',
    email: 'Invalid email address. Please try again.',
    verify: 'Email verification failed. Please request a new verification link.',
    otp: 'Invalid or expired OTP code. Please request a new one.',
    session: 'Your session has expired. Please sign in again.',
    server: 'Server error. Please try again later.',
  };

  const error = searchParams?.error || 'default';
  const message = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
