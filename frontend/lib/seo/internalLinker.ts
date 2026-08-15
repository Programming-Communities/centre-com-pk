// lib/seo/internalLinker.ts
import { InternalLink } from './types';
import { TOOL_SEO_DATA, getToolsByCategory } from './toolSeoData';
import { CATEGORY_NAMES, CATEGORY_DESCRIPTIONS } from './constants';

export function getRelatedTools(currentToolSlug: string, limit: number = 5): InternalLink[] {
  const currentTool = TOOL_SEO_DATA[currentToolSlug];
  if (!currentTool) return [];
  
  const allTools = Object.values(TOOL_SEO_DATA);
  
  // Filter out current tool and get tools from same category
  const sameCategoryTools = allTools.filter(tool => 
    tool.slug !== currentToolSlug && 
    tool.category === currentTool.category
  );
  
  // If we have related tools specified, prioritize those
  const relatedTools = currentTool.relatedTools || [];
  const prioritizedTools: InternalLink[] = [];
  
  // Add specified related tools first
  relatedTools.forEach(slug => {
    const tool = TOOL_SEO_DATA[slug];
    if (tool) {
      prioritizedTools.push({
        title: tool.title,
        url: `/tools/${tool.category}/${tool.slug}`,
        description: tool.description.substring(0, 100) + '...',
        category: tool.category,
      });
    }
  });
  
  // Add other tools from same category
  sameCategoryTools.forEach(tool => {
    if (!prioritizedTools.some(t => t.url.includes(tool.slug)) && prioritizedTools.length < limit) {
      prioritizedTools.push({
        title: tool.title,
        url: `/tools/${tool.category}/${tool.slug}`,
        description: tool.description.substring(0, 100) + '...',
        category: tool.category,
      });
    }
  });
  
  // Fill remaining spots with popular tools
  if (prioritizedTools.length < limit) {
    const popularTools = allTools
      .filter(tool => tool.slug !== currentToolSlug && !prioritizedTools.some(t => t.url.includes(tool.slug)))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, limit - prioritizedTools.length);
    
    popularTools.forEach(tool => {
      prioritizedTools.push({
        title: tool.title,
        url: `/tools/${tool.category}/${tool.slug}`,
        description: tool.description.substring(0, 100) + '...',
        category: tool.category,
      });
    });
  }
  
  return prioritizedTools.slice(0, limit);
}

export function getCategoryTools(category: string, excludeSlug?: string): InternalLink[] {
  const tools = getToolsByCategory(category);
  
  return tools
    .filter(tool => tool.slug !== excludeSlug)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map(tool => ({
      title: tool.title,
      url: `/tools/${tool.category}/${tool.slug}`,
      description: tool.description.substring(0, 80) + '...',
      category: tool.category,
    }));
}

export function getPopularTools(limit: number = 8): InternalLink[] {
  const allTools = Object.values(TOOL_SEO_DATA);
  
  return allTools
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, limit)
    .map(tool => ({
      title: tool.title,
      url: `/tools/${tool.category}/${tool.slug}`,
      description: tool.description.substring(0, 80) + '...',
      category: tool.category,
    }));
}

export function getCategoryLinks(): InternalLink[] {
  const categories = Object.keys(CATEGORY_NAMES);
  
  return categories.map(category => ({
    title: CATEGORY_NAMES[category],
    url: `/tools/${category}`,
    description: CATEGORY_DESCRIPTIONS[category] || '',
    category,
  }));
}

export function generateInternalLinksHTML(links: InternalLink[], title: string = 'Related Tools'): string {
  if (links.length === 0) return '';
  
  let html = `<div class="internal-links-section">
    <h3>${title}</h3>
    <div class="internal-links-grid">`;
  
  links.forEach(link => {
    html += `
      <a href="${link.url}" class="internal-link-card" title="${link.title}">
        <div class="internal-link-content">
          <h4>${link.title}</h4>
          <p>${link.description}</p>
          <span class="category-badge">${link.category.replace('-', ' ')}</span>
        </div>
      </a>
    `;
  });
  
  html += `</div></div>`;
  return html;
}

export function getSiloLinks(currentCategory: string): {
  parentCategory?: InternalLink;
  siblingCategories: InternalLink[];
  childTools: InternalLink[];
} {
  const categories = Object.keys(CATEGORY_NAMES);
  const siblingCategories = categories
    .filter(cat => cat !== currentCategory)
    .map(category => ({
      title: CATEGORY_NAMES[category],
      url: `/tools/${category}`,
      description: CATEGORY_DESCRIPTIONS[category] || '',
      category,
    }));
  
  const childTools = getCategoryTools(currentCategory);
  
  return {
    siblingCategories,
    childTools,
  };
}