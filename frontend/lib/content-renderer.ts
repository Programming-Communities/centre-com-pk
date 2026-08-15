// ✅ Convert ANY content to HTML — WordPress style

export function renderContent(content: string, type: 'html' | 'markdown' | 'auto' = 'auto'): string {
  if (!content) return '';
  
  // Auto-detect if not specified
  if (type === 'auto') {
    // Check if it's JSON (block editor data)
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return renderBlockEditorContent(parsed);
      }
    } catch {}
    
    // Check if it's HTML (contains tags)
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content; // Already HTML
    }
    
    // Check if it's Markdown
    if (/^#|^##|^###|\*\*|__|\*|_|`|```|^\- |^[0-9]+\. /.test(content)) {
      return markdownToHtml(content);
    }
    
    // Plain text — wrap in paragraphs
    return content.split('\n').filter(line => line.trim()).map(line => `<p>${line}</p>`).join('');
  }
  
  if (type === 'html') return content;
  if (type === 'markdown') return markdownToHtml(content);
  
  return content;
}

// ✅ Render Block Editor JSON
function renderBlockEditorContent(blocks: any[]): string {
  let html = '';
  
  for (const block of blocks) {
    const attrs = block.attributes || {};
    
    switch (block.type) {
      case 'paragraph':
        html += `<p>${attrs.content || ''}</p>`;
        break;
      case 'heading':
        const level = attrs.level || 2;
        html += `<h${level}>${attrs.content || ''}</h${level}>`;
        break;
      case 'image':
        html += `<img src="${attrs.src || ''}" alt="${attrs.alt || ''}" class="max-w-full rounded-lg" />`;
        if (attrs.caption) html += `<figcaption>${attrs.caption}</figcaption>`;
        break;
      case 'youtube':
        html += `<div class="youtube-container"><iframe src="https://www.youtube.com/embed/${attrs.videoId || ''}" frameborder="0" allowfullscreen></iframe></div>`;
        break;
      case 'video':
        html += `<video src="${attrs.src || ''}" controls class="max-w-full rounded-lg"></video>`;
        break;
      case 'list':
        const tag = attrs.ordered ? 'ol' : 'ul';
        const items = attrs.items?.map((item: string) => `<li>${item}</li>`).join('') || '';
        html += `<${tag}>${items}</${tag}>`;
        break;
      case 'code':
      case 'syntax_highlight':
        html += `<pre><code class="language-${attrs.language || 'javascript'}">${escapeHtml(attrs.content || '')}</code></pre>`;
        break;
      case 'html':
        html += attrs.content || '';
        break;
      case 'quote':
        html += `<blockquote>${attrs.content || ''}</blockquote>`;
        break;
      case 'table':
        html += renderTable(attrs);
        break;
      case 'button':
        html += `<a href="${attrs.url || '#'}" class="btn btn-${attrs.style || 'primary'}">${attrs.text || 'Button'}</a>`;
        break;
      case 'separator':
        html += `<hr />`;
        break;
      case 'spacer':
        html += `<div style="height:${attrs.height || 40}px"></div>`;
        break;
      case 'columns':
        html += `<div class="columns-${attrs.columns || 2}">`;
        for (let i = 0; i < (attrs.columns || 2); i++) {
          html += `<div class="column">Column ${i+1}</div>`;
        }
        html += `</div>`;
        break;
      case 'accordion':
        html += `<div class="accordion">`;
        if (attrs.items) {
          for (const item of attrs.items) {
            html += `<details><summary>${item.title || 'Item'}</summary><p>${item.content || ''}</p></details>`;
          }
        }
        html += `</div>`;
        break;
      case 'tabs':
        html += `<div class="tabs">`;
        if (attrs.items) {
          html += `<div class="tab-headers">`;
          for (let i = 0; i < attrs.items.length; i++) {
            html += `<button class="tab-btn ${i === 0 ? 'active' : ''}">${attrs.items[i].title || 'Tab'}</button>`;
          }
          html += `</div>`;
          html += `<div class="tab-contents">`;
          for (let i = 0; i < attrs.items.length; i++) {
            html += `<div class="tab-content ${i === 0 ? 'active' : ''}">${attrs.items[i].content || ''}</div>`;
          }
          html += `</div>`;
        }
        html += `</div>`;
        break;
      default:
        html += `<div class="unknown-block">${block.type} — ${attrs.content || ''}</div>`;
        break;
    }
  }
  
  return html;
}

// ✅ Markdown to HTML
function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Code blocks with language
  html = html.replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Bold and Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg" />');
  
  // Lists
  html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^[0-9]+\. (.+)$/gm, '<li>$1</li>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Paragraphs (avoid wrapping already formatted content)
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  let inBlockquote = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { result += '\n'; continue; }
    
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
        trimmed.startsWith('<li') || trimmed.startsWith('</ul') || trimmed.startsWith('</ol') ||
        trimmed.startsWith('<pre') || trimmed.startsWith('<code') || trimmed.startsWith('</code>') ||
        trimmed.startsWith('<blockquote') || trimmed.startsWith('</blockquote') ||
        trimmed.startsWith('<img') || trimmed.startsWith('<a') || trimmed.startsWith('</a>')) {
      result += trimmed + '\n';
    } else {
      result += `<p>${trimmed}</p>\n`;
    }
  }
  
  return result;
}

// ✅ Render Table
function renderTable(attrs: any): string {
  let html = '<table class="wp-table">';
  if (attrs.header) {
    html += '<thead><tr>';
    for (let i = 0; i < (attrs.cols || 3); i++) {
      html += `<th>Header ${i+1}</th>`;
    }
    html += '</tr></thead>';
  }
  html += '<tbody>';
  for (let i = 0; i < (attrs.rows || 3); i++) {
    html += '<tr>';
    for (let j = 0; j < (attrs.cols || 3); j++) {
      html += `<td>Cell ${i+1}-${j+1}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

// ✅ Escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
