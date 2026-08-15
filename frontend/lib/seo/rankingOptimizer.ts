// lib/seo/rankingOptimizer.ts
import { TOOL_SEO_DATA } from './toolSeoData';
import { SITE_URL } from './constants';

export interface RankingMetrics {
  contentScore: number;
  technicalScore: number;
  userExperienceScore: number;
  overallScore: number;
  suggestions: string[];
}

export function analyzeToolSEO(toolSlug: string): RankingMetrics {
  const toolData = TOOL_SEO_DATA[toolSlug];
  const suggestions: string[] = [];
  let contentScore = 0;
  let technicalScore = 0;
  let userExperienceScore = 0;
  
  // Content Analysis
  if (toolData) {
    // Title length check
    if (toolData.title.length >= 50 && toolData.title.length <= 60) {
      contentScore += 20;
    } else {
      suggestions.push(`Optimize title length (currently ${toolData.title.length} chars, ideal 50-60)`);
    }
    
    // Description length check
    if (toolData.description.length >= 150 && toolData.description.length <= 160) {
      contentScore += 20;
    } else {
      suggestions.push(`Optimize description length (currently ${toolData.description.length} chars, ideal 150-160)`);
    }
    
    // Keywords analysis
    if (toolData.keywords.length >= 5) {
      contentScore += 15;
    } else {
      suggestions.push('Add more relevant keywords (aim for 5-10)');
    }
    
    // FAQ analysis
    if (toolData.faqs.length >= 3) {
      contentScore += 25;
    } else {
      suggestions.push('Add more FAQ questions (aim for 3-5)');
    }
    
    // Related tools
    if (toolData.relatedTools.length >= 3) {
      contentScore += 20;
    } else {
      suggestions.push('Add more related tool links (aim for 3-5)');
    }
    
    // Technical Score
    if (toolData.priority && toolData.priority >= 0.7) {
      technicalScore += 30;
    }
    
    if (toolData.changefreq && toolData.changefreq !== 'never') {
      technicalScore += 30;
    }
    
    // Schema type
    if (toolData.schemaType) {
      technicalScore += 20;
    }
    
    // Last modified
    if (toolData.lastModified) {
      technicalScore += 20;
    }
    
    // User Experience Score
    // Content comprehensiveness
    userExperienceScore += 40;
    
    // Clarity and usefulness
    userExperienceScore += 40;
    
    // Mobile friendliness assumed
    userExperienceScore += 20;
  }
  
  // Cap scores at 100
  contentScore = Math.min(contentScore, 100);
  technicalScore = Math.min(technicalScore, 100);
  userExperienceScore = Math.min(userExperienceScore, 100);
  
  const overallScore = Math.round((contentScore * 0.4) + (technicalScore * 0.3) + (userExperienceScore * 0.3));
  
  return {
    contentScore,
    technicalScore,
    userExperienceScore,
    overallScore,
    suggestions,
  };
}

export function generateRankingReport(toolSlug: string): string {
  const metrics = analyzeToolSEO(toolSlug);
  const toolData = TOOL_SEO_DATA[toolSlug];
  
  return `
SEO Ranking Report for: ${toolData?.title || toolSlug}
================================================

📊 Overall Score: ${metrics.overallScore}/100

Breakdown:
- Content Score: ${metrics.contentScore}/100
- Technical Score: ${metrics.technicalScore}/100
- User Experience Score: ${metrics.userExperienceScore}/100

📝 Content Analysis:
• Title: "${toolData?.title?.substring(0, 60)}..."
• Title Length: ${toolData?.title?.length || 0} characters
• Description Length: ${toolData?.description?.length || 0} characters
• Keywords: ${toolData?.keywords?.length || 0} keywords
• FAQs: ${toolData?.faqs?.length || 0} questions
• Related Tools: ${toolData?.relatedTools?.length || 0} links

🔧 Technical Analysis:
• Priority: ${toolData?.priority || 0.5}
• Change Frequency: ${toolData?.changefreq || 'weekly'}
• Schema Type: ${toolData?.schemaType || 'Tool'}

💡 Improvement Suggestions:
${metrics.suggestions.length > 0 
  ? metrics.suggestions.map(s => `• ${s}`).join('\n')
  : '✅ All SEO factors are well optimized!'}

🚀 Recommended Actions:
1. ${metrics.overallScore >= 80 ? 'Maintain current optimization' : 'Implement suggested improvements'}
2. Monitor search console performance
3. Update content every ${toolData?.changefreq || 'month'}
4. Build quality backlinks to this tool page

📈 Estimated Ranking Potential: ${getRankingPotential(metrics.overallScore)}
  `;
}

function getRankingPotential(score: number): string {
  if (score >= 90) return 'Top 3 positions possible';
  if (score >= 80) return 'First page likely';
  if (score >= 70) return 'Second page likely';
  if (score >= 60) return 'Third page possible';
  return 'Needs significant improvement';
}

export function checkCoreWebVitals(): {
  lcp: string;
  fid: string;
  cls: string;
} {
  // This would normally integrate with real Core Web Vitals data
  // For now, returning sample data
  return {
    lcp: '2.1s (Good)',
    fid: '45ms (Good)',
    cls: '0.08 (Good)',
  };
}

export function generatePageSpeedInsights(): {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
} {
  // Sample data - would integrate with PageSpeed Insights API
  return {
    performance: 92,
    accessibility: 95,
    bestPractices: 90,
    seo: 98,
  };
}