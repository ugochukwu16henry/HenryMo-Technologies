// pages/admin/portfolio/new.js
// Redirects to edit page without ID for new item

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PortfolioNew() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/portfolio/edit');
  }, []);

  return null;
}

