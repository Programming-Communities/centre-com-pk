// app/[lang]/admin/tools-manager/create/page.tsx
import { Metadata } from 'next';
import ToolCreator from '@/components/admin/tools/ToolCreator';

export const metadata: Metadata = {
  title: 'Create New Tool - Admin',
  robots: 'noindex, nofollow',
};

export default function CreateToolPage() {
  return <ToolCreator />;
}