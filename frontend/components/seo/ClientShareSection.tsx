'use client';

import { 
  Share2, 
  Link as LinkIcon, 
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Mail,
  Check
} from 'lucide-react';
import { useState } from 'react';

interface ClientShareSectionProps {
  title: string;
  description: string;
  category: string;
  tool: string;
}

export default function ClientShareSection({ 
  title, 
  description,
  category,
  tool
}: ClientShareSectionProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate share URL WITHOUT theme parameter
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.centre.com.pk'}/tools/${category}/${tool}`;
  
  const handleCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this ${title} tool!`)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this ${title}: ${shareUrl}`)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#6B7280',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this tool: ${shareUrl}`)}`
    }
  ];

  return (
    <div className="bg-linear-to-r from-primary/10 to-secondary/10 border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="md:w-2/3">
          <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share This Tool
          </h3>
          <p className="text-text-secondary mb-4">
            Share this {title.split('-')[0]} tool with others!
          </p>
          
          {/* Share URL Box */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-surface border border-border rounded-lg p-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-text-secondary" />
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm"
              />
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-border transition-colors"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-text-secondary hover:text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media Buttons */}
        <div className="md:w-1/3">
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {socialPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-lg hover:opacity-90 transition-opacity text-white"
                style={{ backgroundColor: platform.color }}
              >
                <platform.icon className="h-4 w-4" />
                <span className="hidden md:inline text-sm">{platform.name}</span>
              </a>
            ))}
            
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors col-span-3 md:col-span-2 lg:col-span-3"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="text-sm">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-primary">Clean Sharing:</span>{' '}
          Share this tool with others using clean, SEO-friendly URLs.
        </p>
      </div>
    </div>
  );
}