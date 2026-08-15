import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approvals | Centre.com.pk Admin',
  robots: 'noindex, nofollow',
};

export default function ApprovalsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Content Approvals</h1>
      <p className="text-muted-foreground">Manage pending content approvals here.</p>
    </div>
  );
}
