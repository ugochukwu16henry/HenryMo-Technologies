// components/CmsEditor.js

import { Editor } from '@tinymce/tinymce-react';

import { useState, forwardRef, useImperativeHandle } from 'react';



const CmsEditor = forwardRef(({ initialValue = '', placeholder = 'Start typing...' }, ref) => {

  const [content, setContent] = useState(initialValue);



  useImperativeHandle(ref, () => ({

    getContent: () => content,

    setContent: (html) => setContent(html),

  }));



  return (

    <Editor

      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key'} // Optional: get free key at tinymce.com

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



export default CmsEditor;

