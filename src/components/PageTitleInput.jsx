// components/PageEditor/PageTitleInput.js
import React from 'react';

const PageTitleInput = ({
  titleRef,
  title,
  onTitleChange,
  isReadOnly,
  isLoading,
  createdPageData,
  isEditMode
}) => {
  return (
    <input
      ref={titleRef}
      type="text"
      value={title}
      onChange={onTitleChange}
      placeholder="Untitled"
      readOnly={isReadOnly}
      className={`w-full bg-transparent text-white text-4xl font-bold placeholder-gray-500 border-none outline-none mb-4 ${
        isReadOnly ? 'cursor-default' : 'cursor-text'
      }`}
      style={{
        fontSize: '3rem',
        lineHeight: '1.2',
        minHeight: '4rem',
      }}
      disabled={isLoading || (!createdPageData && !isEditMode)}
    />
  );
};

export default PageTitleInput;
