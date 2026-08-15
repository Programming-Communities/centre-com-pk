'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function Education() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();

  const addEntry = () => {
    dispatch({ type: 'ADD_ITEM', section: 'education', payload: { school: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' } });
  };

  const updateEntry = (index: number, field: string, value: string) => {
    dispatch({ type: 'UPDATE_ITEM', section: 'education', index, payload: { [field]: value } });
  };

  const removeEntry = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'education', index });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <GraduationCap className="w-5 h-5" style={{ color: themeColors.primary }} />Education
        </h3>
        <button onClick={addEntry} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>
      {state.education.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: themeColors.text.secondary }}>No education added yet.</p>
      )}
      {state.education.map((edu: any, i: number) => (
        <div key={i} className="p-4 rounded-lg border space-y-3" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>Education #{i + 1}</span>
            <button onClick={() => removeEntry(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'school', label: 'School/University', placeholder: 'Harvard University' },
              { field: 'degree', label: 'Degree', placeholder: "Bachelor's" },
              { field: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
              { field: 'gpa', label: 'GPA', placeholder: '3.8 / 4.0' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>{label}</label>
                <input type="text" value={edu[field] || ''} onChange={(e) => updateEntry(i, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Start Year</label>
              <input type="text" value={edu.startYear || ''} onChange={(e) => updateEntry(i, 'startYear', e.target.value)}
                placeholder="2018" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>End Year</label>
              <input type="text" value={edu.endYear || ''} onChange={(e) => updateEntry(i, 'endYear', e.target.value)}
                placeholder="2022" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
