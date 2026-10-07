import sanitizeHtmlLib from 'sanitize-html';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img',
  'code', 'pre', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'hr', 'span', 'div'
];

const ALLOWED_ATTRS = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  '*': ['class']
};

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';
  try {
    return sanitizeHtmlLib(dirty, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRS,
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data']
      },
      disallowedTagsMode: 'discard',
      transformTags: {
        'a': (tagName: string, attribs: Record<string, string>) => {
          if (attribs.target === '_blank') {
            attribs.rel = 'noopener noreferrer';
          }
          return { tagName, attribs };
        }
      }
    });
  } catch {
    return '';
  }
}
