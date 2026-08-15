// lib/geo/geoService.ts
// Geo-location service for ad targeting

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

export interface GeoRadius {
  center: { lat: number; lng: number };
  radius: number; // in meters
}

export interface GeoAdTarget {
  type: 'country' | 'city' | 'state' | 'street' | 'radius';
  value: string;
  radius?: number;
  coordinates?: { lat: number; lng: number };
}

// Mock geolocation for development
export async function detectUserLocation(): Promise<GeoLocation> {
  // Try browser geolocation first
  if (typeof window !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000,
        });
      });

      // Get city/country from coordinates (using reverse geocoding)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
      );
      const data = await response.json();
      const address = data.address || {};

      return {
        ip: 'browser',
        country: address.country || 'Pakistan',
        countryCode: address.country_code?.toUpperCase() || 'PK',
        city: address.city || address.town || address.village || 'Lahore',
        region: address.state || 'Punjab',
        regionCode: '',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isp: 'Browser Geolocation',
      };
    } catch (err) {
      console.warn('Browser geolocation failed:', err);
    }
  }

  // Fallback: Use IP-based geolocation (mock for development)
  return {
    ip: '127.0.0.1',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    region: 'Punjab',
    regionCode: 'PB',
    latitude: 31.5204,
    longitude: 74.3587,
    timezone: 'Asia/Karachi',
    isp: 'Localhost',
  };
}

export function getLocationFromIP(ip: string): GeoLocation {
  // In production, use a service like ip-api.com or ipinfo.io
  // Mock implementation for development
  return {
    ip,
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Lahore',
    region: 'Punjab',
    regionCode: 'PB',
    latitude: 31.5204,
    longitude: 74.3587,
    timezone: 'Asia/Karachi',
    isp: 'Local',
  };
}

export function isInRadius(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMeters: number
): boolean {
  const R = 6371000; // Earth's radius in meters
  const dLat = (targetLat - userLat) * (Math.PI / 180);
  const dLng = (targetLng - userLng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLat * (Math.PI / 180)) *
      Math.cos(targetLat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance <= radiusMeters;
}

export function geoMatch(ad: any, userLocation: GeoLocation): boolean {
  if (!ad.target_country && !ad.target_city && !ad.target_radius) {
    return true; // No geo-targeting, show to everyone
  }

  // Country targeting
  if (ad.target_country) {
    const countries = ad.target_country.split(',').map((c: string) => c.trim().toUpperCase());
    if (!countries.includes(userLocation.countryCode)) {
      return false;
    }
  }

  // City targeting
  if (ad.target_city) {
    const cities = ad.target_city.split(',').map((c: string) => c.trim().toLowerCase());
    if (!cities.includes(userLocation.city.toLowerCase())) {
      return false;
    }
  }

  // State targeting
  if (ad.target_state) {
    const states = ad.target_state.split(',').map((s: string) => s.trim().toLowerCase());
    if (!states.includes(userLocation.region.toLowerCase())) {
      return false;
    }
  }

  // Radius targeting
  if (ad.target_radius && ad.target_lat && ad.target_lng) {
    const radiusMeters = parseInt(ad.target_radius) || 0;
    if (radiusMeters > 0) {
      const inRadius = isInRadius(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(ad.target_lat),
        parseFloat(ad.target_lng),
        radiusMeters
      );
      if (!inRadius) return false;
    }
  }

  // Street level targeting
  if (ad.target_street) {
    // In production, use a geocoding service to match street names
    // For now, just check if the street name appears in the location
    const street = ad.target_street.toLowerCase();
    const locationString = `${userLocation.city} ${userLocation.region} ${userLocation.country}`.toLowerCase();
    if (!locationString.includes(street)) {
      return false;
    }
  }

  return true;
}
