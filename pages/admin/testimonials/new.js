// pages/admin/testimonials/new.js - Redirect to edit page

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TestimonialNew() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/testimonials/edit');
  }, []);

  return null;
}

