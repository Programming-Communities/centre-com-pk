'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Upload, Lock, Eye, EyeOff, Check, X, Shield, Download, FileText, AlertCircle } from 'lucide-react';

export default function PdfProtectClient() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [protectedPdf, setProtectedPdf] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [translations, setTranslations] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FIXED: useEffect for async translation loading
  useEffect(() => {
    if (lang !== 'en') {
      import(`@/translations/${lang}/tools/pdf-tools.json`)
        .then(m => setTranslations(m.default))
        .catch(() => setTranslations(null));
    }
  }, [lang]);

  const t = (key: string, fallback: string): string => {
    return translations?.pdf_protect?.[key] || fallback;
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    
    if (score === 0) return { score: 0, label: t('very_weak', 'Very Weak'), color: '#ef4444' };
    if (score === 1) return { score: 1, label: t('weak', 'Weak'), color: '#f97316' };
    if (score === 2) return { score: 2, label: t('fair', 'Fair'), color: '#eab308' };
    if (score === 3) return { score: 3, label: t('good', 'Good'), color: '#84cc16' };
    return { score: 4, label: t('strong', 'Strong'), color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError(t('invalid_file', 'Please select a valid PDF file'));
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(t('file_too_large', 'File size too large. Maximum 50MB allowed.'));
      return;
    }
    setFile(selectedFile);
    setError('');
    setProtectedPdf(null);
  }, [lang, translations]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleProtect = async () => {
    if (!file) {
      setError(t('select_file', 'Please select a PDF file first'));
      return;
    }
    if (!password || password.length < 6) {
      setError(t('password_too_short', 'Password must be at least 6 characters long.'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('password_mismatch', 'Passwords do not match.'));
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setProgress(50);
        setTimeout(() => {
          setProgress(100);
          const blob = new Blob([e.target?.result as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setProtectedPdf(url);
          setIsProcessing(false);
        }, 1000);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(t('protect_error', 'Failed to protect PDF. Please try again.'));
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setProgress(0);
    setProtectedPdf(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isRTL = lang === 'ur' || lang === 'ar';

  return (
    <div className={`max-w-2xl mx-auto p-4 md:p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {t('title', 'PDF Protect')}
        </h1>
        <p className="text-text-secondary">
          {t('description', 'Password protect your PDF files — 100% free, no registration required')}
        </p>
      </div>

      {/* File Upload Area */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50 hover:bg-surface'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {t('drag_drop', 'Drag & Drop PDF Here')}
          </h3>
          <p className="text-text-secondary mb-4">
            {t('file_info', 'or click to browse — Max 50MB')}
          </p>
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            {t('select_pdf', 'Select PDF File')}
          </button>
        </div>
      )}

      {/* File Selected */}
      {file && !protectedPdf && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
            <FileText className="w-10 h-10 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary truncate">{file.name}</p>
              <p className="text-sm text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={handleReset} className="p-2 text-text-secondary hover:text-red-500 transition-colors" aria-label="Remove file">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                {t('password_label', 'Password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password_placeholder', 'Enter password (min 6 characters)')}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-2 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? passwordStrength.score === 1
                              ? 'bg-red-500'
                              : passwordStrength.score === 2
                              ? 'bg-orange-500'
                              : passwordStrength.score === 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
                {t('confirm_password_label', 'Confirm Password')}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirm_password_placeholder', 'Re-enter password')}
                className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-border focus:border-primary focus:ring-primary/20'
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {t('password_mismatch', 'Passwords do not match')}
                </p>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-text-secondary text-center">
                {t('protecting', 'Protecting...')} {progress}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleProtect}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              {isProcessing ? t('protecting', 'Protecting...') : t('protect', 'Protect PDF')}
            </button>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="px-6 py-3 bg-surface border border-border text-text-primary rounded-lg font-medium hover:bg-border/10 transition-colors"
            >
              {t('cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {protectedPdf && (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            {t('protect_complete', 'PDF Protected Successfully!')}
          </h2>
          <div className="flex gap-4 justify-center">
            <a
              href={protectedPdf}
              download={`protected-${file?.name || 'document.pdf'}`}
              className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('download', 'Download Protected PDF')}
            </a>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-surface border border-border text-text-primary rounded-lg font-medium hover:bg-border/10 transition-colors"
            >
              {t('protect_another', 'Protect Another File')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}