'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getRoot, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, 
  UNDO_COMMAND, REDO_COMMAND, 
  $createParagraphNode, $createTextNode,
  ElementFormatType
} from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode, $createCodeNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ImageNode } from './nodes/ImageNode';
import { VideoNode } from './nodes/VideoNode';
import HTMLImportPlugin from './HTMLImportPlugin';

import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Quote, Code, Link, Heading1, Heading2, Heading3,
  Table, Image, Video, Youtube, Undo, Redo, Download, Loader2
} from 'lucide-react';

// Helper to convert HTML to Lexical JSON
function htmlToLexical(html: string): string {
  if (!html) return JSON.stringify({ root: { children: [{ type: 'paragraph', children: [{ text: '', type: 'text' }] }] } });
  
  if (html.trim().startsWith('{') && html.includes('"root"')) {
    return html;
  }
  
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  const lexicalJson = {
    root: {
      children: [
        {
          children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: text, type: 'text', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1
        }
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  };
  
  return JSON.stringify(lexicalJson);
}

const editorTheme = {
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  heading: { h1: 'editor-heading-h1', h2: 'editor-heading-h2', h3: 'editor-heading-h3' },
  quote: 'editor-quote',
  list: { ol: 'editor-ol', ul: 'editor-ul', listitem: 'editor-listitem', nested: { listitem: 'editor-nested-listitem' } },
  link: 'editor-link',
  text: { bold: 'editor-bold', italic: 'editor-italic', underline: 'editor-underline', strikethrough: 'editor-strikethrough', code: 'editor-code' },
  code: 'editor-code-block',
  table: 'editor-table',
  tableCell: 'editor-table-cell',
  tableCellHeader: 'editor-table-header',
};

function onError(error: Error) { console.error('Lexical Error:', error); }

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (content: string, plainText: string) => void;
  onSave?: (content: string, plainText: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  lang?: string;
}

export default function LexicalEditor({ 
  initialContent = '', onChange, onSave, readOnly = false,
  placeholder = 'Write your blog post...', lang = 'en'
}: LexicalEditorProps) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const isRTL = lang === 'ur' || lang === 'ar';

  useEffect(() => { setMounted(true); }, []);

  const lexicalInitialContent = htmlToLexical(initialContent);

  const initialConfig = {
    namespace: 'CentersBlogEditor',
    theme: editorTheme,
    onError,
    editorState: lexicalInitialContent,
    nodes: [
      HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode,
      LinkNode, AutoLinkNode, TableNode, TableCellNode, TableRowNode,
      ImageNode, VideoNode, HorizontalRuleNode
    ],
  };

  if (!mounted) return <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading Editor...</div>;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={{ border: `2px solid ${themeColors?.border || '#e2e8f0'}`, borderRadius: '16px', overflow: 'hidden', backgroundColor: themeColors?.surface || '#ffffff', direction: isRTL ? 'rtl' : 'ltr' }}>
        
        {!readOnly && <EditorToolbar themeColors={themeColors} fileInputRef={fileInputRef} videoInputRef={videoInputRef} uploading={uploading} setUploading={setUploading} onSave={onSave} />}

        <div style={{ position: 'relative', minHeight: '400px' }}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ minHeight: '400px', padding: '20px 24px', outline: 'none', fontSize: '16px', lineHeight: 1.8, color: themeColors?.text?.primary || '#0f172a' }} />}
            placeholder={<div style={{ position: 'absolute', top: '20px', left: '24px', color: '#94a3b8', fontSize: '16px', pointerEvents: 'none', userSelect: 'none' }}>{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {!readOnly && <EditorStatusBar themeColors={themeColors} wordCount={wordCount} charCount={charCount} />}

        <HistoryPlugin />
        {!readOnly && <AutoFocusPlugin />}
        <ListPlugin />
        <LinkPlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin />
        <HTMLImportPlugin />
        <OnChangePlugin onChange={(editorState) => {
          editorState.read(() => {
            const text = $getRoot().getTextContent();
            setCharCount(text.length);
            setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
            if (onChange) onChange(JSON.stringify(editorState.toJSON()), text);
          });
        }} />
      </div>

      <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={handleImageUpload} />
      <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={handleVideoUpload} />

      <style jsx global>{`
        .editor-placeholder { color: #94a3b8; position: absolute; top: 20px; left: 24px; pointer-events: none; }
        .editor-paragraph { margin: 0 0 12px 0; }
        .editor-heading-h1 { font-size: 32px; font-weight: 800; margin: 24px 0 12px; }
        .editor-heading-h2 { font-size: 24px; font-weight: 700; margin: 20px 0 10px; }
        .editor-heading-h3 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; }
        .editor-quote { border-left: 4px solid #3b82f6; padding: 12px 20px; margin: 16px 0; background: rgba(59,130,246,0.05); border-radius: 0 8px 8px 0; font-style: italic; }
        .editor-code-block { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; font-family: monospace; margin: 16px 0; }
        .editor-ol, .editor-ul { padding-left: 24px; margin: 12px 0; }
        .editor-listitem { margin: 4px 0; }
        .editor-link { color: #3b82f6; text-decoration: underline; }
        .editor-bold { font-weight: 700; }
        .editor-italic { font-style: italic; }
        .editor-underline { text-decoration: underline; }
        .editor-strikethrough { text-decoration: line-through; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </LexicalComposer>
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append('file', file);
    const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) alert('✅ Image uploaded: ' + data.url);
    else alert('❌ Upload failed');
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData(); formData.append('file', file);
    const res = await fetch('/api/upload/video', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) alert('✅ Video uploaded: ' + data.url);
    else alert('❌ Upload failed');
    setUploading(false);
    if (videoInputRef.current) videoInputRef.current.value = '';
  }
}

function EditorToolbar({ themeColors, fileInputRef, videoInputRef, uploading, onSave }: any) {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);

  const btn = (active = false) => ({
    padding: '6px 10px', borderRadius: '6px', border: 'none',
    backgroundColor: active ? (themeColors?.primary || '#3b82f6') + '20' : 'transparent',
    color: active ? themeColors?.primary : themeColors?.text?.secondary || '#64748b',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  const insertLink = () => {
    if (!isLink) {
      const url = prompt('Enter URL:');
      if (url) { editor.dispatchCommand(TOGGLE_LINK_COMMAND, url); setIsLink(true); }
    } else { editor.dispatchCommand(TOGGLE_LINK_COMMAND, null); setIsLink(false); }
  };

  const insertHTML = () => {
    const html = prompt('Paste your HTML content here:');
    if (!html) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      tempDiv.childNodes.forEach(node => {
        const paragraph = $createParagraphNode();
        const text = $createTextNode(node.textContent || '');
        paragraph.append(text);
        root.append(paragraph);
      });
    });
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px 12px', borderBottom: `1px solid ${themeColors?.border || '#e2e8f0'}`, backgroundColor: themeColors?.background || '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
      <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} style={btn()} title="Undo"><Undo size={16} /></button>
      <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} style={btn()} title="Redo"><Redo size={16} /></button>
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px' }} />
      
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} style={btn()}><Bold size={16} /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} style={btn()}><Italic size={16} /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} style={btn()}><Underline size={16} /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} style={btn()}><Strikethrough size={16} /></button>
      
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px' }} />
      
      <button onClick={() => { editor.update(() => { const h = $createHeadingNode('h1'); h.append($createTextNode('Heading 1')); $getRoot().append(h); }); }} style={btn()}><Heading1 size={16} /></button>
      <button onClick={() => { editor.update(() => { const h = $createHeadingNode('h2'); h.append($createTextNode('Heading 2')); $getRoot().append(h); }); }} style={btn()}><Heading2 size={16} /></button>
      <button onClick={() => { editor.update(() => { const h = $createHeadingNode('h3'); h.append($createTextNode('Heading 3')); $getRoot().append(h); }); }} style={btn()}><Heading3 size={16} /></button>
      
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px' }} />
      
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left' as ElementFormatType)} style={btn()}><AlignLeft size={16} /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center' as ElementFormatType)} style={btn()}><AlignCenter size={16} /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right' as ElementFormatType)} style={btn()}><AlignRight size={16} /></button>
      
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px' }} />
      
      <button onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} style={btn()}><List size={16} /></button>
      <button onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} style={btn()}><ListOrdered size={16} /></button>
      <button onClick={() => { editor.update(() => { const q = $createQuoteNode(); q.append($createTextNode('Quote')); $getRoot().append(q); }); }} style={btn()}><Quote size={16} /></button>
      <button onClick={() => { editor.update(() => { const c = $createCodeNode(); c.append($createTextNode('code')); $getRoot().append(c); }); }} style={btn()}><Code size={16} /></button>
      
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px' }} />
      
      <button onClick={insertLink} style={btn(isLink)}><Link size={16} /></button>
      <button onClick={() => fileInputRef.current?.click()} style={btn()}>{uploading ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}</button>
      <button onClick={() => videoInputRef.current?.click()} style={btn()}>{uploading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}</button>
      <button onClick={insertHTML} style={btn()} title="Import HTML"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></button>
      <button onClick={() => { const url = prompt('YouTube URL:'); if (url) alert('YouTube: ' + url); }} style={btn()}><Youtube size={16} /></button>
      <button onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: '3', columns: '3' })} style={btn()}><Table size={16} /></button>
      
      <div style={{ width: '1px', backgroundColor: themeColors?.border, margin: '0 4px', marginLeft: 'auto' }} />
      
      <button onClick={() => { const s = editor.getEditorState(); s.read(() => { const t = $getRoot().getTextContent(); if (onSave) onSave(JSON.stringify(s.toJSON()), t); }); alert('✅ Saved!'); }} style={{ ...btn(), backgroundColor: themeColors?.primary || '#3b82f6', color: '#fff', fontWeight: 600, padding: '8px 16px' }}>
        <Download size={14} /> Save
      </button>
    </div>
  );
}

function EditorStatusBar({ themeColors, wordCount, charCount }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', borderTop: `1px solid ${themeColors?.border || '#e2e8f0'}`, fontSize: '11px', color: '#94a3b8', backgroundColor: themeColors?.background || '#f8fafc' }}>
      <span>📝 Words: {wordCount} | Chars: {charCount}</span>
      <span>Lexical Editor — Centre.com.pk</span>
    </div>
  );
}

function LexicalErrorBoundary({ children }: { children: React.ReactNode }) {
  const [err, setErr] = useState(false);
  useEffect(() => { const h = () => setErr(true); window.addEventListener('error', h); return () => window.removeEventListener('error', h); }, []);
  if (err) return <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>⚠️ Editor error. Please refresh.</div>;
  return <>{children}</>;
}
