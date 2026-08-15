import Header from './Header';
import Footer from './Footer';
import AdPlaceholder from '../ui/AdPlaceholder';

interface LayoutProps {
  children: React.ReactNode;
  showAds?: boolean;
  lang: string;  // ✅ YEH ADD KARO!
}

export default function Layout({ children, showAds = true, lang }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ YEH DONO MAI lang PROP PASS KARO! */}
      <Header lang={lang} />
      
      <main className="grow">
        {/* Top Ad Banner */}
        {showAds && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <AdPlaceholder type="banner" />
            </div>
          </div>
        )}
        
        {children}
      </main>
      
      <Footer lang={lang} />
    </div>
  );
}