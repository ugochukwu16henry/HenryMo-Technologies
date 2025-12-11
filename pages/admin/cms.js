// pages/admin/cms.js

import { useState, useRef } from 'react';

import CmsEditor from '../../components/CmsEditor';

import ProtectedRoute from '../../components/ProtectedRoute';



export default function CmsPage() {

  const [title, setTitle] = useState('');

  const [slug, setSlug] = useState('');

  const editorRef = useRef();



  const handleSubmit = async (e) => {

    e.preventDefault();

    const content = editorRef.current?.getContent();

    if (!title || !slug || !content) return alert('All fields required');



    const token = localStorage.getItem('auth_token') || 
                  document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    const response = await fetch('/api/cms/pages', {

      method: 'POST',

      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },

      body: JSON.stringify({ title, slug, content }),

    });

    if (!response.ok) {
      const error = await response.json();
      return alert(error.error || 'Failed to create page');
    }

    alert('Page created!');

    setTitle('');

    setSlug('');

    editorRef.current?.setContent('');

  };



  return (

    <ProtectedRoute>

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6">Create New Page</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>

            <label className="block mb-2 font-medium">Page Title</label>

            <input

              type="text"

              value={title}

              onChange={(e) => setTitle(e.target.value)}

              className="w-full px-4 py-2 border rounded-lg"

              placeholder="About Us"

            />

          </div>

          <div>

            <label className="block mb-2 font-medium">Slug (URL)</label>

            <input

              type="text"

              value={slug}

              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}

              className="w-full px-4 py-2 border rounded-lg"

              placeholder="about"

            />

          </div>

          <div>

            <label className="block mb-2 font-medium">Content</label>

            <CmsEditor ref={editorRef} placeholder="Write your page content..." />

          </div>

          <button

            type="submit"

            className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9]"

          >

            Publish Page

          </button>

        </form>

      </div>

    </ProtectedRoute>

  );

}

