'use client';
import { useState, useEffect } from 'react';
import { History, Save, RotateCcw, Trash2, Clock } from 'lucide-react';
import { useTheme } from '@/components/theme';

interface Version {
  id: number;
  timestamp: string;
  data: any;
  label: string;
}

export default function VersionHistory() {
  const { themeColors } = useTheme();
  const [versions, setVersions] = useState<Version[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cv-versions');
    if (saved) {
      try { setVersions(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveVersion = () => {
    const state = JSON.parse(localStorage.getItem('cv-builder-state') || '{}');
    const version: Version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: state,
      label: `Version ${versions.length + 1} - ${new Date().toLocaleDateString()}`,
    };
    const newVersions = [version, ...versions].slice(0, 10);
    setVersions(newVersions);
    localStorage.setItem('cv-versions', JSON.stringify(newVersions));
  };

  const restoreVersion = (version: Version) => {
    localStorage.setItem('cv-builder-state', JSON.stringify(version.data));
    window.location.reload();
  };

  const deleteVersion = (id: number) => {
    const filtered = versions.filter(v => v.id !== id);
    setVersions(filtered);
    localStorage.setItem('cv-versions', JSON.stringify(filtered));
  };

  const clearAll = () => {
    setVersions([]);
    localStorage.removeItem('cv-versions');
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <History className="w-5 h-5" style={{ color: themeColors.primary }} />Version History
        </h3>
        <button onClick={saveVersion}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ backgroundColor: themeColors.primary }}>
          <Save className="w-3.5 h-3.5" /> Save Version
        </button>
      </div>

      {versions.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: themeColors.text.secondary }}>
          No saved versions. Click "Save Version" to create a restore point.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {versions.map((v) => (
            <div key={v.id} className="flex items-center justify-between p-2.5 rounded-lg border"
              style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" style={{ color: themeColors.text.secondary }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{v.label}</div>
                  <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                    {new Date(v.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => restoreVersion(v)} className="p-1.5 rounded hover:bg-black/5" title="Restore">
                  <RotateCcw className="w-3.5 h-3.5" style={{ color: themeColors.primary }} />
                </button>
                <button onClick={() => deleteVersion(v.id)} className="p-1.5 rounded hover:bg-black/5" title="Delete">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {versions.length > 1 && (
            <button onClick={clearAll} className="w-full py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg">
              Clear All Versions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
