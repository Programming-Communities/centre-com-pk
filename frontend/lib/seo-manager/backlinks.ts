// Backlink Manager — Professional Grade

export interface Backlink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  pageAuthority: number;
  isDofollow: boolean;
  isActive: boolean;
}

// Domain Authority estimator (simplified)
export function estimateDomainAuthority(domain: string): number {
  const daMap: Record<string, number> = {
    'google.com': 100, 'facebook.com': 96, 'youtube.com': 95, 'wikipedia.org': 91,
    'twitter.com': 94, 'linkedin.com': 93, 'github.com': 89, 'medium.com': 88,
    'reddit.com': 87, 'quora.com': 79, 'stackoverflow.com': 82, 'wordpress.com': 85,
    'blogger.com': 76, 'tumblr.com': 72, 'pinterest.com': 84, 'instagram.com': 90,
  };

  for (const [key, da] of Object.entries(daMap)) {
    if (domain.includes(key)) return da;
  }

  return Math.floor(Math.random() * 40) + 10;
}

// Backlink quality score
export function calculateBacklinkQuality(backlink: Backlink): {
  score: number;
  grade: string;
  isValuable: boolean;
} {
  let score = 0;

  // Domain Authority (40%)
  score += (backlink.domainAuthority / 100) * 40;

  // Page Authority (20%)
  score += (backlink.pageAuthority / 100) * 20;

  // Dofollow bonus (25%)
  if (backlink.isDofollow) score += 25;

  // Anchor text relevance (10%)
  if (backlink.anchorText && backlink.anchorText.length > 3) score += 10;

  // Active link (5%)
  if (backlink.isActive) score += 5;

  let grade = 'F';
  if (score >= 80) grade = 'A+';
  else if (score >= 70) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';

  return {
    score: Math.round(score),
    grade,
    isValuable: score >= 40
  };
}

// Backlink gap analysis
export function analyzeBacklinkGap(
  ourBacklinks: Backlink[],
  competitorBacklinks: Backlink[]
): {
  missingOpportunities: string[];
  commonSources: string[];
  ourUniqueSources: string[];
  totalGap: number;
} {
  const ourDomains = new Set(ourBacklinks.map(b => new URL(b.sourceUrl).hostname));
  const compDomains = new Set(competitorBacklinks.map(b => new URL(b.sourceUrl).hostname));

  const missingOpportunities = [...compDomains].filter(d => !ourDomains.has(d));
  const commonSources = [...ourDomains].filter(d => compDomains.has(d));
  const ourUniqueSources = [...ourDomains].filter(d => !compDomains.has(d));

  return {
    missingOpportunities,
    commonSources,
    ourUniqueSources,
    totalGap: missingOpportunities.length
  };
}

// Link building opportunity finder
export function findLinkOpportunities(
  toolName: string,
  category: string
): { type: string; description: string; searchQuery: string }[] {
  return [
    {
      type: 'guest_post',
      description: `Write guest post about "${toolName}" on tech blogs`,
      searchQuery: `"write for us" ${category} blog`
    },
    {
      type: 'resource_page',
      description: `Get listed on "${category}" resource pages`,
      searchQuery: `"${category} resources" "useful links"`
    },
    {
      type: 'broken_link',
      description: `Find broken links related to ${toolName} and suggest yours`,
      searchQuery: `"${toolName}" "404" OR "page not found"`
    },
    {
      type: 'competitor_backlink',
      description: `Replicate competitor backlinks for ${toolName}`,
      searchQuery: `link:competitor.com ${toolName}`
    },
    {
      type: 'forum_mention',
      description: `Mention ${toolName} in relevant forum discussions`,
      searchQuery: `site:reddit.com OR site:quora.com "${category} tool"`
    },
    {
      type: 'directory',
      description: `Submit ${toolName} to tool directories`,
      searchQuery: `"${category} tools" "submit tool" directory`
    },
    {
      type: 'social_share',
      description: `Share ${toolName} on social media with hashtags`,
      searchQuery: `#${category.replace('-', '')} #freetools #online`
    }
  ];
}

// Anchor text optimizer
export function optimizeAnchorText(
  keyword: string,
  existingAnchors: string[]
): { recommended: string; variations: string[] } {
  const variations = [
    keyword,
    `${keyword} tool`,
    `free ${keyword}`,
    `online ${keyword}`,
    `best ${keyword}`,
    `${keyword} online free`,
    `use ${keyword}`,
    `try ${keyword}`,
    keyword.replace(/-/g, ' '),
    `${keyword} calculator`
  ];

  const existing = new Set(existingAnchors.map(a => a.toLowerCase()));
  const recommended = variations.find(v => !existing.has(v.toLowerCase())) || variations[0];

  return { recommended, variations };
}

// Backlink health checker
export function checkBacklinkHealth(backlinks: Backlink[]): {
  total: number;
  active: number;
  broken: number;
  dofollow: number;
  nofollow: number;
  avgDA: number;
  healthScore: number;
} {
  const total = backlinks.length;
  const active = backlinks.filter(b => b.isActive).length;
  const broken = total - active;
  const dofollow = backlinks.filter(b => b.isDofollow).length;
  const nofollow = total - dofollow;
  const avgDA = backlinks.reduce((s, b) => s + b.domainAuthority, 0) / total;

  const healthScore = Math.round(
    ((active / total) * 40) + ((dofollow / total) * 30) + ((Math.min(avgDA, 80) / 80) * 30)
  );

  return { total, active, broken, dofollow, nofollow, avgDA: Math.round(avgDA), healthScore };
}
