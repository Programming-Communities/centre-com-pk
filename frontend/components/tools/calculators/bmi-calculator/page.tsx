import { Metadata } from 'next';
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import BMICalculatorTool from './tool.client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('bmi-calculator');
  
  let translatedTitle = toolData.title;
  let translatedDescription = toolData.description;
  
  try {
    const translations = await import(`@/translations/${lang}/tools/calculators.json`)
      .then(module => module.default)
      .catch(() => null);
    
    if (translations && translations.bmi_calculator) {
      translatedTitle = translations.bmi_calculator.title || toolData.title;
      translatedDescription = translations.bmi_calculator.description || toolData.description;
    }
  } catch (e) {
    // Fallback to English
  }
  
  return {
    title: translatedTitle,
    description: translatedDescription,
    keywords: toolData.keywords,
    openGraph: {
      title: translatedTitle,
      description: translatedDescription,
      type: 'website',
    },
  };
}

export default function BMICalculatorPage() {
  return <BMICalculatorTool />;
}