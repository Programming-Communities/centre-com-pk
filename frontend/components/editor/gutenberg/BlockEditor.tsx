'use client';
import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Plus, X, Search } from 'lucide-react';
import Block from './Block';
import { BlockData, BLOCK_TYPES, createBlock, BLOCK_ICONS, BLOCK_LABELS } from './BlockTypes';

interface BlockEditorProps {
  initialBlocks?: BlockData[];
  onChange?: (blocks: BlockData[]) => void;
  lang?: string;
}

export default function BlockEditor({ initialBlocks = [], onChange, lang = 'en' }: BlockEditorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [blocks, setBlocks] = useState<BlockData[]>(() => {
    if (initialBlocks && initialBlocks.length > 0) return initialBlocks;
    return [createBlock(BLOCK_TYPES.PARAGRAPH)];
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [showInserter, setShowInserter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');

  // ✅ FIX: Update internal state when initialBlocks changes
  useEffect(() => {
    if (initialBlocks && initialBlocks.length > 0) {
      setBlocks(initialBlocks);
      setSelectedIndex(initialBlocks.length - 1);
    }
  }, [initialBlocks]);

  const updateBlocks = useCallback((newBlocks: BlockData[]) => {
    setBlocks(newBlocks);
    if (onChange) onChange(newBlocks);
  }, [onChange]);

  const handleBlockUpdate = (index: number, block: BlockData) => {
    const newBlocks = [...blocks];
    newBlocks[index] = block;
    updateBlocks(newBlocks);
  };

  const handleBlockDelete = (index: number) => {
    if (blocks.length === 1) {
      updateBlocks([createBlock(BLOCK_TYPES.PARAGRAPH)]);
      setSelectedIndex(0);
      return;
    }
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
    setSelectedIndex(Math.min(index, newBlocks.length - 1));
  };

  const handleBlockMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, removed);
    updateBlocks(newBlocks);
    setSelectedIndex(newIndex);
  };

  const handleBlockDuplicate = (index: number) => {
    const block = blocks[index];
    const newBlock = createBlock(block.type, { ...block.attributes });
    const newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    updateBlocks(newBlocks);
    setSelectedIndex(index + 1);
  };

  const handleInsertAfter = (index: number, type: string) => {
    const newBlock = createBlock(type);
    const newBlocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    updateBlocks(newBlocks);
    setSelectedIndex(index + 1);
    setShowInserter(false);
  };

  const getFilteredBlocks = () => {
    const entries = Object.entries(BLOCK_ICONS);
    if (!searchQuery) return entries;
    return entries.filter(([type]) => {
      const label = BLOCK_LABELS[type as keyof typeof BLOCK_LABELS] || type;
      return label.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  return (
    <div style={{ backgroundColor: surface, border: '1px solid ' + border, borderRadius: '12px', padding: '16px', minHeight: '400px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setShowInserter(!showInserter)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + border, backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer', fontSize: '13px' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary; e.currentTarget.style.backgroundColor = primary + '10'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <Plus size={16} /> <span>Add Block</span>
        </button>
        <span style={{ fontSize: '11px', color: textSecondary }}>{blocks.length} blocks</span>
      </div>

      {showInserter && (
        <div style={{ backgroundColor: surface, border: '1px solid ' + border, borderRadius: '12px', padding: '12px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxHeight: '350px', overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
              <input type="text" placeholder="Search blocks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '6px 10px 6px 32px', borderRadius: '6px', border: '1px solid ' + border, backgroundColor: 'transparent', color: textPrimary, fontSize: '12px', outline: 'none' }} />
            </div>
            <button onClick={() => setShowInserter(false)} style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer', color: textSecondary }}><X size={16} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '4px' }}>
            {getFilteredBlocks().map(([type, icon]) => (
              <button key={type} onClick={() => { const newBlock = createBlock(type); const newBlocks = [...blocks, newBlock]; updateBlocks(newBlocks); setSelectedIndex(blocks.length); setShowInserter(false); }} style={{ padding: '4px', borderRadius: '6px', border: '1px solid ' + border, backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', fontSize: '8px' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = primary; e.currentTarget.style.backgroundColor = primary + '8'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span style={{ fontSize: '7px', textAlign: 'center' }}>{BLOCK_LABELS[type as keyof typeof BLOCK_LABELS]?.substring(0, 8) || type.substring(0, 8)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {blocks.map((block, index) => (
        <Block key={block.id} block={block} index={index} isSelected={selectedIndex === index} onSelect={() => setSelectedIndex(index)} onUpdate={(b) => handleBlockUpdate(index, b)} onDelete={() => handleBlockDelete(index)} onMoveUp={() => handleBlockMove(index, 'up')} onMoveDown={() => handleBlockMove(index, 'down')} onDuplicate={() => handleBlockDuplicate(index)} onInsertAfter={(type) => handleInsertAfter(index, type)} />
      ))}
    </div>
  );
}
