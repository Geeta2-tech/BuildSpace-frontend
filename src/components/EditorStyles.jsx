// components/PageEditor/EditorStyles.js
import React from 'react';

const EditorStyles = ({ content }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
/* Hide empty state when content exists */
.codex-editor--empty {
  display: ${content ? 'none' : 'block'} !important;
  opacity: 0.7 !important;
}

/* Base editor styles */
.codex-editor {
  color: #ffffff !important;
  --active-bg: #3b82f6 !important;
  --active-text: #ffffff !important;
}

/* Read-only mode styles */
.codex-editor--readonly {
  opacity: 0.9;
}
.codex-editor--readonly .ce-block {
  cursor: default !important;
}
.codex-editor--readonly .ce-toolbar {
  display: none !important;
}

/* Content blocks */
.ce-block__content, 
.ce-paragraph, 
.ce-header {
  color: #ffffff !important;
}
.ce-paragraph { 
  font-size: 1.1rem; 
  line-height: 1.6; 
}

/* Code block - high contrast */
.ce-code__textarea {
  background-color: #f0f2f5 !important;
  color: #1a1a1a !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 4px !important;
}

/* Toolbar styles - hide in read-only mode */
.ce-toolbar {
  background: #2d3748 !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

.ce-toolbar__button {
  color: #e2e8f0 !important;
  transition: all 0.15s ease !important;
}

.ce-toolbar__plus {
  color: white !important;
  background: #3b82f6 !important;
  border-radius: 4px !important;
}
.ce-toolbar__plus:hover {
  background: #2563eb !important;
  transform: scale(1.05) !important;
}

.ce-toolbar__settings-btn {
  color: #e2e8f0 !important;
}
.ce-toolbar__settings-btn:hover {
  color: white !important;
  background: #3b82f6 !important;
}

.ce-toolbar__button:hover {
  color: white !important;
  background: #3b82f6 !important;
}

/* Inline toolbar */
.ce-inline-toolbar {
  background: #ffffff !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
  border-radius: 6px !important;
}

.ce-inline-tool {
  color: #4a5568 !important;
}
.ce-inline-tool:hover,
.ce-inline-tool--active {
  color: white !important;
  background: #3b82f6 !important;
}

/* Popover menus */
.ce-popover {
  background: #ffffff !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.ce-popover__item {
  color: #4a5568 !important;
  transition: all 0.1s ease !important;
}
.ce-popover__item:hover {
  background: #3b82f6 !important;
  color: white !important;
  transform: translateX(2px);
}

.ce-popover__item-icon {
  background: #3b82f6 !important;
  border-radius: 4px !important;
}

/* Active states */
[class*="--active"] {
  background: #3b82f6 !important;
  color: white !important;
}

/* Focus states */
[class*="--focused"] {
  box-shadow: 0 0 0 2px #3b82f6 !important;
}
`,
      }}
    />
  );
};

export default EditorStyles;