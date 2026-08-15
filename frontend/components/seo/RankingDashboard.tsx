// components/seo/RankingDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { getToolCompetitorData, ToolCompetitorData } from '@/lib/seo/competitorData';

interface RankingDashboardProps {
  toolData: {
    slug: string;
    title: string;
  };
}

export default function RankingDashboard({ toolData }: RankingDashboardProps) {
  const [data, setData] = useState<ToolCompetitorData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const toolCompetitorData = getToolCompetitorData(toolData.slug);
    setData(toolCompetitorData);
    setLoading(false);
  }, [toolData.slug]);
  
  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border text-center">
        <p className="text-text-secondary">No ranking data available for this tool.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">
        Google Ranking Analysis for {toolData.title}
      </h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold">{data.seoScore}/100</div>
          <div className="text-sm">SEO Score</div>
          <div className="text-xs text-green-600 mt-1">Excellent</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold">{data.keywordsTracked}</div>
          <div className="text-sm">Keywords Tracked</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold">{data.keywordsOnFirstPage}</div>
          <div className="text-sm">on first page</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold">{data.estimatedTraffic.toLocaleString()}</div>
          <div className="text-sm">visitors/month</div>
        </div>
      </div>
      
      {/* Keyword Positions Table */}
      <h3 className="text-lg font-semibold mb-3">Keyword Positions</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Keyword</th>
              <th className="text-center p-2">Position</th>
              <th className="text-center p-2">Difficulty</th>
              <th className="text-left p-2">Top Competitor</th>
              <th className="text-left p-2">Action Needed</th>
            </tr>
          </thead>
          <tbody>
            {data.keywords.map((kw, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 font-medium">{kw.keyword}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    kw.position <= 3 ? 'bg-green-500/20 text-green-600' :
                    kw.position <= 10 ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-gray-500/20 text-gray-600'
                  }`}>
                    #{kw.position}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${kw.difficulty}%` }} />
                    </div>
                    <span className="text-xs">{kw.difficulty}/100</span>
                  </div>
                </td>
                <td className="p-2">{kw.topCompetitor}</td>
                <td className="p-2 text-primary text-sm">{kw.actionNeeded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Improvement Suggestions */}
      <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
      <ul className="space-y-2 mb-6">
        {data.improvementSuggestions.map((suggestion, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-primary font-bold">{idx + 1}</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
      
      {/* DYNAMIC COMPETITOR COMPARISON TABLE */}
      <h3 className="text-lg font-semibold mb-3">Why Our Tool is Better Than Paid Alternatives</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary/10">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-center">Our Tool</th>
              {data.competitors.map((comp, idx) => (
                <th key={idx} className="p-3 text-center">{comp.name}</th>
              ))}
             </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium">Free to Use</td>
              <td className="p-3 text-center text-green-600">✅ Yes</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  {comp.features.free === true && '✅ Yes'}
                  {comp.features.free === 'limited' && '⚠️ Limited'}
                  {comp.features.free === false && '❌ Paid'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">No Registration</td>
              <td className="p-3 text-center text-green-600">✅ Yes</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  {comp.features.noRegistration ? '✅ Yes' : '❌ Required'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">Privacy First</td>
              <td className="p-3 text-center text-green-600">✅ 100%</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  {comp.features.privacy ? '✅ Yes' : '⚠️ Data Stored'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">Multi-Language Support</td>
              <td className="p-3 text-center text-green-600">✅ Urdu/Hindi/Arabic</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  {comp.features.multiLanguage ? '✅ Yes' : '❌ None'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">RTL Support</td>
              <td className="p-3 text-center text-green-600">✅ Yes</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  {comp.features.rtlSupport ? '✅ Yes' : '❌ No'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">Page Speed</td>
              <td className="p-3 text-center text-green-600">✅ 92/100</td>
              {data.competitors.map((comp, idx) => (
                <td key={idx} className="p-3 text-center">
                  ⚠️ {comp.features.pageSpeed}/100
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Save Money Banner */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
        <p className="text-green-700 font-semibold">
          💰 Save $10-20/month by using our free tool!
        </p>
      </div>
    </div>
  );
}