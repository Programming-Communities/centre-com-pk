import { User, Mail, Calendar } from 'lucide-react';

export default function RecentUsers({ users }: { users: any[] }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">Recent Users</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-secondary truncate">{user.email}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              user.plan === 'premium' || user.plan === 'lifetime' ? 'bg-purple-100 text-purple-600' :
              user.plan === 'pro' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {user.plan}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
