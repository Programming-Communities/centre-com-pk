'use client';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { FileCode } from 'lucide-react';

export default function HTMLImportPlugin() {
  const [editor] = useLexicalComposerContext();

  const importHTML = () => {
    const html = prompt('Paste your HTML content here:');
    if (!html) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      
      // Create temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Convert HTML nodes to Lexical nodes
      tempDiv.childNodes.forEach(node => {
        const paragraph = $createParagraphNode();
        const text = $createTextNode(node.textContent || '');
        paragraph.append(text);
        root.append(paragraph);
      });
    });
  };

  return (
    <button 
      onClick={importHTML}
      className="p-2 rounded hover:bg-gray-100"
      title="Import HTML"
      style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
    >
      <FileCode size={18} />
    </button>
  );
}
