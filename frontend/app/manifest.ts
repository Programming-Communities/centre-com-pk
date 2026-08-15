// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Centre.com.pk - Free Online Tools',
    short_name: 'Centre.com.pk',
    description: 'Free online tools for developers, designers, and everyday users',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/android/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android/android-launchericon-512-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}