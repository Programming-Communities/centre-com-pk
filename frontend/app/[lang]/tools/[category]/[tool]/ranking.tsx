'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ToolSEOData } from '@/lib/seo/types';

interface RankingDashboardProps {
  toolData: ToolSEOData;
}

interface RankingData {
  overallScore: number;
  keywords: string[];
  positions: Array<{
    keyword: string;
    position: number;
    difficulty: number;
    competitor: string;
    opportunity: string;
  }>;
  improvements: string[];
}

export default function RankingDashboard({ toolData }: RankingDashboardProps) {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRankingData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/seo/google-ranking?tool=${toolData.slug}&lang=${lang}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setRankingData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
        setError('Failed to load ranking data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (toolData?.slug) {
      fetchRankingData();
    }
  }, [toolData?.slug, lang]);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 my-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Loading ranking data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 my-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 my-8">
        <div className="text-center text-text-secondary">
          No ranking data available for this tool.
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200 text-green-700';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-red-50 border-red-200 text-red-700';
  };

  const getPositionBadge = (position: number) => {
    if (position <= 3) return 'bg-green-100 text-green-700';
    if (position <= 10) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'bg-green-500';
    if (difficulty < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateEstimatedTraffic = (): string => {
    if (!rankingData?.positions) return '0';
    const monthlySearches = rankingData.positions.reduce(
      (sum, item) => sum + (item.position <= 10 ? Math.max(100, Math.floor(1000 / item.position)) : 0), 
      0
    );
    return Math.round(monthlySearches).toLocaleString();
  };

  const firstPageCount = rankingData.positions?.filter(k => k.position <= 10).length || 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 my-8">
      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Google Ranking Analysis for {toolData.title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-lg p-4 border ${getScoreColor(rankingData.overallScore)}`}>
          <div className="text-sm mb-1">SEO Score</div>
          <div className="text-3xl font-bold">
            {rankingData.overallScore}/100
          </div>
          <div className="text-xs mt-1">
            {rankingData.overallScore >= 80 ? 'Excellent' : 
             rankingData.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Keywords Tracked</div>
          <div className="text-3xl font-bold text-blue-700">
            {rankingData.keywords?.length || 0}
          </div>
          <div className="text-xs text-blue-500 mt-1">
            {firstPageCount} on first page
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">Estimated Traffic</div>
          <div className="text-3xl font-bold text-purple-700">
            {calculateEstimatedTraffic()}
          </div>
          <div className="text-xs text-purple-500 mt-1">visitors/month</div>
        </div>
      </div>
      
      {rankingData.positions && rankingData.positions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Keyword Positions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-variant">
                  <th className="text-left p-3 border-b border-border">Keyword</th>
                  <th className="text-left p-3 border-b border-border">Position</th>
                  <th className="text-left p-3 border-b border-border">Difficulty</th>
                  <th className="text-left p-3 border-b border-border">Top Competitor</th>
                  <th className="text-left p-3 border-b border-border">Action Needed</th>
                 </tr>
              </thead>
              <tbody>
                {rankingData.positions.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-surface-variant/50">
                    <td className="p-3 border-b border-border font-medium">{item.keyword}</td>
                    <td className="p-3 border-b border-border">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPositionBadge(item.position)}`}>
                        #{item.position}
                      </span>
                    </td>
                    <td className="p-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getDifficultyColor(item.difficulty)}`}
                            style={{ width: `${Math.min(100, item.difficulty)}%` }}
                          />
                        </div>
                        <span className="text-sm">{item.difficulty}/100</span>
                      </div>
                    </td>
                    <td className="p-3 border-b border-border text-sm">
                      {item.competitor}
                    </td>
                    <td className="p-3 border-b border-border">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {item.opportunity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {rankingData.improvements && rankingData.improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Improvement Suggestions
          </h3>
          <ul className="space-y-3">
            {rankingData.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-surface-variant rounded-lg">
                <span className="w-6 h-6 rounded-full bg-primary text-text-accent flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </span>
                <span className="text-text-primary">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}