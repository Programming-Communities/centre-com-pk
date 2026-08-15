export const dynamic = 'force-dynamic';

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';


// Default color palette
const DEFAULT_COLOR = {
  primary: '#2563EB',
  bg: '#F0F7FF',
  text: '#1E293B'
};

// ✅ Language display names for badge
const LANG_NAMES: Record<string, string> = {
  en: 'English',
  ur: 'اردو',
  hi: 'हिन्दी',
  ar: 'العربية',
};

// ✅ Language-specific colors
const LANG_COLORS: Record<string, string> = {
  en: '#2563eb', // English - Blue
  ur: '#059669', // Urdu - Green
  hi: '#ea580c', // Hindi - Orange
  ar: '#7c3aed', // Arabic - Purple
};

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Helper function to capitalize words
function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ✅ Get language parameter from URL
    const lang = searchParams.get('lang') || 'en';
    const langDisplay = LANG_NAMES[lang] || 'English';
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'Centre.com.pk - Free Online Tools';
    const description = searchParams.get('description') || 'Professional online tools for everyone';
    const toolName = searchParams.get('toolName') || '';
    const category = searchParams.get('category') || '';

    // Optional dynamic color parameter - use lang-specific color if available
    const colorParam = searchParams.get('color') || LANG_COLORS[lang] || DEFAULT_COLOR.primary;
    const colors = {
      primary: colorParam,
      bg: '#F0F7FF',
      text: '#1E293B'
    };

    // Process and truncate text
    const displayTitle = toolName 
      ? truncateText(toolName, 60) 
      : truncateText(title, 60);
      
    const displayDescription = category 
      ? truncateText(`${description} | Category: ${capitalizeWords(category.replace(/-/g, ' '))}`, 120)
      : truncateText(description, 120);

    // Create the React element structure
    const element = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: colors.bg,
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        },
        children: [
          // ✅ LANGUAGE BADGE - Positioned at top right
          {
            type: 'div',
            key: 'lang-badge',
            props: {
              style: {
                position: 'absolute',
                top: '40px',
                right: '60px',
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                padding: '8px 20px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '600',
                border: `2px solid ${colors.primary}40`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              },
              children: `🌐 ${langDisplay}`
            }
          },

          // Logo Section
          {
            type: 'div',
            key: 'logo',
            props: {
              style: { 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '40px' 
              },
              children: [
                {
                  type: 'div',
                  key: 'logo-icon',
                  props: {
                    style: {
                      width: '60px',
                      height: '60px',
                      backgroundColor: colors.primary,
                      borderRadius: '12px',
                      marginRight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    children: 'C'
                  }
                },
                {
                  type: 'span',
                  key: 'logo-text',
                  props: {
                    style: { 
                      fontSize: '36px', 
                      fontWeight: 'bold', 
                      color: colors.primary,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    },
                    children: 'Centre.com.pk'
                  }
                }
              ]
            }
          },

          // Category Badge (if category provided)
          category ? {
            type: 'div',
            key: 'category-badge',
            props: {
              style: {
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                padding: '8px 24px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '30px',
                textTransform: 'uppercase' as const,
                letterSpacing: '2px',
                border: `1px solid ${colors.primary}40`,
              },
              children: capitalizeWords(category.replace(/-/g, ' '))
            }
          } : null,

          // Main Title
          {
            type: 'div',
            key: 'title',
            props: {
              style: {
                fontSize: toolName ? '52px' : '58px',
                fontWeight: 'bold',
                color: colors.text,
                textAlign: 'center' as const,
                marginBottom: '20px',
                lineHeight: 1.2,
                maxWidth: '1000px',
                padding: '0 20px',
              },
              children: displayTitle
            }
          },

          // Description
          {
            type: 'div',
            key: 'description',
            props: {
              style: {
                fontSize: '28px',
                color: colors.text,
                opacity: 0.8,
                textAlign: 'center' as const,
                marginBottom: '40px',
                lineHeight: 1.4,
                maxWidth: '850px',
                padding: '0 20px',
              },
              children: displayDescription
            }
          },

          // Tool Info Badge (if toolName provided)
          toolName ? {
            type: 'div',
            key: 'tool-info',
            props: {
              style: {
                backgroundColor: colors.text,
                color: colors.bg,
                padding: '12px 24px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              children: `🛠️ Free Online Tool`
            }
          } : null,

          // Features List
          {
            type: 'div',
            key: 'features',
            props: {
              style: {
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
              },
              children: [
                {
                  type: 'div',
                  key: 'feature-1',
                  props: {
                    style: {
                      backgroundColor: `${colors.primary}15`,
                      color: colors.text,
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: `1px solid ${colors.primary}30`,
                    },
                    children: '✓ 100% Free'
                  }
                },
                {
                  type: 'div',
                  key: 'feature-2',
                  props: {
                    style: {
                      backgroundColor: `${colors.primary}15`,
                      color: colors.text,
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: `1px solid ${colors.primary}30`,
                    },
                    children: '✓ No Registration'
                  }
                },
                {
                  type: 'div',
                  key: 'feature-3',
                  props: {
                    style: {
                      backgroundColor: `${colors.primary}15`,
                      color: colors.text,
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: `1px solid ${colors.primary}30`,
                    },
                    children: '✓ Instant Access'
                  }
                }
              ]
            }
          },

          // URL Footer
          {
            type: 'div',
            key: 'footer',
            props: {
              style: {
                position: 'absolute' as const,
                bottom: '40px',
                fontSize: '22px',
                color: colors.text,
                opacity: 0.5,
                fontWeight: '500',
              },
              children: 'centre.com.pk'
            }
          }
        ].filter(Boolean)
      }
    };

    return new ImageResponse(element as any, {
      width: 1200,
      height: 630,
    });
  } catch (error: any) {
    console.error('OG Image Generation Error:', error);
    return new Response(`Failed to generate the image: ${error.message}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
