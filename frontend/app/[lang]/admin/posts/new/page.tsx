import { Metadata } from 'next';
import NewPostClient from './NewPostClient';

export const metadata: Metadata = { title: 'Create New Post - Admin | Centre.com.pk' };

export default async function NewPostPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  return <NewPostClient lang={lang} />;
}
