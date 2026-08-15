'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { Star, Plus, Trash2, Link, Code } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function Projects() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();

  const addProject = () => {
    dispatch({ type: 'ADD_ITEM', section: 'projects', payload: { title: '', description: '', url: '', technologies: '' } });
  };

  const updateProject = (index: number, field: string, value: string) => {
    dispatch({ type: 'UPDATE_ITEM', section: 'projects', index, payload: { [field]: value } });
  };

  const removeProject = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'projects', index });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <Star className="w-5 h-5" style={{ color: themeColors.primary }} />Projects
        </h3>
        <button onClick={addProject} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      {state.projects.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: themeColors.text.secondary }}>No projects added yet.</p>
      )}

      {state.projects.map((proj: any, i: number) => (
        <div key={i} className="p-4 rounded-lg border space-y-3" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>Project #{i + 1}</span>
            <button onClick={() => removeProject(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'title', label: 'Project Title', placeholder: 'E-Commerce Platform', icon: Star },
              { field: 'url', label: 'Project URL', placeholder: 'https://github.com/...', icon: Link },
            ].map(({ field, label, placeholder, icon: Icon }) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>
                  <Icon className="w-3 h-3 inline mr-1" />{label}
                </label>
                <input type="text" value={proj[field] || ''} onChange={(e) => updateProject(i, field, e.target.value)}
                  placeholder={placeholder} className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Technologies Used</label>
            <input type="text" value={proj.technologies || ''} onChange={(e) => updateProject(i, 'technologies', e.target.value)}
              placeholder="React, Node.js, MongoDB, AWS..." className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Description</label>
            <textarea value={proj.description || ''} onChange={(e) => updateProject(i, 'description', e.target.value)}
              placeholder="Describe your project, its features, and your contributions..." rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
          </div>
        </div>
      ))}
    </div>
  );
}
