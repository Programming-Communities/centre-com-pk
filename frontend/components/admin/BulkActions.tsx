'use client';

interface BulkActionsProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

export default function BulkActions({ count, onDelete, onClear }: BulkActionsProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '8px 16px', backgroundColor: '#f0f6fc', border: '1px solid #c5d9ed',
      borderRadius: '3px', marginBottom: '12px', fontSize: '13px'
    }}>
      <span style={{ fontWeight: 600, color: '#1d2327' }}>{count} item(s) selected</span>
      <button onClick={onDelete}
        style={{ padding: '4px 12px', border: '1px solid #dc3232', borderRadius: '3px', backgroundColor: '#fff', color: '#dc3232', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
        Move to Trash
      </button>
      <button onClick={onClear}
        style={{ padding: '4px 12px', border: '1px solid #8c8f94', borderRadius: '3px', backgroundColor: '#fff', color: '#50575e', cursor: 'pointer', fontSize: '12px' }}>
        Clear Selection
      </button>
    </div>
  );
}
