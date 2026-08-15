// lib/ads/adConfig.ts
// ✅ ONLY TOP BANNER ENABLED — Clean UI for better user experience

export interface AdTargeting {
  tools?: string[];
  categories?: string[];
  countries?: string[];
  devices?: ('mobile' | 'tablet' | 'desktop')[];
  userTypes?: ('free' | 'premium' | 'all')[];
}

export interface AdContent {
  imageUrl?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  htmlCode?: string;
  clientId?: string;
  clientName?: string;
  expiresAt?: string;
  impressionLimit?: number;
}

export interface AdConfig {
  id: string;
  type: 'google' | 'sponsor' | 'placeholder';
  position: 'top' | 'bottom' | 'sidebar-left' | 'sidebar-right' | 'in-content';
  size: 'banner' | 'rectangle' | 'skyscraper' | 'responsive';
  priority: number;
  content: AdContent;
  targeting?: AdTargeting;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ ONLY TOP BANNER ENABLED
const defaultPlaceholders: AdConfig[] = [
  {
    id: 'placeholder-top-banner',
    type: 'placeholder',
    position: 'top',
    size: 'banner',
    priority: 1,
    active: true, // ✅ ONLY THIS ONE IS ENABLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      title: 'Advertisement',
      description: 'Ad Space - 728x90',
      ctaText: 'Advertise',
      ctaUrl: '/advertise'
    }
  },
  {
    id: 'placeholder-bottom-banner',
    type: 'placeholder',
    position: 'bottom',
    size: 'banner',
    priority: 1,
    active: false, // ❌ DISABLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      title: 'Advertisement',
      description: 'Ad Space - 728x90',
      ctaText: 'Advertise',
      ctaUrl: '/advertise'
    }
  },
  {
    id: 'placeholder-sidebar-left',
    type: 'placeholder',
    position: 'sidebar-left',
    size: 'skyscraper',
    priority: 1,
    active: false, // ❌ DISABLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      title: 'Ad Space',
      description: '160x600',
      ctaText: 'Advertise',
      ctaUrl: '/advertise'
    }
  },
  {
    id: 'placeholder-sidebar-right',
    type: 'placeholder',
    position: 'sidebar-right',
    size: 'skyscraper',
    priority: 1,
    active: false, // ❌ DISABLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      title: 'Ad Space',
      description: '160x600',
      ctaText: 'Advertise',
      ctaUrl: '/advertise'
    }
  },
  {
    id: 'placeholder-in-content',
    type: 'placeholder',
    position: 'in-content',
    size: 'rectangle',
    priority: 1,
    active: false, // ❌ DISABLED
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      title: 'Advertisement',
      description: '300x250',
      ctaText: 'Advertise',
      ctaUrl: '/advertise'
    }
  }
];

// ✅ GOOGLE ADS - DISABLED UNTIL APPROVED
const googleAds: AdConfig[] = [
  {
    id: 'google-top-banner',
    type: 'google',
    position: 'top',
    size: 'banner',
    priority: 10,
    active: false, // ❌ DISABLED until approved
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      htmlCode: `
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-2850749507378090"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      `
    }
  }
];

// ❌ SPONSOR ADS - DISABLED
const sponsorAds: AdConfig[] = [];

// Combine all ads
export const adsConfig: AdConfig[] = [
  ...defaultPlaceholders,
  ...googleAds,
  ...sponsorAds
];

// Helper functions
export function getAdsForPosition(
  position: AdConfig['position'],
  toolSlug?: string,
  category?: string,
  device: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  country: string = 'US',
  userType: 'free' | 'premium' = 'free'
): AdConfig[] {
  const now = new Date();
  
  return adsConfig
    .filter(ad => {
      if (!ad.active) return false;
      if (ad.position !== position) return false;
      if (ad.content.expiresAt && new Date(ad.content.expiresAt) < now) return false;
      
      if (ad.targeting) {
        if (ad.targeting.tools && toolSlug && !ad.targeting.tools.includes(toolSlug)) return false;
        if (ad.targeting.categories && category && !ad.targeting.categories.includes(category)) return false;
        if (ad.targeting.devices && !ad.targeting.devices.includes(device)) return false;
        if (ad.targeting.countries && !ad.targeting.countries.includes(country)) return false;
        if (ad.targeting.userTypes && !ad.targeting.userTypes.includes(userType)) return false;
      }
      
      return true;
    })
    .sort((a, b) => b.priority - a.priority);
}

export function getAdForPosition(
  position: AdConfig['position'],
  toolSlug?: string,
  category?: string,
  device: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  country: string = 'US',
  userType: 'free' | 'premium' = 'free'
): AdConfig | null {
  const ads = getAdsForPosition(position, toolSlug, category, device, country, userType);
  return ads[0] || null;
}

export function isGoogleAdsEnabled(): boolean {
  return adsConfig.some(ad => ad.type === 'google' && ad.active);
}

export function getSponsorAds(): AdConfig[] {
  return adsConfig.filter(ad => ad.type === 'sponsor' && ad.active);
}

export function getPlaceholderAds(): AdConfig[] {
  return adsConfig.filter(ad => ad.type === 'placeholder' && ad.active);
}

export function addSponsorAd(ad: Omit<AdConfig, 'id' | 'createdAt' | 'updatedAt'>): AdConfig {
  const newAd: AdConfig = {
    ...ad,
    id: `sponsor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'sponsor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  adsConfig.push(newAd);
  return newAd;
}

export function updateAd(id: string, updates: Partial<AdConfig>): AdConfig | null {
  const index = adsConfig.findIndex(ad => ad.id === id);
  if (index === -1) return null;
  adsConfig[index] = { ...adsConfig[index], ...updates, updatedAt: new Date().toISOString() };
  return adsConfig[index];
}

export function deleteAd(id: string): boolean {
  const index = adsConfig.findIndex(ad => ad.id === id);
  if (index === -1) return false;
  adsConfig.splice(index, 1);
  return true;
}