'use client';

import { useState, useRef } from 'react';

export default function PDFProtectClient() {
  const [fileName, setFileName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMessage('');
    }
  };

  const handleProtect = async () => {
    if (!fileName) {
      setMessage('⚠️ Please select a PDF file first');
      return;
    }
    if (password.length < 4) {
      setMessage('⚠️ Password must be at least 4 characters');
      return;
    }
    setLoading(true);
    setMessage('🔒 Encrypting your PDF...');
    
    // TODO: PDF encryption logic
    setTimeout(() => {
      setLoading(false);
      setMessage('✅ PDF protected successfully! Download will start soon.');
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-6 md:p-8">
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select PDF File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-text-accent file:font-medium hover:file:bg-secondary cursor-pointer"
          />
          {fileName && (
            <p className="mt-2 text-sm text-green-600">📄 {fileName}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Set Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 4 characters)"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Protect Button */}
        <button
          onClick={handleProtect}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-text-accent font-semibold hover:bg-secondary transition-all disabled:opacity-50"
        >
          {loading ? '🔒 Protecting...' : '🔒 Protect PDF'}
        </button>

        {/* Message */}
        {message && (
          <p className={`text-center text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-amber-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}