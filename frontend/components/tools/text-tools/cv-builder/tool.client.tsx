
'use client';

import { useState, useEffect, useReducer, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import { 
  FileText, Download, Share2, Save, Eye, EyeOff, 
  Settings, RotateCcw, Loader2, Check, X, Sparkles,
  Camera, Award, Briefcase, GraduationCap, Code,
  Globe, BookOpen, Star, Heart, Users, Plus, Minus,
  GripVertical, Trash2, Copy, Upload, Image,
  ChevronDown, ChevronUp, History, RefreshCw,
  Palette, Type, Layout, Printer, Mail, MessageCircle
} from 'lucide-react';
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';
import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import PersonalInfo from './components/PersonalInfo';
import ProfessionalSummary from './components/ProfessionalSummary';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Skills from './components/Skills';
import Languages from './components/Languages';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import ThemeSelector from './components/ThemeSelector';
import LivePreview from './components/LivePreview';
import AIPanel from './components/AIPanel';
import ExportOptions from './components/ExportOptions';
import ATSScanner from './components/ATSScanner';
import CoverLetter from './components/CoverLetter';
import PhotoUpload from './components/PhotoUpload';
import VersionHistory from './components/VersionHistory';

// CV Context for shared state
export const CVContext = createContext<any>(null);

const initialState = {
  template: 'professional-blue',
  personalInfo: { name: '', email: '', phone: '', address: '', linkedin: '', website: '', photo: null },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  achievements: [],
  volunteer: [],
  publications: [],
  references: [],
  photoGallery: { profile: null, signature: null, logos: [] },
};

function cvReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_NESTED':
      return { ...state, [action.section]: { ...state[action.section], [action.field]: action.value } };
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'ADD_ITEM':
      return { ...state, [action.section]: [...state[action.section], action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.section]: state[action.section].map((item: any, i: number) =>
          i === action.index ? { ...item, ...action.payload } : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        [action.section]: state[action.section].filter((_: any, i: number) => i !== action.index),
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function CVBuilderClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const { themeColors, fontFamily } = useTheme();
  const [mounted, setMounted] = useState(false);
  


  const [state, dispatch] = useReducer(cvReducer, initialState);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const saved = localStorage.getItem('cv-builder-state');
    if (saved) {
      try { dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) }); } catch (e) {}
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      localStorage.setItem('cv-builder-state', JSON.stringify(state));
    }, 1000);
    return () => clearTimeout(timer);
  }, [state, mounted]);

  const sections = [
    { id: 'personal', icon: Camera, label: 'Personal Info' },
    { id: 'summary', icon: FileText, label: 'Summary' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'languages', icon: Globe, label: 'Languages' },
    { id: 'certifications', icon: Award, label: 'Certifications' },
    { id: 'projects', icon: Star, label: 'Projects' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
  ];

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: themeColors.primary }} />
      </div>
    );
  }

  return (
    <CVContext.Provider value={{ state, dispatch }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{ backgroundColor: themeColors.background, fontFamily }}>
        <CentralAd position="top" size="banner" />
 

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              Free CV Builder
            </h1>
            <p className="text-lg" style={{ color: themeColors.text.secondary }}>
              Create professional resumes with AI, 15+ templates, and free PDF export
            </p>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl" style={{ backgroundColor: themeColors.surface }}>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive ? 'text-white shadow-md' : ''
                  }`}
                  style={isActive ? { backgroundColor: themeColors.primary } : { color: themeColors.text.secondary }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Form */}
            <div className="lg:col-span-2 space-y-6">
              {activeSection === 'personal' && <PersonalInfo />}
              {activeSection === 'summary' && <ProfessionalSummary />}
              {activeSection === 'experience' && <WorkExperience />}
              {activeSection === 'education' && <Education />}
              {activeSection === 'skills' && <Skills />}
              {activeSection === 'languages' && <Languages />}
              {activeSection === 'certifications' && <Certifications />}
              {activeSection === 'projects' && <Projects />}
              {activeSection === 'achievements' && <Achievements />}
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <LivePreview />
                <ExportOptions />
                <ATSScanner />
              </div>
            </div>
          </div>
        </div>


      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>

        <CentralAd position="bottom" size="banner" />
      </div>
    </CVContext.Provider>
  );

}
