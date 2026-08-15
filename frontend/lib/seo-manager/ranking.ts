// Ranking Tracker — Professional Grade

export interface RankingData {
  toolSlug: string;
  keyword: string;
  position: number;
  previousPosition: number;
  change: number;
  serpFeatures: string[];
  searchVolume: number;
  trafficEstimate: number;
  clickRate: number;
}

// CTR by position (Google organic CTR curve)
export function getCTRByPosition(position: number): number {
  const ctrMap: Record<number, number> = {
    1: 31.7, 2: 24.7, 3: 18.7, 4: 13.6, 5: 9.5,
    6: 6.2, 7: 4.2, 8: 3.1, 9: 2.8, 10: 2.4,
    11: 1.5, 12: 1.2, 13: 1.0, 14: 0.9, 15: 0.8,
    16: 0.7, 17: 0.6, 18: 0.5, 19: 0.5, 20: 0.4
  };
  if (position <= 0) return 0;
  if (position > 20) return 0.3;
  return ctrMap[position] || 0.4;
}

// Traffic estimator
export function estimateTraffic(searchVolume: number, position: number): number {
  const ctr = getCTRByPosition(position);
  return Math.round((searchVolume * ctr) / 100);
}

// Position change analysis
export function analyzePositionChange(
  currentPositions: { keyword: string; position: number }[],
  previousPositions: { keyword: string; position: number }[]
): {
  improved: { keyword: string; from: number; to: number; change: number }[];
  declined: { keyword: string; from: number; to: number; change: number }[];
  same: { keyword: string; position: number }[];
  new: { keyword: string; position: number }[];
  avgPosition: number;
  totalChange: number;
} {
  const improved: any[] = [];
  const declined: any[] = [];
  const same: any[] = [];
  const new_: any[] = [];

  const prevMap = new Map(previousPositions.map(p => [p.keyword, p.position]));

  let totalPos = 0;
  let totalChange = 0;

  for (const curr of currentPositions) {
    totalPos += curr.position;
    const prevPos = prevMap.get(curr.keyword);

    if (prevPos === undefined) {
      new_.push({ keyword: curr.keyword, position: curr.position });
    } else if (curr.position < prevPos) {
      const change = prevPos - curr.position;
      totalChange += change;
      improved.push({ keyword: curr.keyword, from: prevPos, to: curr.position, change });
    } else if (curr.position > prevPos) {
      const change = curr.position - prevPos;
      totalChange -= change;
      declined.push({ keyword: curr.keyword, from: prevPos, to: curr.position, change });
    } else {
      same.push({ keyword: curr.keyword, position: curr.position });
    }
  }

  return {
    improved,
    declined,
    same,
    new: new_,
    avgPosition: currentPositions.length > 0 ? totalPos / currentPositions.length : 0,
    totalChange
  };
}

// SERP feature detection
export function detectSERPFeatures(snippet: string): string[] {
  const features: string[] = [];

  if (snippet.includes('featured snippet') || snippet.includes('position":0')) features.push('featured_snippet');
  if (snippet.includes('people also ask') || snippet.includes('related_questions')) features.push('people_also_ask');
  if (snippet.includes('video') || snippet.includes('youtube')) features.push('video_carousel');
  if (snippet.includes('image') || snippet.includes('img')) features.push('image_pack');
  if (snippet.includes('knowledge_graph') || snippet.includes('kg:')) features.push('knowledge_graph');
  if (snippet.includes('local_pack') || snippet.includes('places')) features.push('local_pack');
  if (snippet.includes('top_stories') || snippet.includes('news')) features.push('top_stories');
  if (snippet.includes('twitter') || snippet.includes('tweet')) features.push('twitter_carousel');

  return features;
}

// Ranking trend calculator
export function calculateTrend(positions: number[]): 'up' | 'down' | 'stable' {
  if (positions.length < 2) return 'stable';

  const recent = positions.slice(-7); // Last 7 days
  const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
  const secondHalf = recent.slice(Math.floor(recent.length / 2));

  const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (avg2 < avg1 - 1) return 'up';     // Position decreased = ranking up
  if (avg2 > avg1 + 1) return 'down';    // Position increased = ranking down
  return 'stable';
}

// Competitor position comparator
export function compareWithCompetitor(
  ourPositions: { keyword: string; position: number }[],
  competitorPositions: { keyword: string; position: number }[]
): {
  weLead: string[];
  theyLead: string[];
  tied: string[];
  avgGap: number;
} {
  const weLead: string[] = [];
  const theyLead: string[] = [];
  const tied: string[] = [];
  let totalGap = 0;
  let comparisons = 0;

  const compMap = new Map(competitorPositions.map(p => [p.keyword, p.position]));

  for (const ours of ourPositions) {
    const theirs = compMap.get(ours.keyword);
    if (theirs === undefined) continue;

    const gap = theirs - ours;
    totalGap += Math.abs(gap);
    comparisons++;

    if (ours.position < theirs) weLead.push(ours.keyword);
    else if (ours.position > theirs) theyLead.push(ours.keyword);
    else tied.push(ours.keyword);
  }

  return {
    weLead,
    theyLead,
    tied,
    avgGap: comparisons > 0 ? totalGap / comparisons : 0
  };
}

// Ranking report generator
export function generateReport(
  toolName: string,
  rankings: RankingData[],
  avgPosition: number,
  trend: string,
  competitorGap: number
): string {
  const top3 = rankings.filter(r => r.position <= 3).length;
  const top10 = rankings.filter(r => r.position <= 10).length;
  const totalTraffic = rankings.reduce((sum, r) => sum + r.trafficEstimate, 0);

  return `
📊 SEO RANKING REPORT: ${toolName}
═══════════════════════════════
📅 Date: ${new Date().toLocaleDateString()}

📈 OVERVIEW:
• Average Position: ${avgPosition.toFixed(1)}
• Trend: ${trend === 'up' ? '↗️ Improving' : trend === 'down' ? '↘️ Declining' : '➡️ Stable'}
• Keywords in Top 3: ${top3}
• Keywords in Top 10: ${top10}
• Total Keywords Tracked: ${rankings.length}
• Estimated Monthly Traffic: ${totalTraffic.toLocaleString()}

🏆 TOP KEYWORDS:
${rankings.filter(r => r.position <= 5).map(r => `  #${r.position} — ${r.keyword} (${r.trafficEstimate.toLocaleString()} visits/mo)`).join('\n')}

⚠️ NEEDS IMPROVEMENT:
${rankings.filter(r => r.position > 10).slice(0, 5).map(r => `  #${r.position} — ${r.keyword}`).join('\n')}

🆚 COMPETITOR GAP: ${competitorGap.toFixed(1)} positions
`;
}

// Alert checker
export function checkAlerts(
  rankings: RankingData[],
  alerts: { alertType: string; threshold: number; keyword?: string }[]
): { triggered: boolean; message: string }[] {
  const results: { triggered: boolean; message: string }[] = [];

  for (const alert of alerts) {
    if (alert.alertType === 'position_drop') {
      const keyword = rankings.find(r => r.keyword === alert.keyword);
      if (keyword && keyword.position > alert.threshold) {
        results.push({
          triggered: true,
          message: `⚠️ "${alert.keyword}" dropped to position #${keyword.position} (threshold: #${alert.threshold})`
        });
      } else {
        results.push({ triggered: false, message: '' });
      }
    }

    if (alert.alertType === 'traffic_drop') {
      const totalTraffic = rankings.reduce((s, r) => s + r.trafficEstimate, 0);
      if (totalTraffic < alert.threshold) {
        results.push({
          triggered: true,
          message: `📉 Total traffic dropped to ${totalTraffic} (threshold: ${alert.threshold})`
        });
      } else {
        results.push({ triggered: false, message: '' });
      }
    }

    if (alert.alertType === 'competitor_overtake') {
      if (rankings.some(r => r.position > 10)) {
        results.push({
          triggered: true,
          message: `⚠️ Competitor may be overtaking on some keywords`
        });
      } else {
        results.push({ triggered: false, message: '' });
      }
    }
  }

  return results;
}
