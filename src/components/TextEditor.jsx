// components/PageEditor/TextEditor.js
import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';

const TextEditor = ({
  contentRef,
  content,
  setContent,
  isLoading,
  isReadOnly,
  currentPage,
  isEditMode,
  ws,
  currentBlockId,
  isEditorReady,
  setIsEditorReady,
  editorInstance
}) => {
  // Initialize Editor.js
  useEffect(() => {
    if (!contentRef.current || isLoading) return;

    if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
      editorInstance.current.destroy();
      setIsEditorReady(false);
    }

    // Convert content to Editor.js format
    let editorData = { blocks: [] };
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
          editorData = parsed;
        } else {
          throw new Error('Not Editor.js format');
        }
      } catch (e) {
        const lines = content.split('\n').filter((line) => line.trim() !== '');
        if (lines.length > 0) {
          editorData = {
            blocks: lines.map((line) => ({
              type: 'paragraph',
              data: { text: line.trim() },
            })),
          };
        }
      }
    }

    editorInstance.current = new EditorJS({
      holder: contentRef.current,
      readOnly: isReadOnly,
      placeholder: isReadOnly 
        ? 'This page is read-only' 
        : (editorData.blocks && editorData.blocks.length > 0 ? '' : 'Start writing...'),
      tools: {
        header: Header,
        list: List,
        code: Code,
        quote: Quote,
      },
      data: editorData,
      onChange: async () => {
        if (isReadOnly) return;
        
        if (editorInstance.current && ws && ws.readyState === WebSocket.OPEN) {
          try {
            const outputData = await editorInstance.current.save();
            const jsonString = JSON.stringify(outputData);

            const pageId = isEditMode ? currentPage.id : `new-${Date.now()}`;
            ws.send(
              JSON.stringify({
                type: 'text_update',
                content: jsonString,
                pageId: pageId,
                blockId: currentBlockId,
              })
            );
          } catch (error) {
            console.error('Error getting editor data for WS:', error);
          }
        }
      },
      onReady: () => {
        setIsEditorReady(true);
        if (editorData.blocks && editorData.blocks.length > 0) {
          const placeholder = document.querySelector('.codex-editor--empty');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
        }
      },
    });

    return () => {
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        editorInstance.current.destroy();
      }
    };
  }, [isLoading, content, currentPage?.id, isReadOnly]);

  return (
    <div className="mt-4">
      <div
        ref={contentRef}
        style={{
          minHeight: '400px',
          lineHeight: '1.6',
        }}
        className="text-white"
      />
    </div>
  );
};

export default TextEditor;