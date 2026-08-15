'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';

export default function MediaLibrary() {
  const { lang } = useParams() as { lang: string };
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    const res = await fetch('/api/admin/tools?action=list-media');
    const data = await res.json();
    if (data.success) setFiles(data.files || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    await fetch('/api/upload/image', { method: 'POST', body: fd });
    setUploading(false);
    fetchMedia();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: '23px', fontWeight: 400, marginBottom: '20px' }}>📁 Media Library</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #c3c4c7', borderRadius: '8px', textAlign: 'center' }}>
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="media-upload" />
        <label htmlFor="media-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Upload size={32} color="#8c8f94" />
          <span style={{ fontSize: '14px', color: '#50575e' }}>
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </span>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
        {files.map((file, i) => (
          <div key={i} style={{ border: '1px solid #c3c4c7', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f1', overflow: 'hidden' }}>
              <img src={file} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => copyUrl(file)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: copied === file ? '#10b981' : '#2271b1' }}>
                {copied === file ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <span style={{ fontSize: '10px', color: '#8c8f94' }}>{file.split('/').pop()?.substring(0, 15)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
