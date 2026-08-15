// lib/seo/dynamicOptimizer.ts - CORRECTED VERSION
import { TOOL_SEO_DATA } from './toolSeoData';
import { ToolSEOData } from './types';

export interface SEOOptimization {
  toolSlug: string;
  currentScore: number;
  targetScore: number;
  improvements: string[];
  priority: 'high' | 'medium' | 'low';
  expectedTraffic: number;
}

export interface RankingOpportunity {
  keyword: string;
  currentPosition: number;
  targetPosition: number;
  difficulty: number;
  monthlySearches: number;
  cpc: number;
  competitorAnalysis: {
    top3Competitors: string[];
    contentGaps: string[];
    backlinkCounts: number[];
  };
  actionPlan: string[];
  estimatedTimeToRank: string;
}

// ✅ SINGLE CLASS with ALL functionality
export class GoogleRankingOptimizer {
  private tools: Record<string, ToolSEOData>;
  
  constructor() {
    this.tools = TOOL_SEO_DATA;
  }
  
  // ✅ Bulk SEO Analysis
  analyzeAllTools(): SEOOptimization[] {
    const optimizations: SEOOptimization[] = [];
    
    Object.entries(this.tools).forEach(([slug, toolData]) => {
      const score = this.calculateSEOScore(toolData);
      const improvements = this.generateImprovements(toolData);
      
      optimizations.push({
        toolSlug: slug,
        currentScore: score,
        targetScore: 85,
        improvements,
        priority: score < 60 ? 'high' : score < 75 ? 'medium' : 'low',
        expectedTraffic: this.calculateExpectedTraffic(toolData)
      });
    });
    
    return optimizations.sort((a, b) => 
      (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore)
    );
  }
  
  // ✅ Individual Tool Ranking Analysis
  async analyzeKeywordForTool(keyword: string, toolSlug: string): Promise<RankingOpportunity> {
    const serpData = await this.fetchSERPData(keyword);
    const competitorData = await this.analyzeCompetitors(serpData.top10);
    
    return {
      keyword,
      currentPosition: await this.getCurrentPosition(keyword, toolSlug),
      targetPosition: 1,
      difficulty: this.calculateDifficulty(serpData),
      monthlySearches: serpData.monthlySearches,
      cpc: serpData.cpc,
      competitorAnalysis: {
        top3Competitors: competitorData.top3,
        contentGaps: this.findContentGaps(serpData, toolSlug),
        backlinkCounts: competitorData.backlinks
      },
      actionPlan: this.generateActionPlan(serpData, competitorData),
      estimatedTimeToRank: this.estimateRankingTime(serpData.difficulty)
    };
  }
  
  // ✅ Generate Ranking Report
  async generateRankingReport(toolSlug: string): Promise<string> {
    const toolData = this.tools[toolSlug];
    if (!toolData) return 'Tool not found';
    
    const keywordAnalysis = await Promise.all(
      toolData.keywords.slice(0, 5).map(keyword => 
        this.analyzeKeywordForTool(keyword, toolSlug)
      )
    );
    
    return `
# GOOGLE RANKING REPORT: ${toolData.title}
Generated: ${new Date().toISOString()}

## CURRENT STATUS:
- Tool: ${toolData.title}
- Category: ${toolData.category}
- Total Keywords: ${toolData.keywords?.length || 0}
- Current Estimated Traffic: ${this.estimateTraffic(toolData)}/month

## KEYWORD ANALYSIS:
${keywordAnalysis.map((analysis, index) => `
### ${index + 1}. "${analysis.keyword}"
- **Current Position:** #${analysis.currentPosition}
- **Target Position:** #${analysis.targetPosition}
- **Monthly Searches:** ${analysis.monthlySearches.toLocaleString()}
- **Difficulty:** ${analysis.difficulty}/100
- **CPC:** $${analysis.cpc}
- **Top Competitors:** ${analysis.competitorAnalysis.top3Competitors.join(', ')}
- **Content Gaps:** ${analysis.competitorAnalysis.contentGaps.slice(0, 3).join(', ')}
- **Action Plan:**
  ${analysis.actionPlan.map(action => `  - ${action}`).join('\n  ')}
- **Estimated Time to #1:** ${analysis.estimatedTimeToRank}
`).join('\n')}

## IMMEDIATE ACTIONS:
1. Create comparison content vs paid tools
2. Add 5+ detailed FAQs for featured snippets
3. Optimize page speed to 100/100
4. Build 10+ internal links from related tools
5. Add user testimonials for E-E-A-T
    `;
  }
  
  // ✅ Bulk Optimization Report
  generateBulkOptimizationReport(): string {
    const optimizations = this.analyzeAllTools();
    const highPriority = optimizations.filter(o => o.priority === 'high');
    const mediumPriority = optimizations.filter(o => o.priority === 'medium');
    
    return `
# BULK SEO OPTIMIZATION REPORT
Generated: ${new Date().toISOString()}
Total Tools: ${optimizations.length}

## PRIORITY SUMMARY:
🔴 HIGH Priority: ${highPriority.length} tools
🟡 MEDIUM Priority: ${mediumPriority.length} tools  
🟢 LOW Priority: ${optimizations.length - highPriority.length - mediumPriority.length} tools

## TOP 10 TOOLS NEEDING IMMEDIATE ATTENTION:
${highPriority.slice(0, 10).map((tool, index) => `
${index + 1}. ${tool.toolSlug}
   • Current Score: ${tool.currentScore}/100
   • Target Score: 85/100
   • Expected Traffic: ${tool.expectedTraffic.toLocaleString()}/month
   • Improvements Needed:
     ${tool.improvements.map(imp => `     - ${imp}`).join('\n     ')}
`).join('\n')}

## EXPECTED RESULTS AFTER OPTIMIZATION:
• 30-50% increase in organic traffic within 3 months
• 20+ tools ranking on Google first page
• 5+ featured snippets captured
`;
  }
  
  // ✅ Private Helper Methods
  private calculateSEOScore(toolData: ToolSEOData): number {
    let score = 50;
    if (toolData.description?.length > 150) score += 10;
    if (toolData.keywords?.length >= 5) score += 10;
    if (toolData.faqs?.length >= 3) score += 10;
    if (toolData.schemaType) score += 10;
    return Math.min(score, 100);
  }
  
  private generateImprovements(toolData: ToolSEOData): string[] {
    const improvements: string[] = [];
    
    if (!toolData.faqs || toolData.faqs.length < 5) {
      improvements.push('Add 5+ detailed FAQs with structured answers');
    }
    
    if (!toolData.keywords || toolData.keywords.length < 10) {
      improvements.push('Expand keywords to 10+ including long-tail variations');
    }
    
    if (!toolData.description?.includes('free') || !toolData.description?.includes('online')) {
      improvements.push('Optimize description to include "free online" keywords');
    }
    
    improvements.push('Create "vs paid tools" comparison content');
    improvements.push('Add user testimonials section');
    
    return improvements;
  }
  
  private calculateExpectedTraffic(toolData: ToolSEOData): number {
    const baseTraffic = 1000;
    const keywordMultiplier = Math.min((toolData.keywords?.length || 0) * 100, 5000);
    const faqMultiplier = (toolData.faqs?.length || 0) * 200;
    return baseTraffic + keywordMultiplier + faqMultiplier;
  }
  
  private async fetchSERPData(keyword: string): Promise<any> {
    // Mock data - replace with actual API
    return {
      top10: [],
      monthlySearches: 1000,
      cpc: 1.5,
      difficulty: Math.floor(Math.random() * 100)
    };
  }
  
  private async analyzeCompetitors(serpResults: any[]): Promise<any> {
    return {
      top3: ['SmallPDF', 'ILovePDF', 'OnlineConvert'],
      backlinks: [100, 150, 200],
      contentGaps: []
    };
  }
  
  private async getCurrentPosition(keyword: string, toolSlug: string): Promise<number> {
    // Mock position - replace with actual tracking
    return Math.floor(Math.random() * 20) + 1;
  }
  
  private calculateDifficulty(serpData: any): number {
    return serpData.difficulty;
  }
  
  private findContentGaps(serpData: any, toolSlug: string): string[] {
    return ['FAQ section', 'Video tutorial', 'Comparison table'];
  }
  
  private generateActionPlan(serpData: any, competitorData: any): string[] {
    return [
      'Create detailed tutorial with screenshots',
      'Add FAQ section with 10+ questions',
      'Build comparison table vs paid tools',
      'Add user review section',
      'Optimize meta description with primary keyword'
    ];
  }
  
  private estimateRankingTime(difficulty: number): string {
    if (difficulty < 30) return '2-4 weeks';
    if (difficulty < 60) return '1-2 months';
    if (difficulty < 80) return '3-4 months';
    return '4-6 months';
  }
  
  private estimateTraffic(toolData: ToolSEOData): number {
    return (toolData.keywords?.length || 0) * 150;
  }
}