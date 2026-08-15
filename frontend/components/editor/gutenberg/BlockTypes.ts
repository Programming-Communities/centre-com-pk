export interface BlockData {
  id: string;
  type: string;
  attributes: Record<string, any>;
  children?: BlockData[];
}

export const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  SUBHEADING: 'subheading',
  QUOTE: 'quote',
  PULLQUOTE: 'pullquote',
  IMAGE: 'image',
  GALLERY: 'gallery',
  VIDEO: 'video',
  YOUTUBE: 'youtube',
  AUDIO: 'audio',
  COVER: 'cover',
  FILE: 'file',
  MEDIA_TEXT: 'media_text',
  BUTTON: 'button',
  SEPARATOR: 'separator',
  SPACER: 'spacer',
  COLUMNS: 'columns',
  GROUP: 'group',
  GRID: 'grid',
  STACK: 'stack',
  LIST: 'list',
  CHECKLIST: 'checklist',
  CODE: 'code',
  HTML: 'html',
  PREFORMATTED: 'preformatted',
  SYNTAX_HIGHLIGHT: 'syntax_highlight',
  TABLE: 'table',
  PRICING_TABLE: 'pricing_table',
  COMPARISON_TABLE: 'comparison_table',
  EMBED: 'embed',
  SHORTCODE: 'shortcode',
  SOCIAL_SHARE: 'social_share',
  SEARCH: 'search',
  SIDEBAR: 'sidebar',
  FOOTER: 'footer',
  HEADER: 'header',
  SECTION: 'section',
  ACCORDION: 'accordion',
  TABS: 'tabs',
  MODAL: 'modal',
  COUNTER: 'counter',
  COUNTDOWN: 'countdown',
  PROGRESS_BAR: 'progress_bar',
  TESTIMONIAL: 'testimonial',
  TEAM: 'team',
  LOGO: 'logo',
  ICON: 'icon',
};

export const BLOCK_ICONS: Record<string, string> = {
  paragraph: '📝', heading: '📰', subheading: '📄', quote: '💬', pullquote: '📢',
  image: '🖼️', gallery: '🖼️', video: '🎬', youtube: '▶️', audio: '🎵', cover: '🎯', file: '📄', media_text: '📰',
  button: '🔘', separator: '➖', spacer: '⬜', columns: '📊', group: '📦', grid: '📋', stack: '📚',
  list: '📋', checklist: '✅',
  code: '💻', html: '🌐', preformatted: '📝', syntax_highlight: '🎨',
  table: '📊', pricing_table: '💰', comparison_table: '⚖️',
  embed: '🔗', shortcode: '⚡', social_share: '📱', search: '🔍',
  sidebar: '📐', footer: '📌', header: '📌', section: '📐',
  accordion: '📑', tabs: '📁', modal: '📦', counter: '🔢', countdown: '⏱️', progress_bar: '📊',
  testimonial: '⭐', team: '👥', logo: '🏷️', icon: '✨',
};

export const BLOCK_LABELS: Record<string, string> = {
  paragraph: 'Paragraph', heading: 'Heading', subheading: 'Subheading', quote: 'Quote', pullquote: 'Pull Quote',
  image: 'Image', gallery: 'Gallery', video: 'Video', youtube: 'YouTube', audio: 'Audio', cover: 'Cover', file: 'File', media_text: 'Media & Text',
  button: 'Button', separator: 'Separator', spacer: 'Spacer', columns: 'Columns', group: 'Group', grid: 'Grid', stack: 'Stack',
  list: 'List', checklist: 'Checklist',
  code: 'Code', html: 'HTML', preformatted: 'Preformatted', syntax_highlight: 'Syntax Highlight',
  table: 'Table', pricing_table: 'Pricing Table', comparison_table: 'Comparison Table',
  embed: 'Embed', shortcode: 'Shortcode', social_share: 'Social Share', search: 'Search',
  sidebar: 'Sidebar', footer: 'Footer', header: 'Header', section: 'Section',
  accordion: 'Accordion', tabs: 'Tabs', modal: 'Modal', counter: 'Counter', countdown: 'Countdown', progress_bar: 'Progress Bar',
  testimonial: 'Testimonial', team: 'Team', logo: 'Logo', icon: 'Icon',
};

export function createBlock(type: string, attributes: any = {}): BlockData {
  return {
    id: 'block-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
    type: type,
    attributes: { ...getDefaultAttributes(type), ...attributes },
    children: [],
  };
}

export function getDefaultAttributes(type: string): any {
  const defaults: Record<string, any> = {
    paragraph: { content: '', align: 'left' },
    heading: { content: 'Heading', level: 2 },
    image: { src: '', alt: '', caption: '' },
    youtube: { url: '', videoId: '' },
    list: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false },
    quote: { content: 'Quote text', citation: '' },
    code: { content: '// Your code here', language: 'javascript' },
    html: { content: '<div>Your HTML here</div>' },
    table: { rows: 3, cols: 3 },
    button: { text: 'Button', url: '#', style: 'primary' },
    separator: {},
  };
  return defaults[type] || {};
}
