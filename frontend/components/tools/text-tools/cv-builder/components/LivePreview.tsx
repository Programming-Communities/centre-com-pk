// components/tools/text-tools/cv-builder/components/LivePreview.tsx
'use client';
import { useState, useContext, useRef, useEffect } from 'react';
import { CVContext } from '../tool.client';
import { Eye, EyeOff, Maximize2, Minimize2, X, Download, Printer } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function LivePreview() {
  const { state } = useContext(CVContext);
  const { themeColors } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, achievements } = state;

  // ✅ Get template-specific colors
  const templateColors = {
    'professional-blue': { primary: '#2563eb', secondary: '#1e40af', accent: '#dbeafe' },
    'modern-minimal': { primary: '#111827', secondary: '#374151', accent: '#f3f4f6' },
    'creative-bold': { primary: '#9333ea', secondary: '#7c3aed', accent: '#f3e8ff' },
    'executive-dark': { primary: '#1e293b', secondary: '#0f172a', accent: '#94a3b8' },
  };

  const colors = (templateColors as any)[state.template] || templateColors['professional-blue'];

  // ✅ Close fullscreen on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    if (isFullscreen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Toggle Buttons */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:bg-primary/5 transition-all"
          style={{ color: themeColors.text.secondary }}
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:bg-primary/5 transition-all"
          style={{ color: themeColors.text.secondary }}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary hover:bg-primary/5 transition-all ml-auto"
          style={{ color: themeColors.text.secondary }}
        >
          <Printer className="w-3.5 h-3.5" /> Print
        </button>
      </div>

      {/* ✅ FULLSCREEN OVERLAY */}
      {isFullscreen && (
        <div className="fixed inset-0 z-9999 bg-gray-900/95 backdrop-blur-sm flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-sm">CV Preview — {state.template || 'Professional'}</span>
              <span className="text-gray-400 text-xs">{personalInfo?.name || 'Untitled'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button onClick={() => setIsFullscreen(false)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Preview content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
            <div className="w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none" style={{ minHeight: '297mm' }}>
              <CVPreviewContent data={state} colors={colors} />
            </div>
          </div>
        </div>
      )}

      {/* ✅ INLINE PREVIEW (when not fullscreen) */}
      {showPreview && !isFullscreen && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: themeColors.border, maxHeight: '500px', overflowY: 'auto' }}>
          <div className="bg-white" style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142%' }}>
            <CVPreviewContent data={state} colors={colors} />
          </div>
        </div>
      )}
    </>
  );
}

// ✅ SEPARATE Preview Content Component (Reusable)
function CVPreviewContent({ data, colors }: { data: any; colors: any }) {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, achievements } = data;

  return (
    <div className="p-8 sm:p-10 md:p-12" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#1a1a1a', minHeight: '297mm' }}>
      
      {/* HEADER */}
      <div className="border-b-2 pb-5 mb-5" style={{ borderColor: colors.primary }}>
        <div className="flex items-start gap-5">
          {/* ✅ PHOTO — Now visible! */}
          {personalInfo?.photo && (
            <div className="shrink-0">
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
                style={{ borderColor: colors.primary }}
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: colors.primary }}>
              {personalInfo?.name || 'Your Full Name'}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
              {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
              {personalInfo?.phone && <span>📱 {personalInfo.phone}</span>}
              {personalInfo?.address && <span>📍 {personalInfo.address}</span>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
              {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
              {personalInfo?.website && <span>🌐 {personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Work Experience
          </h2>
          {experience.map((exp: any, i: number) => (
            <div key={i} className="mb-4 pl-4 border-l-2" style={{ borderColor: colors.accent }}>
              <div className="flex justify-between items-start flex-wrap gap-1">
                <h3 className="font-bold text-base">{exp.position || 'Position'}</h3>
                <span className="text-sm text-gray-500 font-medium">{exp.startDate} — {exp.endDate || 'Present'}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: colors.primary }}>{exp.company || 'Company'}</p>
              {exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Education
          </h2>
          {education.map((edu: any, i: number) => (
            <div key={i} className="mb-3 pl-4 border-l-2" style={{ borderColor: colors.accent }}>
              <div className="flex justify-between flex-wrap gap-1">
                <h3 className="font-bold text-base">{edu.school || 'Institution'}</h3>
                <span className="text-sm text-gray-500">{edu.startYear} — {edu.endYear}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium border" 
                style={{ backgroundColor: colors.accent, color: colors.primary, borderColor: colors.primary + '30' }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* LANGUAGES */}
      {languages?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang: any, i: number) => (
              <span key={i} className="text-sm text-gray-700">
                <strong>{lang.name}</strong> — {lang.proficiency}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certifications?.filter((c: any) => c.isActive !== false).length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Certifications
          </h2>
          {certifications.filter((c: any) => c.isActive !== false).map((cert: any, i: number) => (
            <div key={i} className="mb-2 flex items-start gap-3">
              {cert.image && <img src={cert.image} alt={cert.name} className="w-10 h-7 object-cover rounded border" />}
              <div>
                <span className="font-semibold text-sm">{cert.name}</span>
                <span className="text-gray-500 text-sm"> — {cert.issuer}</span>
                {cert.issueDate && <span className="text-gray-400 text-xs ml-2">({cert.issueDate})</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Projects
          </h2>
          {projects.map((proj: any, i: number) => (
            <div key={i} className="mb-3 pl-4 border-l-2" style={{ borderColor: colors.accent }}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">{proj.title || 'Project'}</h3>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" 
                    className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                    🔗 Link
                  </a>
                )}
              </div>
              {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
              {proj.technologies && <p className="text-xs text-gray-500 mt-1">🛠️ {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.accent }}>
            Achievements
          </h2>
          {achievements.map((ach: any, i: number) => (
            <div key={i} className="mb-2 pl-4 border-l-2" style={{ borderColor: colors.accent }}>
              <div className="flex justify-between flex-wrap gap-1">
                <h3 className="font-bold text-sm">🏆 {ach.title || 'Achievement'}</h3>
                {ach.date && <span className="text-xs text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-sm text-gray-600">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
        Created with <span style={{ color: colors.primary }}>Centre.com.pk</span> — Free CV Builder
      </div>
    </div>
  );
}