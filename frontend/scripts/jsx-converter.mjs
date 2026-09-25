import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// Helper to convert CSS style string to JSX style object string
function styleStringToJsx(styleStr) {
  if (!styleStr) return null;
  const declarations = styleStr.split(';').map(s => s.trim()).filter(Boolean);
  const obj = {};
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    let prop = decl.slice(0, colonIdx).trim();
    let val = decl.slice(colonIdx + 1).trim();
    // camelCase property
    prop = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    obj[prop] = val;
  }
  return '{' + JSON.stringify(obj) + '}';
}

// Convert HTML element to JSX string recursively
function nodeToJsx(node, $) {
  if (node.type === 'text') {
    // Escape { and } in raw text if not in expressions
    let text = node.data;
    // Don't modify text if empty or whitespace only
    return text.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
  }

  if (node.type === 'comment') {
    return `{/* ${node.data.trim()} */}`;
  }

  if (node.type === 'tag') {
    const tagName = node.tagName.toLowerCase();
    const isSelfClosing = ['img', 'input', 'br', 'hr', 'source', 'area', 'col', 'meta', 'link'].includes(tagName);

    let attrs = '';
    for (const [key, val] of Object.entries(node.attribs || {})) {
      if (key === 'class') {
        attrs += ` className="${val}"`;
      } else if (key === 'for') {
        attrs += ` htmlFor="${val}"`;
      } else if (key === 'style') {
        attrs += ` style=${styleStringToJsx(val)}`;
      } else if (key === 'tabindex') {
        attrs += ` tabIndex="${val}"`;
      } else if (key === 'autocomplete') {
        attrs += ` autoComplete="${val}"`;
      } else if (key === 'autofocus') {
        attrs += ` autoFocus={true}`;
      } else if (key === 'novalidate') {
        attrs += ` noValidate={true}`;
      } else if (key === 'readonly') {
        attrs += ` readOnly={true}`;
      } else if (key === 'maxlength') {
        attrs += ` maxLength="${val}"`;
      } else if (key === 'minlength') {
        attrs += ` minLength="${val}"`;
      } else if (key === 'colspan') {
        attrs += ` colSpan="${val}"`;
      } else if (key === 'rowspan') {
        attrs += ` rowSpan="${val}"`;
      } else if (key === 'src') {
        let srcVal = val;
        if (srcVal.startsWith('images/')) srcVal = '/' + srcVal;
        attrs += ` src="${srcVal}"`;
      } else if (key === 'href') {
        let hrefVal = val;
        if (hrefVal === 'index.html') hrefVal = '/';
        else if (hrefVal === 'about.html') hrefVal = '/about';
        else if (hrefVal === 'services.html') hrefVal = '/services';
        else if (hrefVal === 'ourwork.html') hrefVal = '/ourwork';
        else if (hrefVal === 'gallery.html') hrefVal = '/gallery';
        else if (hrefVal === 'contact.html') hrefVal = '/contact';
        else if (hrefVal === 'index.html#donate') hrefVal = '/#donate';
        else if (hrefVal === 'contact.html#inquiry') hrefVal = '/contact#inquiry';
        attrs += ` href="${hrefVal}"`;
      } else if (key.includes('-') && !key.startsWith('data-') && !key.startsWith('aria-')) {
        // SVG attribute camelCasing
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        attrs += ` ${camelKey}="${val}"`;
      } else {
        attrs += ` ${key}="${val}"`;
      }
    }

    if (isSelfClosing) {
      return `<${tagName}${attrs} />`;
    }

    let children = '';
    for (const child of node.children || []) {
      children += nodeToJsx(child, $);
    }

    return `<${tagName}${attrs}>${children}</${tagName}>`;
  }

  return '';
}

export { nodeToJsx, styleStringToJsx };
