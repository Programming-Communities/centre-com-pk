'use client';
import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { GripVertical, X, Copy, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { BlockData, BLOCK_TYPES, BLOCK_LABELS, BLOCK_ICONS } from './BlockTypes';

interface BlockProps {
  block: BlockData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (block: BlockData) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onInsertAfter: (type: string) => void;
}

export default function Block({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onInsertAfter,
}: BlockProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [showToolbar, setShowToolbar] = useState(false);
  const [showInserter, setShowInserter] = useState(false);

  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';
  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');

  // ✅ COMPLETE RENDER FUNCTION — ALL 30+ BLOCKS
  const renderContent = () => {
    const attrs = block.attributes || {};

    switch (block.type) {
      // ===== TEXT BLOCKS =====
      case BLOCK_TYPES.PARAGRAPH:
        return <div contentEditable suppressContentEditableWarning style={{ fontSize: '16px', lineHeight: 1.8, color: textPrimary, outline: 'none', minHeight: '30px' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })} dangerouslySetInnerHTML={{ __html: block.attributes.content || '' }} />;

      case BLOCK_TYPES.HEADING:
      case BLOCK_TYPES.SUBHEADING:
        const level = block.type === BLOCK_TYPES.HEADING ? (block.attributes.level || 2) : 3;
        const Tag = 'h' + level;
        const sizes = { 1: '36px', 2: '28px', 3: '24px', 4: '20px', 5: '18px', 6: '16px' };
        return <Tag contentEditable suppressContentEditableWarning style={{ fontSize: sizes[level as keyof typeof sizes] || '24px', fontWeight: 700, color: textPrimary, outline: 'none', margin: '8px 0' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })} dangerouslySetInnerHTML={{ __html: block.attributes.content || 'Heading' }} />;

      case BLOCK_TYPES.QUOTE:
      case BLOCK_TYPES.PULLQUOTE:
        return <blockquote style={{ borderLeft: '4px solid ' + primary, padding: '12px 16px', margin: '12px 0', fontStyle: 'italic', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', borderRadius: '0 8px 8px 0', color: textPrimary }}><div contentEditable suppressContentEditableWarning style={{ outline: 'none' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })} dangerouslySetInnerHTML={{ __html: block.attributes.content || 'Quote text' }} /></blockquote>;

      // ===== MEDIA BLOCKS =====
      case BLOCK_TYPES.IMAGE:
        return block.attributes.src ? <img src={block.attributes.src} alt={block.attributes.alt || ''} style={{ maxWidth: '100%', borderRadius: '8px' }} /> : <div style={{ border: '2px dashed ' + border, borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: bg }} onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { onUpdate({ ...block, attributes: { ...block.attributes, src: ev.target?.result as string } }); }; reader.readAsDataURL(file); } }; input.click(); }}><span style={{ fontSize: '48px', display: 'block', color: textSecondary }}>🖼️</span><p style={{ color: textSecondary, fontSize: '14px' }}>Click to upload image</p></div>;

      case BLOCK_TYPES.GALLERY:
        return <div style={{ border: '2px dashed ' + border, borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: bg }}><span style={{ fontSize: '32px', display: 'block' }}>🖼️</span><p style={{ color: textSecondary, fontSize: '13px' }}>Gallery block — {block.attributes.images?.length || 0} images</p></div>;

      case BLOCK_TYPES.VIDEO:
        return block.attributes.src ? <video src={block.attributes.src} controls style={{ maxWidth: '100%', borderRadius: '8px' }} /> : <div style={{ border: '2px dashed ' + border, borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: bg }} onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'video/*'; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { onUpdate({ ...block, attributes: { ...block.attributes, src: ev.target?.result as string } }); }; reader.readAsDataURL(file); } }; input.click(); }}><span style={{ fontSize: '48px', display: 'block', color: textSecondary }}>🎬</span><p style={{ color: textSecondary, fontSize: '14px' }}>Click to upload video</p></div>;

      case BLOCK_TYPES.YOUTUBE:
        return block.attributes.videoId ? <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}><iframe src={'https://www.youtube.com/embed/' + block.attributes.videoId} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }} frameBorder="0" allowFullScreen /></div> : <div style={{ border: '2px dashed ' + border, borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: bg }} onClick={() => { const url = prompt('Enter YouTube URL:'); if (url) { const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/); if (match) { onUpdate({ ...block, attributes: { ...block.attributes, url: url, videoId: match[1] } }); } } }}><span style={{ fontSize: '48px', display: 'block', color: '#ff0000' }}>▶️</span><p style={{ color: textSecondary, fontSize: '14px' }}>Click to add YouTube URL</p></div>;

      case BLOCK_TYPES.AUDIO:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '16px', backgroundColor: bg }}><span style={{ fontSize: '24px', display: 'block' }}>🎵</span><p style={{ color: textSecondary, fontSize: '13px' }}>{block.attributes.title || 'Audio block'}</p></div>;

      case BLOCK_TYPES.COVER:
        return <div style={{ padding: '40px', textAlign: 'center', backgroundColor: block.attributes.overlay ? 'rgba(0,0,0,' + (block.attributes.overlay / 100) + ')' : 'transparent', borderRadius: '8px', minHeight: '150px' }}><h3 style={{ color: '#fff', margin: 0 }}>{block.attributes.title || 'Cover'}</h3><p style={{ color: '#fff', opacity: 0.8 }}>{block.attributes.subtitle || 'Subtitle'}</p></div>;

      case BLOCK_TYPES.FILE:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '12px 16px', backgroundColor: bg, display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '24px' }}>📄</span><span style={{ color: textPrimary }}>{block.attributes.title || 'File'}</span></div>;

      case BLOCK_TYPES.MEDIA_TEXT:
        return <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid ' + border, borderRadius: '8px', flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: '100px', background: '#e2e8f0', borderRadius: '8px', minHeight: '100px' }} /><div style={{ flex: 2, minWidth: '150px' }}><div contentEditable suppressContentEditableWarning style={{ outline: 'none', color: textPrimary }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })}>{block.attributes.content || 'Media & Text content'}</div></div></div>;

      // ===== DESIGN BLOCKS =====
      case BLOCK_TYPES.BUTTON:
        return <a href={block.attributes.url || '#'} style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: block.attributes.style === 'secondary' ? 'transparent' : primary, color: block.attributes.style === 'secondary' ? primary : '#fff', border: block.attributes.style === 'secondary' ? '2px solid ' + primary : 'none', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>{block.attributes.text || 'Button'}</a>;

      case BLOCK_TYPES.SEPARATOR:
        return <hr style={{ border: 'none', borderTop: '2px solid ' + border, margin: '16px 0' }} />;

      case BLOCK_TYPES.SPACER:
        return <div style={{ height: (block.attributes.height || 40) + 'px' }} />;

      case BLOCK_TYPES.COLUMNS:
        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (block.attributes.columns || 2) + ', 1fr)', gap: (block.attributes.gap || 20) + 'px', padding: '8px' }}>{Array.from({ length: block.attributes.columns || 2 }).map((_, i) => <div key={i} style={{ border: '1px dashed ' + border, padding: '16px', borderRadius: '8px', minHeight: '60px' }}>Column {i+1}</div>)}</div>;

      case BLOCK_TYPES.GROUP:
        return <div style={{ display: 'flex', flexDirection: 'column', gap: (block.attributes.gap || 10) + 'px', padding: '12px', border: '1px dashed ' + border, borderRadius: '8px' }}><div contentEditable suppressContentEditableWarning style={{ outline: 'none', color: textPrimary }}>{block.attributes.content || 'Group content'}</div></div>;

      case BLOCK_TYPES.GRID:
        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (block.attributes.columns || 3) + ', 1fr)', gap: (block.attributes.gap || 16) + 'px', padding: '8px' }}>{Array.from({ length: block.attributes.columns || 3 }).map((_, i) => <div key={i} style={{ border: '1px dashed ' + border, padding: '12px', borderRadius: '8px', minHeight: '40px' }}>Grid {i+1}</div>)}</div>;

      case BLOCK_TYPES.STACK:
        return <div style={{ display: 'flex', flexDirection: 'column', gap: (block.attributes.gap || 12) + 'px', padding: '8px', border: '1px dashed ' + border, borderRadius: '8px' }}>{Array.from({ length: 2 }).map((_, i) => <div key={i} style={{ padding: '8px', border: '1px solid ' + border, borderRadius: '4px' }}>Stack item {i+1}</div>)}</div>;

      // ===== LIST BLOCKS =====
      case BLOCK_TYPES.LIST:
      case BLOCK_TYPES.CHECKLIST:
        const ListTag = block.attributes.ordered ? 'ol' : 'ul';
        return <ListTag style={{ paddingLeft: '24px', margin: '8px 0', color: textPrimary }}>{block.attributes.items?.map((item: string, i: number) => <li key={i} contentEditable suppressContentEditableWarning style={{ margin: '4px 0', outline: 'none' }} onInput={(e) => { const newItems = [...(block.attributes.items || [])]; newItems[i] = e.currentTarget.innerText; onUpdate({ ...block, attributes: { ...block.attributes, items: newItems } }); }}>{item}</li>)}</ListTag>;

      // ===== CODE BLOCKS =====
      case BLOCK_TYPES.CODE:
      case BLOCK_TYPES.SYNTAX_HIGHLIGHT:
        return <pre style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', padding: '16px', borderRadius: '8px', overflow: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, color: textPrimary, margin: '8px 0' }}><code contentEditable suppressContentEditableWarning style={{ outline: 'none', display: 'block' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerText } })}>{block.attributes.content || '// Your code here'}</code></pre>;

      case BLOCK_TYPES.HTML:
      case BLOCK_TYPES.PREFORMATTED:
        return <div contentEditable suppressContentEditableWarning style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', color: textPrimary, outline: 'none' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })} dangerouslySetInnerHTML={{ __html: block.attributes.content || '<div>HTML content</div>' }} />;

      // ===== TABLE BLOCKS =====
      case BLOCK_TYPES.TABLE:
        return <table style={{ width: '100%', borderCollapse: 'collapse', margin: '8px 0', border: '1px solid ' + border }}><tbody>{Array.from({ length: block.attributes.rows || 3 }).map((_, i) => <tr key={i}>{Array.from({ length: block.attributes.cols || 3 }).map((_, j) => <td key={j} style={{ padding: '8px', border: '1px solid ' + border, color: textPrimary }} contentEditable suppressContentEditableWarning>Cell {i+1}-{j+1}</td>)}</tr>)}</tbody></table>;

      case BLOCK_TYPES.PRICING_TABLE:
        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px', border: '1px solid ' + border, borderRadius: '8px' }}><div style={{ textAlign: 'center', padding: '16px', border: '1px solid ' + border, borderRadius: '8px' }}><h3>Basic</h3><p>$0</p></div><div style={{ textAlign: 'center', padding: '16px', border: '2px solid ' + primary, borderRadius: '8px', backgroundColor: primary + '10' }}><h3>Pro</h3><p>$9</p></div><div style={{ textAlign: 'center', padding: '16px', border: '1px solid ' + border, borderRadius: '8px' }}><h3>Premium</h3><p>$29</p></div></div>;

      case BLOCK_TYPES.COMPARISON_TABLE:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', overflow: 'hidden' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}><th style={{ padding: '12px', borderBottom: '1px solid ' + border }}>Feature</th><th style={{ padding: '12px', borderBottom: '1px solid ' + border }}>Tool A</th><th style={{ padding: '12px', borderBottom: '1px solid ' + border }}>Tool B</th></tr></thead><tbody><tr><td style={{ padding: '10px', borderBottom: '1px solid ' + border }}>Free</td><td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid ' + border }}>✅</td><td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid ' + border }}>❌</td></tr></tbody></table></div>;

      // ===== WIDGET BLOCKS =====
      case BLOCK_TYPES.EMBED:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '16px', backgroundColor: bg, textAlign: 'center' }}><p style={{ color: textSecondary }}>🔗 Embedded content</p></div>;

      case BLOCK_TYPES.SHORTCODE:
        return <div style={{ border: '1px dashed ' + primary, borderRadius: '8px', padding: '12px', backgroundColor: primary + '10', textAlign: 'center' }}><code style={{ color: primary }}>[shortcode]</code></div>;

      case BLOCK_TYPES.SOCIAL_SHARE:
        return <div style={{ display: 'flex', gap: '8px', padding: '12px', justifyContent: 'center' }}><span style={{ background: '#1DA1F2', padding: '8px 12px', borderRadius: '6px', color: '#fff' }}>🐦</span><span style={{ background: '#1877F2', padding: '8px 12px', borderRadius: '6px', color: '#fff' }}>📘</span><span style={{ background: '#0A66C2', padding: '8px 12px', borderRadius: '6px', color: '#fff' }}>🔗</span></div>;

      case BLOCK_TYPES.SEARCH:
        return <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid ' + border, borderRadius: '8px' }}><input type="text" placeholder="Search..." style={{ flex: 1, padding: '8px 12px', border: 'none', backgroundColor: 'transparent', color: textPrimary, outline: 'none' }} /><button style={{ padding: '8px 16px', backgroundColor: primary, color: '#fff', border: 'none', borderRadius: '4px' }}>Search</button></div>;

      // ===== LAYOUT BLOCKS =====
      case BLOCK_TYPES.SIDEBAR:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '16px', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}><h4 style={{ color: textPrimary, margin: 0 }}>Sidebar</h4><p style={{ color: textSecondary, fontSize: '13px' }}>Sidebar content</p></div>;

      case BLOCK_TYPES.FOOTER:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '16px', backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', textAlign: 'center' }}><p style={{ color: textSecondary, fontSize: '13px' }}>© 2026 Footer</p></div>;

      case BLOCK_TYPES.HEADER:
        return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid ' + border }}><div style={{ fontWeight: 700, color: textPrimary }}>Logo</div><div style={{ display: 'flex', gap: '16px', color: textSecondary }}>Menu</div></div>;

      case BLOCK_TYPES.SECTION:
        return <div style={{ padding: '20px', backgroundColor: block.attributes.background || 'transparent', borderRadius: '8px' }}><div contentEditable suppressContentEditableWarning style={{ outline: 'none' }} onInput={(e) => onUpdate({ ...block, attributes: { ...block.attributes, content: e.currentTarget.innerHTML } })}>{block.attributes.content || 'Section content'}</div></div>;

      // ===== ADVANCED BLOCKS =====
      case BLOCK_TYPES.ACCORDION:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', overflow: 'hidden' }}>{block.attributes.items?.map((item: any, i: number) => <div key={i} style={{ borderBottom: i < block.attributes.items.length - 1 ? '1px solid ' + border : 'none' }}><div style={{ padding: '12px 16px', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', fontWeight: 600, color: textPrimary }}>{item.title || 'Item ' + (i+1)}</div><div style={{ padding: '12px 16px', color: textSecondary }}>{item.content || 'Content'}</div></div>)}</div>;

      case BLOCK_TYPES.TABS:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', overflow: 'hidden' }}><div style={{ display: 'flex', borderBottom: '1px solid ' + border }}>{block.attributes.items?.map((item: any, i: number) => <div key={i} style={{ padding: '10px 16px', backgroundColor: i === 0 ? primary : 'transparent', color: i === 0 ? '#fff' : textSecondary, fontWeight: 600 }}>{item.title || 'Tab ' + (i+1)}</div>)}</div><div style={{ padding: '16px', color: textSecondary }}>{block.attributes.items?.[0]?.content || 'Tab content'}</div></div>;

      case BLOCK_TYPES.MODAL:
        return <div style={{ border: '1px solid ' + border, borderRadius: '8px', padding: '16px', textAlign: 'center' }}><h4 style={{ color: textPrimary }}>{block.attributes.title || 'Modal'}</h4><p style={{ color: textSecondary, fontSize: '13px' }}>{block.attributes.content || 'Modal content'}</p><button style={{ padding: '8px 20px', backgroundColor: primary, color: '#fff', border: 'none', borderRadius: '4px' }}>{block.attributes.button || 'Open Modal'}</button></div>;

      case BLOCK_TYPES.COUNTER:
        return <div style={{ textAlign: 'center', padding: '20px', border: '1px solid ' + border, borderRadius: '8px' }}><div style={{ fontSize: '36px', fontWeight: 700, color: primary }}>{block.attributes.value || 100}</div><div style={{ color: textSecondary }}>{block.attributes.label || 'Counter'}</div></div>;

      case BLOCK_TYPES.COUNTDOWN:
        return <div style={{ textAlign: 'center', padding: '20px', border: '1px solid ' + border, borderRadius: '8px' }}><div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}><div><div style={{ fontSize: '28px', fontWeight: 700, color: primary }}>12</div><div style={{ fontSize: '12px', color: textSecondary }}>Days</div></div><div><div style={{ fontSize: '28px', fontWeight: 700, color: primary }}>08</div><div style={{ fontSize: '12px', color: textSecondary }}>Hours</div></div><div><div style={{ fontSize: '28px', fontWeight: 700, color: primary }}>45</div><div style={{ fontSize: '12px', color: textSecondary }}>Mins</div></div></div></div>;

      case BLOCK_TYPES.PROGRESS_BAR:
        return <div style={{ padding: '16px', border: '1px solid ' + border, borderRadius: '8px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: textPrimary, fontSize: '13px' }}>{block.attributes.label || 'Progress'}</span><span style={{ color: textSecondary, fontSize: '13px' }}>{block.attributes.value || 50}%</span></div><div style={{ height: '8px', backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: (block.attributes.value || 50) + '%', backgroundColor: block.attributes.color || primary, borderRadius: '4px' }} /></div></div>;

      case BLOCK_TYPES.TESTIMONIAL:
        return <div style={{ padding: '20px', border: '1px solid ' + border, borderRadius: '8px', textAlign: 'center', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}><p style={{ fontStyle: 'italic', color: textPrimary, fontSize: '16px' }}>"{block.attributes.quote || 'Testimonial quote'}"</p><div style={{ fontWeight: 700, color: textPrimary }}>{block.attributes.author || 'Author'}</div><div style={{ fontSize: '13px', color: textSecondary }}>{block.attributes.role || 'Role'}</div></div>;

      case BLOCK_TYPES.TEAM:
        return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', padding: '8px' }}>{block.attributes.members?.map((member: any, i: number) => <div key={i} style={{ textAlign: 'center', padding: '12px', border: '1px solid ' + border, borderRadius: '8px' }}><div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: primary, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>{member.name?.charAt(0) || 'T'}</div><div style={{ fontWeight: 600, color: textPrimary }}>{member.name || 'Team Member'}</div><div style={{ fontSize: '12px', color: textSecondary }}>{member.role || 'Role'}</div></div>)}</div>;

      case BLOCK_TYPES.LOGO:
        return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}><span style={{ fontSize: '28px' }}>🏷️</span><span style={{ fontWeight: 700, color: textPrimary }}>{block.attributes.alt || 'Logo'}</span></div>;

      case BLOCK_TYPES.ICON:
        const icons = { star: '⭐', heart: '❤️', check: '✅', bolt: '⚡', fire: '🔥', leaf: '🌿', rocket: '🚀', settings: '⚙️', user: '👤', mail: '📧' };
        return <div style={{ fontSize: block.attributes.size || 24, color: block.attributes.color || primary, padding: '4px' }}>{icons[block.attributes.icon as keyof typeof icons] || '✨'}</div>;

      default:
        // ✅ Show a styled unknown block message
        return <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          color: '#dc2626',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>Unknown block: <code style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>{block.type}</code></span>
          <button 
            onClick={() => { onUpdate({ ...block, type: BLOCK_TYPES.PARAGRAPH, attributes: { content: 'Converted from ' + block.type } }); }}
            style={{ marginLeft: 'auto', padding: '4px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
          >
            Convert to Paragraph
          </button>
        </div>;
    }
  };

  const showToolbarAlways = isSelected || showToolbar;

  return (
    <div style={{ position: 'relative', padding: '12px 8px', margin: '4px 0', borderRadius: '8px', border: isSelected ? '2px solid ' + primary : '2px solid transparent', backgroundColor: isSelected ? primary + '05' : 'transparent', minHeight: '40px' }} onClick={onSelect} onMouseEnter={() => setShowToolbar(true)} onMouseLeave={() => setShowToolbar(false)}>
      {showToolbarAlways && (
        <div style={{ position: 'absolute', top: '-44px', left: '50%', transform: 'translateX(-50%)', backgroundColor: surface, border: '1px solid ' + border, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '4px', display: 'flex', gap: '2px', alignItems: 'center', zIndex: 10 }}>
          <button style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }}><GripVertical size={14} /></button>
          <div style={{ width: '1px', height: '20px', backgroundColor: border }} />
          <button onClick={onMoveUp} title="Move up" style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }}><ArrowUp size={14} /></button>
          <button onClick={onMoveDown} title="Move down" style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }}><ArrowDown size={14} /></button>
          <button onClick={onDuplicate} title="Duplicate" style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }}><Copy size={14} /></button>
          <button onClick={onDelete} title="Delete" style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
          <div style={{ width: '1px', height: '20px', backgroundColor: border }} />
          <button onClick={() => setShowInserter(!showInserter)} title="Add block" style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }}><Plus size={14} /></button>
        </div>
      )}
      {showInserter && (
        <div style={{ position: 'absolute', top: '-90px', left: '50%', transform: 'translateX(-50%)', backgroundColor: surface, border: '1px solid ' + border, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '8px', zIndex: 11, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', minWidth: '280px' }}>
          {Object.entries(BLOCK_ICONS).map(([type, icon]) => (
            <button key={type} onClick={() => { onInsertAfter(type); setShowInserter(false); }} style={{ padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primary + '15'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <span style={{ fontSize: '18px' }}>{icon}</span>
              <span>{BLOCK_LABELS[type as keyof typeof BLOCK_LABELS]?.substring(0, 8) || type}</span>
            </button>
          ))}
        </div>
      )}
      {renderContent()}
    </div>
  );
}
