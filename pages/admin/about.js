// pages/admin/about.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';

export default function AboutManage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Intro section
  const [introTitle, setIntroTitle] = useState('');
  const [introParagraph1, setIntroParagraph1] = useState('');
  const [introParagraph2, setIntroParagraph2] = useState('');
  
  // Vision & Mission
  const [visionTitle, setVisionTitle] = useState('');
  const [visionContent, setVisionContent] = useState('');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionContent, setMissionContent] = useState('');
  
  // Team section
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [teamPhoto, setTeamPhoto] = useState('');
  
  // Tech stack
  const [techStack, setTechStack] = useState([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get('/api/about');
      const data = response.data;

      // Set intro
      if (data.intro) {
        setIntroTitle(data.intro.title || '');
        setIntroParagraph1(data.intro.paragraph1 || '');
        setIntroParagraph2(data.intro.paragraph2 || '');
      }

      // Set vision
      if (data.vision) {
        setVisionTitle(data.vision.title || '');
        setVisionContent(data.vision.content || '');
      }

      // Set mission
      if (data.mission) {
        setMissionTitle(data.mission.title || '');
        setMissionContent(data.mission.content || '');
      }

      // Set team
      if (data.team) {
        setTeamName(data.team.name || '');
        setTeamRole(data.team.role || '');
        setTeamBio(data.team.bio || '');
        setTeamPhoto(data.team.photo || '');
      }

      // Set tech stack
      if (data.techStack && Array.isArray(data.techStack)) {
        setTechStack(data.techStack);
      }

    } catch (err) {
      console.error('Failed to load about page content:', err);
      toast.error('Failed to load about page content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = () => {
    if (newTech.trim()) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTech = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading('Saving about page content...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const payload = {
        intro: {
          title: introTitle,
          paragraph1: introParagraph1,
          paragraph2: introParagraph2,
        },
        vision: {
          title: visionTitle,
          content: visionContent,
        },
        mission: {
          title: missionTitle,
          content: missionContent,
        },
        team: {
          name: teamName,
          role: teamRole,
          bio: teamBio,
          photo: teamPhoto,
        },
        techStack: techStack,
      };

      await axios.post('/api/about', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('About page content saved successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save about page content', { id: loadingToast });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="about">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading about page content...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="about">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage About Page Content</h1>
            <p className="mt-2 text-gray-600">Edit all sections of your about page including intro, vision, mission, team, and tech stack.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#007BFF] text-white rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

          <div className="space-y-6">
            {/* Intro Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Introduction Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    value={introTitle}
                    onChange={(e) => setIntroTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="About HenryMo Technologies"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">First Paragraph</label>
                  <textarea
                    value={introParagraph1}
                    onChange={(e) => setIntroParagraph1(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="HenryMo Technologies is a full-stack digital solutions company..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Second Paragraph</label>
                  <textarea
                    value={introParagraph2}
                    onChange={(e) => setIntroParagraph2(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                    placeholder="We create websites, mobile apps, enterprise software..."
                  />
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Vision</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                      type="text"
                      value={visionTitle}
                      onChange={(e) => setVisionTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Our Vision"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Content</label>
                    <textarea
                      value={visionContent}
                      onChange={(e) => setVisionContent(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows="4"
                      placeholder="To become a leading African-to-global technology powerhouse..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Mission</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                      type="text"
                      value={missionTitle}
                      onChange={(e) => setMissionTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Our Mission"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Content</label>
                    <textarea
                      value={missionContent}
                      onChange={(e) => setMissionContent(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows="4"
                      placeholder="To empower businesses and individuals..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Team Section</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Henry M. Ugochukwu"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Role</label>
                    <input
                      type="text"
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Founder & CEO"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Bio</label>
                  <textarea
                    value={teamBio}
                    onChange={(e) => setTeamBio(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                    placeholder="With years of experience in software development..."
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Photo URL</label>
                  <ImageUpload
                    imageUrl={teamPhoto}
                    onImageChange={setTeamPhoto}
                    label="Team Photo"
                    required={false}
                  />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Add technology (e.g., React, Node.js)"
                  />
                  <button
                    onClick={handleAddTech}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(index)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {techStack.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No technologies added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

