'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  Copy,
  Check
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.centre.com.pk';

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  compact?: boolean;
}

export default function ShareButtons({ 
  title: customTitle,
  description: customDescription,
  url: customUrl,
  compact = false
}: ShareButtonsProps) {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { t } = useTranslation({ namespace: 'common' });
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Auto-detect page info
  const detectPageInfo = () => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const path = pathname.toLowerCase();
    
    if (path.includes('/tools/')) {
      const pathParts = path.split('/').filter(Boolean);
      
      if (pathParts.length >= 3 && pathParts[1] === 'tools') {
        const category = pathParts[2];
        const toolSlug = pathParts[3] || '';
        
        // Convert slug to readable name
        const toolName = toolSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const categoryNames: Record<string, string> = {
          'calculators': t('calculators', 'Calculator'),
          'code-tools': t('code_tools', 'Code Tool'),
          'image-tools': t('image_tools', 'Image Tool'),
          'pdf-tools': t('pdf_tools', 'PDF Tool'),
          'text-tools': t('text_tools', 'Text Tool'),
          'security-tools': t('security_tools', 'Security Tool'),
          'design-tools': t('design_tools', 'Design Tool'),
        };
        
        const categoryName = categoryNames[category] || 'Tool';
        
        return {
          title: customTitle || `${toolName} - Free Online ${categoryName} | Centre.com.pk`,
          description: customDescription || `Use our free ${toolName.toLowerCase()} online. No registration required.`,
          url: customUrl || pathname,
        };
      }
    }
    
    return {
      title: customTitle || 'Centre.com.pk - Free Online Tools',
      description: customDescription || 'Professional online tools for everyone.',
      url: customUrl || pathname,
    };
  };
  
  const pageInfo = detectPageInfo();
  const finalTitle = pageInfo.title;
  const finalDescription = pageInfo.description;
  let finalUrl = pageInfo.url;
  
  if (finalUrl.startsWith('http')) {
    const urlObj = new URL(finalUrl);
    finalUrl = urlObj.pathname + urlObj.search;
  }
  
  if (!finalUrl.startsWith('/')) {
    finalUrl = '/' + finalUrl;
  }
  
  const fullShareUrl = `${SITE_URL}${finalUrl}`;
  const encodedTitle = encodeURIComponent(finalTitle);
  const encodedUrl = encodeURIComponent(fullShareUrl);
  const encodedDescription = encodeURIComponent(finalDescription);
  
  const socialLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=CentersPK`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    instagram: `https://instagram.com/centre.com.pk`,
    youtube: `https://youtube.com/@centre.com.pk`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${fullShareUrl}`
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = fullShareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  
  const openSocialPopup = (url: string, platform: string) => {
    const width = 600;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      url,
      `${platform}Share`,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };
  
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 bg-surface border border-border text-text-primary px-4 py-2 rounded-lg hover:bg-surface/80 transition-all"
          aria-label={t('share_title', 'Share')}
        >
          <Share2 className="h-4 w-4" />
          <span>{t('share_title', 'Share')}</span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-50 p-2 min-w-[200px]">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => openSocialPopup(socialLinks.whatsapp, 'WhatsApp')}
                className="p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
                title={t('share_on', 'Share on WhatsApp')}
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => openSocialPopup(socialLinks.facebook, 'Facebook')}
                className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                title={t('share_on', 'Share on Facebook')}
              >
                <Facebook className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => openSocialPopup(socialLinks.twitter, 'Twitter')}
                className="p-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center"
                title={t('share_on', 'Share on Twitter')}
              >
                <Twitter className="h-5 w-5" />
              </button>
              
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center col-span-3"
                title={t('copy_link', 'Copy link')}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    <span>{t('copied', 'Copied!')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    <span>{t('copy', 'Copy Link')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="share-section">
      <div className="p-4 bg-surface rounded-lg border border-border">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-text-primary flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5" />
            {t('share_title', 'Share This Tool')}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {t('share_description', 'Spread the word about this amazing tool!')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => openSocialPopup(socialLinks.whatsapp, 'WhatsApp')}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{t('whatsapp', 'WhatsApp')}</span>
          </button>
          
          <button
            onClick={() => openSocialPopup(socialLinks.facebook, 'Facebook')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Facebook className="h-5 w-5" />
            <span className="font-medium">{t('facebook', 'Facebook')}</span>
          </button>
          
          <button
            onClick={() => openSocialPopup(socialLinks.twitter, 'Twitter')}
            className="inline-flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Twitter className="h-5 w-5" />
            <span className="font-medium">{t('twitter', 'Twitter')}</span>
          </button>
          
          <button
            onClick={() => openSocialPopup(socialLinks.linkedin, 'LinkedIn')}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Linkedin className="h-5 w-5" />
            <span className="font-medium">{t('linkedin', 'LinkedIn')}</span>
          </button>
          
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Instagram className="h-5 w-5" />
            <span className="font-medium">{t('instagram', 'Instagram')}</span>
          </a>
          
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Youtube className="h-5 w-5" />
            <span className="font-medium">{t('youtube', 'YouTube')}</span>
          </a>
          
          <button
            onClick={() => window.location.href = socialLinks.email}
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[120px] justify-center"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">{t('email', 'Email')}</span>
          </button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm min-w-[200px] justify-center"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                <span className="font-medium">{t('copied', 'Link Copied!')}</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="font-medium">{t('copy_link', 'Copy Link')}</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-text-secondary">
            {t('share_url', 'Share URL')}: <span className="font-semibold text-primary">{t('clean_seo_friendly', 'Clean & SEO-friendly')}</span>
          </p>
          <div className="mt-1 text-xs text-text-secondary opacity-75">
            <code className="break-all bg-surface/50 px-2 py-1 rounded">
              {fullShareUrl}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}