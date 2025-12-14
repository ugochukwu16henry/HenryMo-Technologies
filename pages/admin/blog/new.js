// pages/admin/blog/new.js - Redirect to edit page

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogNew() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/blog/edit');
  }, []);

  return null;
}

