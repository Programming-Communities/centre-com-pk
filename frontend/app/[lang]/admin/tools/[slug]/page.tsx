'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Eye, Send, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

export default function EditToolContentPage() {
  const router = useRouter();
  const params = useParams();
  const toolSlug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    toolSlug: toolSlug,
    category: '',
    lang: 'en',
    title: '',
    subtitle: '',
    introduction: '',
    howToUse: '',
    features: '[]',
    useCases: '[]',
    faqs: '[]',
    comparisonText: '',
    seoKeywords: '',
    status: 'draft',
  });

  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [useCasesList, setUseCasesList] = useState<string[]>([]);
  const [faqsList, setFaqsList] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchToolContent();
  }, [toolSlug]);

  const fetchToolContent = async () => {
    try {
      const res = await fetch(`/api/admin/tools?slug=${toolSlug}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setForm({
            toolSlug: data.toolSlug || toolSlug,
            category: data.category || '',
            lang: data.lang || 'en',
            title: data.title || '',
            subtitle: data.subtitle || '',
            introduction: data.introduction || '',
            howToUse: data.howToUse || '',
            features: data.features || '[]',
            useCases: data.useCases || '[]',
            faqs: data.faqs || '[]',
            comparisonText: data.comparisonText || '',
            seoKeywords: data.seoKeywords || '',
            status: data.status || 'draft',
          });
          
          try { setFeaturesList(JSON.parse(data.features || '[]')); } catch {}
          try { setUseCasesList(JSON.parse(data.useCases || '[]')); } catch {}
          try { setFaqsList(JSON.parse(data.faqs || '[]')); } catch {}
        }
      }
    } catch (err) {
      console.error('Failed to fetch tool content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...form,
      features: JSON.stringify(featuresList),
      useCases: JSON.stringify(useCasesList),
      faqs: JSON.stringify(faqsList),
      status: publish ? 'published' : form.status,
    };
    
    try {
      const res = await fetch('/api/admin/tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to save tool content:', err);
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => setFeaturesList([...featuresList, '']);
  const removeFeature = (index: number) => setFeaturesList(featuresList.filter((_, i) => i !== index));
  const updateFeature = (index: number, value: string) => {
    const updated = [...featuresList];
    updated[index] = value;
    setFeaturesList(updated);
  };

  const addUseCase = () => setUseCasesList([...useCasesList, '']);
  const removeUseCase = (index: number) => setUseCasesList(useCasesList.filter((_, i) => i !== index));
  const updateUseCase = (index: number, value: string) => {
    const updated = [...useCasesList];
    updated[index] = value;
    setUseCasesList(updated);
  };

  const addFAQ = () => setFaqsList([...faqsList, { question: '', answer: '' }]);
  const removeFAQ = (index: number) => setFaqsList(faqsList.filter((_, i) => i !== index));
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqsList];
    updated[index][field] = value;
    setFaqsList(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tools" className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Edit Tool Content</h1>
            <p className="text-text-secondary mt-1">Tool: {toolSlug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Draft
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="">Select category</option>
                <option value="calculators">Calculators</option>
                <option value="code-tools">Code Tools</option>
                <option value="image-tools">Image Tools</option>
                <option value="pdf-tools">PDF Tools</option>
                <option value="security-tools">Security Tools</option>
                <option value="text-tools">Text Tools</option>
                <option value="design-tools">Design Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Language</label>
              <select
                value={form.lang}
                onChange={(e) => setForm(prev => ({ ...prev, lang: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title (SEO Optimized)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Free Online Age Calculator - Calculate Your Exact Age"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all text-lg font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="A catchy subtitle for the tool..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Introduction (200+ words)</h3>
          <textarea
            value={form.introduction}
            onChange={(e) => setForm(prev => ({ ...prev, introduction: e.target.value }))}
            placeholder="Write a detailed introduction about this tool. Explain what it does, why it's useful, and who should use it. Target 200-300 words."
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* How to Use */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">How to Use (Step-by-Step Guide)</h3>
          <textarea
            value={form.howToUse}
            onChange={(e) => setForm(prev => ({ ...prev, howToUse: e.target.value }))}
            placeholder="Write step-by-step instructions on how to use this tool. Make it beginner-friendly. Target 200-300 words."
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Key Features */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Key Features</h3>
            <button type="button" onClick={addFeature} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>
          <div className="space-y-2">
            {featuresList.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Feature ${index + 1}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="button" onClick={() => removeFeature(index)} className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Use Cases</h3>
            <button type="button" onClick={addUseCase} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Use Case
            </button>
          </div>
          <div className="space-y-2">
            {useCasesList.map((useCase, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={useCase}
                  onChange={(e) => updateUseCase(index, e.target.value)}
                  placeholder={`Use Case ${index + 1}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="button" onClick={() => removeUseCase(index)} className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Frequently Asked Questions</h3>
            <button type="button" onClick={addFAQ} className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {faqsList.map((faq, index) => (
              <div key={index} className="p-4 rounded-xl border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-secondary shrink-0">Q{index + 1}:</span>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    placeholder="Enter question..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-text-secondary shrink-0 mt-2">A:</span>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    placeholder="Enter answer..."
                    rows={3}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <button type="button" onClick={() => removeFAQ(index)} className="text-xs text-red-500 hover:underline">
                  Remove FAQ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Comparison with Paid Tools</h3>
          <textarea
            value={form.comparisonText}
            onChange={(e) => setForm(prev => ({ ...prev, comparisonText: e.target.value }))}
            placeholder="Compare this free tool with paid alternatives. Highlight why users should choose your free version."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* SEO Keywords */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">SEO Keywords</h3>
          <input
            type="text"
            value={form.seoKeywords}
            onChange={(e) => setForm(prev => ({ ...prev, seoKeywords: e.target.value }))}
            placeholder="keyword1, keyword2, keyword3, ..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </form>
    </div>
  );
}
