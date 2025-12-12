// components/CmsEditor.js

import dynamic from 'next/dynamic';
import { useState, forwardRef, useImperativeHandle } from 'react';

// Dynamically import TinyMCE Editor (client-side only) with loading component
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 border rounded-lg flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }
);

const CmsEditor = forwardRef(({ initialValue = '', placeholder = 'Start typing...' }, ref) => {
  const [content, setContent] = useState(initialValue);

  useImperativeHandle(ref, () => ({
    getContent: () => content,
    setContent: (html) => {
      setContent(html);
    },
  }), [content]);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key'}
      initialValue={initialValue}
      init={{
        height: 400,
        menubar: false,
        branding: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
        content_style: 'body { font-family: Inter, sans-serif; font-size: 16px; color: #111827; }',
        placeholder: placeholder,
      }}
      onEditorChange={(newContent) => setContent(newContent)}
    />
  );
});

CmsEditor.displayName = 'CmsEditor';

export default CmsEditor;

