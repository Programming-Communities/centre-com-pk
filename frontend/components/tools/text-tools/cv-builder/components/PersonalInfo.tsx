'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Camera } from 'lucide-react';
import { useTheme } from '@/components/theme';
import PhotoUpload from './PhotoUpload';

export default function PersonalInfo() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const info = state.personalInfo;

  const update = (field: string, value: string) => {
    dispatch({ type: 'SET_NESTED', section: 'personalInfo', field, value });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <Camera className="w-5 h-5" style={{ color: themeColors.primary }} />
        Personal Information
      </h3>
      <PhotoUpload />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: User, field: 'name', label: 'Full Name', placeholder: 'John Doe' },
          { icon: Mail, field: 'email', label: 'Email', placeholder: 'john@example.com' },
          { icon: Phone, field: 'phone', label: 'Phone', placeholder: '+92 300 1234567' },
          { icon: MapPin, field: 'address', label: 'Address', placeholder: 'City, Country' },
          { icon: Linkedin, field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
          { icon: Globe, field: 'website', label: 'Website', placeholder: 'johndoe.com' },
        ].map(({ icon: Icon, field, label, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>
              <Icon className="w-3 h-3 inline mr-1" />{label}
            </label>
            <input
              type="text"
              value={info[field] || ''}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2"
              style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
