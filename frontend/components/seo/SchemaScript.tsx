// components/seo/SchemaScript.tsx
'use client';

import { SchemaScriptProps } from './types';

export default function SchemaScript({
  schema,
  type = 'application/ld+json',
  className = '',
}: SchemaScriptProps) {
  if (!schema) {
    return null;
  }

  // Handle array of schemas
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  return (
    <div className={`schema-scripts ${className}`}>
      {schemas.map((schemaData, index) => {
        // Skip empty schemas
        if (!schemaData || Object.keys(schemaData).length === 0) {
          return null;
        }

        return (
          <script
            key={index}
            type={type}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemaData, null, 2),
            }}
          />
        );
      })}
    </div>
  );
}

// Predefined schema components
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Centre.com.pk',
    alternateName: 'Free Online Tools',
    url: 'https://www.centre.com.pk',
    description: 'Free online tools for developers, designers, students, and professionals. Calculators, converters, formatters, and more!',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.centre.com.pk/search?q=',
      'query-input': 'required name=q',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Centre.com.pk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.centre.com.pk/logo.png',
        width: 512,
        height: 512,
      },
    },
  };

  return <SchemaScript schema={schema} />;
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Centre.com.pk',
    url: 'https://www.centre.com.pk',
    logo: 'https://www.centre.com.pk/logo.png',
    sameAs: [
      'https://twitter.com/centerspk',
      'https://facebook.com/centerspk',
      'https://linkedin.com/company/centerspk',
      'https://instagram.com/centerspk',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@centre.com.pk',
      availableLanguage: ['English', 'Urdu'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
  };

  return <SchemaScript schema={schema} />;
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Centre.com.pk',
    description: 'Free online tools and utilities provider',
    url: 'https://www.centre.com.pk',
    telephone: '+92-XXX-XXXXXXX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Online',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.5497',
      longitude: '74.3436',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '$$',
  };

  return <SchemaScript schema={schema} />;
}

// ✅ FIXED: Added lang parameter for proper multilingual URLs
export function SoftwareApplicationSchema(slug: string, category: string, title: string, description: string, lang: string = 'en') {
  const url = `https://www.centre.com.pk/${lang}/tools/${category}/${slug}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: description,
    url: url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Centre.com.pk',
    },
  };

  return <SchemaScript schema={schema} />;
}

// // components/seo/SchemaScript.tsx
// 'use client';

// import { SchemaScriptProps } from './types';

// export default function SchemaScript({
//   schema,
//   type = 'application/ld+json',
//   className = '',
// }: SchemaScriptProps) {
//   if (!schema) {
//     return null;
//   }

//   // Handle array of schemas
//   const schemas = Array.isArray(schema) ? schema : [schema];
  
//   return (
//     <div className={`schema-scripts ${className}`}>
//       {schemas.map((schemaData, index) => {
//         // Skip empty schemas
//         if (!schemaData || Object.keys(schemaData).length === 0) {
//           return null;
//         }

//         return (
//           <script
//             key={index}
//             type={type}
//             dangerouslySetInnerHTML={{
//               __html: JSON.stringify(schemaData, null, 2),
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// }

// // Predefined schema components
// export function WebsiteSchema() {
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'WebSite',
//     name: 'Centre.com.pk',
//     alternateName: 'Free Online Tools',
//     url: 'https://www.centre.com.pk',
//     description: 'Free online tools for developers, designers, students, and professionals. Calculators, converters, formatters, and more!',
//     potentialAction: {
//       '@type': 'SearchAction',
//       target: 'https://www.centre.com.pk/search?q=',
//       'query-input': 'required name=q',
//     },
//     publisher: {
//       '@type': 'Organization',
//       name: 'Centre.com.pk',
//       logo: {
//         '@type': 'ImageObject',
//         url: 'https://www.centre.com.pk/logo.png',
//         width: 512,
//         height: 512,
//       },
//     },
//   };

//   return <SchemaScript schema={schema} />;
// }

// export function OrganizationSchema() {
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'Organization',
//     name: 'Centre.com.pk',
//     url: 'https://www.centre.com.pk',
//     logo: 'https://www.centre.com.pk/logo.png',
//     sameAs: [
//       'https://twitter.com/centerspk',
//       'https://facebook.com/centerspk',
//       'https://linkedin.com/company/centerspk',
//       'https://instagram.com/centerspk',
//     ],
//     contactPoint: {
//       '@type': 'ContactPoint',
//       contactType: 'customer support',
//       email: 'support@centre.com.pk',
//       availableLanguage: ['English', 'Urdu'],
//     },
//     address: {
//       '@type': 'PostalAddress',
//       addressCountry: 'PK',
//     },
//   };

//   return <SchemaScript schema={schema} />;
// }

// export function LocalBusinessSchema() {
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'LocalBusiness',
//     name: 'Centre.com.pk',
//     description: 'Free online tools and utilities provider',
//     url: 'https://www.centre.com.pk',
//     telephone: '+92-XXX-XXXXXXX',
//     address: {
//       '@type': 'PostalAddress',
//       streetAddress: 'Online',
//       addressLocality: 'Lahore',
//       addressRegion: 'Punjab',
//       postalCode: '54000',
//       addressCountry: 'PK',
//     },
//     geo: {
//       '@type': 'GeoCoordinates',
//       latitude: '31.5497',
//       longitude: '74.3436',
//     },
//     openingHoursSpecification: {
//       '@type': 'OpeningHoursSpecification',
//       dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//       opens: '00:00',
//       closes: '23:59',
//     },
//     priceRange: '$$',
//   };

//   return <SchemaScript schema={schema} />;
// }

// export function SoftwareApplicationSchema(slug: string, category: string, title: string, description: string) {
//   const url = `https://www.centre.com.pk/tools/${category}/${slug}`;
  
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'SoftwareApplication',
//     name: title,
//     description: description,
//     url: url,
//     applicationCategory: 'UtilitiesApplication',
//     operatingSystem: 'Any',
//     offers: {
//       '@type': 'Offer',
//       price: '0',
//       priceCurrency: 'USD',
//     },
//     aggregateRating: {
//       '@type': 'AggregateRating',
//       ratingValue: '4.8',
//       ratingCount: '1000',
//       bestRating: '5',
//       worstRating: '1',
//     },
//     author: {
//       '@type': 'Organization',
//       name: 'Centre.com.pk',
//     },
//   };

//   return <SchemaScript schema={schema} />;
// }