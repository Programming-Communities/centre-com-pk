
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Clock, User, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  
  try {
    const tutorialData = await import(`@/translations/${lang}/tutorials/${id}.json`)
      .then(module => module.default)
      .catch(() => null);
    
    if (tutorialData) {
      return {
        title: `${tutorialData.title} - Centre.com.pk Tutorial`,
        description: tutorialData.description,
      };
    }
  } catch (e) {
    // Fallback
  }
  
  return {
    title: 'Tutorial - Centre.com.pk',
    description: 'Detailed tutorial guide',
  };
}

interface TutorialPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function TutorialDetailPage({ params }: TutorialPageProps) {
  const { lang, id } = await params;
  
  let tutorialData = null;
  try {
    tutorialData = await import(`@/translations/${lang}/tutorials/${id}.json`)
      .then(module => module.default)
      .catch(() => null);
  } catch (e) {
    try {
      tutorialData = await import(`@/translations/en/tutorials/${id}.json`)
        .then(module => module.default)
        .catch(() => null);
    } catch (e2) {}
  }

  if (!tutorialData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href={`/${lang}/tutorial`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {tutorialData.back_button || 'Back to All Tutorials'}
        </Link>

        {/* Tutorial Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              {tutorialData.difficulty}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {tutorialData.duration}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-1" />
              {tutorialData.author}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{tutorialData.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{tutorialData.description}</p>
          
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-8">
            <button className="bg-white rounded-full p-6 hover:scale-110 transition-transform">
              <PlayCircle className="w-16 h-16 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{tutorialData.steps_title || 'Step-by-Step Guide'}</h2>
          </div>
          
          <ol className="space-y-6">
            {tutorialData.steps.map((step: string, index: number) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{tutorialData.step_prefix || 'Step'} {index + 1}</h3>
                  <p className="text-gray-600">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips Section */}
        {tutorialData.tips && tutorialData.tips.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">💡 {tutorialData.tips_title || 'Pro Tips'}</h3>
            <ul className="space-y-4">
              {tutorialData.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

// ❌ REMOVE THIS FUNCTION COMPLETELY
// export async function generateStaticParams() {
//   const languages = ['en', 'ur', 'hi', 'ar'];
//   const tutorialIds = ['1', '2', '3', '4', '5', '6'];
//   
//   const params = languages.flatMap(lang => 
//     tutorialIds.map(id => ({
//       lang,
//       id,
//     }))
//   );
//   
//   return params;
// }  export const runtime = 'edge';
