// components/SocialScheduler.js

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-big-calendar (client-side only to prevent SSR issues)
const Calendar = dynamic(
  () => {
    // Import CSS dynamically when component loads
    if (typeof window !== 'undefined') {
      try {
        require('react-big-calendar/lib/css/react-big-calendar.css');
      } catch (e) {
        console.warn('Failed to load calendar CSS:', e);
      }
    }
    return import('react-big-calendar').then((mod) => mod.Calendar);
  },
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    )
  }
);

// Localizer will be initialized in useEffect

const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'youtube'];

export default function SocialScheduler() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localizer, setLocalizer] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    platform: 'linkedin', 
    content: '', 
    start: new Date(), 
    end: new Date() 
  });
  const [showModal, setShowModal] = useState(false);

  // Initialize localizer on client side
  useEffect(() => {
    try {
      const { dateFnsLocalizer } = require('react-big-calendar');
      const { format, parse, startOfWeek, getDay } = require('date-fns');
      const { enUS } = require('date-fns/locale');
      
      const initializedLocalizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales: { 'en-US': enUS },
      });
      
      setLocalizer(initializedLocalizer);
    } catch (error) {
      console.error('Failed to initialize calendar localizer:', error);
      setError('Failed to initialize calendar. Please refresh the page.');
    }
  }, []);

  useEffect(() => {
    if (localizer) {
      loadEvents();
    }
  }, [localizer]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/social/schedule');
      
      if (!res.ok) {
        throw new Error('Failed to load scheduled posts');
      }
      
      const posts = await res.json();
      const calendarEvents = posts.map(p => ({
        id: p.id,
        title: `${p.platform}: ${p.content ? p.content.substring(0, 30) : 'No content'}...`,
        start: new Date(p.scheduledAt),
        end: new Date(new Date(p.scheduledAt).getTime() + 60 * 60 * 1000), // 1-hour block
        platform: p.platform,
        content: p.content,
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load scheduled posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setShowModal(true);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.content || !newEvent.platform) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const payload = {
        platform: newEvent.platform,
        content: newEvent.content,
        scheduledAt: newEvent.start.toISOString(),
      };

      const res = await fetch('/api/social/schedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create scheduled post');
      }

      // Refresh events
      await loadEvents();
      
      // Reset form and close modal
      setNewEvent({ 
        title: '', 
        platform: 'linkedin', 
        content: '', 
        start: new Date(), 
        end: new Date() 
      });
      setShowModal(false);
    } catch (err) {
      console.error('Error creating event:', err);
      alert(err.message || 'Failed to schedule post. Please try again.');
    }
  };

  if (!localizer) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Social Media Scheduler</h2>
        <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded">
          <p className="text-red-500">Calendar initialization failed. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Social Media Scheduler</h2>
        <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded">
          <p className="text-gray-500">Loading scheduled posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Social Media Scheduler</h2>
        <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadEvents}
            className="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0069d9]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Social Media Scheduler</h2>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={(event) => {
            const colors = {
              facebook: '#1877F2',
              instagram: '#E1306C',
              linkedin: '#0077B5',
              twitter: '#1DA1F2',
              tiktok: '#000000',
              youtube: '#FF0000',
            };
            return { 
              style: { 
                backgroundColor: colors[event.platform] || '#007BFF', 
                color: 'white',
                border: 'none'
              } 
            };
          }}
        />
      </div>

      {/* Modal for New Event */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg w-96 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4 text-xl">Schedule New Post</h3>
            <textarea
              placeholder="Post content"
              value={newEvent.content}
              onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-3 min-h-[100px]"
              required
            />
            <select
              value={newEvent.platform}
              onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
            >
              {platforms.map(p => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#0069d9]"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

