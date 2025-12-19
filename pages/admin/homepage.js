// pages/admin/homepage.js

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import CmsEditor from "../../components/CmsEditor";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";

export default function HomepageManage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hero section
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroPrimaryButton, setHeroPrimaryButton] = useState({
    text: "",
    link: "",
  });
  const [heroSecondaryButton, setHeroSecondaryButton] = useState({
    text: "",
    link: "",
  });

  // Services
  const [services, setServices] = useState([]);

  // Why Choose Us
  const [whyTitle, setWhyTitle] = useState("");
  const [whyDescription, setWhyDescription] = useState("");
  const [whyStats, setWhyStats] = useState([]);

  // CTA
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButton, setCtaButton] = useState({ text: "", link: "" });

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      const response = await axios.get("/api/homepage", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      // Set hero section
      if (data.hero) {
        setHeroTitle(data.hero.title || "");
        setHeroSubtitle(data.hero.subtitle || "");
        setHeroPrimaryButton(
          data.hero.primaryButtonText && data.hero.primaryButtonLink
            ? {
                text: data.hero.primaryButtonText,
                link: data.hero.primaryButtonLink,
              }
            : { text: "", link: "" }
        );
        setHeroSecondaryButton(
          data.hero.secondaryButtonText && data.hero.secondaryButtonLink
            ? {
                text: data.hero.secondaryButtonText,
                link: data.hero.secondaryButtonLink,
              }
            : { text: "", link: "" }
        );
      }

      // Set services (use default if empty)
      setServices(
        data.services && data.services.length > 0
          ? data.services
          : [
              {
                title: "Website Development",
                description: "Modern, responsive websites with CMS & SEO.",
                price: "",
              },
              {
                title: "Mobile App Development",
                description: "iOS, Android & cross-platform apps.",
                price: "",
              },
              {
                title: "Custom Software Engineering",
                description: "Tailored enterprise solutions.",
                price: "",
              },
              {
                title: "Database Design & Management",
                description: "Secure, scalable data architecture.",
                price: "",
              },
              {
                title: "Cloud Deployment",
                description: "Hosting, CI/CD, and DevOps.",
                price: "",
              },
              {
                title: "Digital Automation",
                description: "Social media, workflows, and AI tools.",
                price: "",
              },
            ]
      );

      // Set Why Choose Us
      if (data.whyChooseUs) {
        setWhyTitle(data.whyChooseUs.title || "");
        setWhyDescription(data.whyChooseUs.description || "");
        setWhyStats(
          data.whyChooseUs.stats && data.whyChooseUs.stats.length > 0
            ? data.whyChooseUs.stats
            : [
                { value: "20+", label: "Global Clients" },
                { value: "100%", label: "Custom Solutions" },
                { value: "24/7", label: "Support" },
              ]
        );
      }

      // Set CTA
      if (data.cta) {
        setCtaTitle(data.cta.title || "");
        setCtaDescription(data.cta.description || "");
        setCtaButton(
          data.cta.buttonText && data.cta.buttonLink
            ? { text: data.cta.buttonText, link: data.cta.buttonLink }
            : { text: "", link: "" }
        );
      }
    } catch (err) {
      console.error("Failed to load homepage content:", err);
      toast.error("Failed to load homepage content");

      // Set defaults
      setServices([
        {
          title: "Website Development",
          description: "Modern, responsive websites with CMS & SEO.",
          price: "",
        },
        {
          title: "Mobile App Development",
          description: "iOS, Android & cross-platform apps.",
          price: "",
        },
        {
          title: "Custom Software Engineering",
          description: "Tailored enterprise solutions.",
          price: "",
        },
        {
          title: "Database Design & Management",
          description: "Secure, scalable data architecture.",
          price: "",
        },
        {
          title: "Cloud Deployment",
          description: "Hosting, CI/CD, and DevOps.",
          price: "",
        },
        {
          title: "Digital Automation",
          description: "Social media, workflows, and AI tools.",
          price: "",
        },
      ]);
      setWhyStats([
        { value: "20+", label: "Global Clients" },
        { value: "100%", label: "Custom Solutions" },
        { value: "24/7", label: "Support" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setServices([...services, { title: "", description: "", price: "" }]);
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleUpdateService = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleAddStat = () => {
    setWhyStats([...whyStats, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index) => {
    setWhyStats(whyStats.filter((_, i) => i !== index));
  };

  const handleUpdateStat = (index, field, value) => {
    const updated = [...whyStats];
    updated[index] = { ...updated[index], [field]: value };
    setWhyStats(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Saving homepage content...");

    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      const payload = {
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          primaryButtonText: heroPrimaryButton.text,
          primaryButtonLink: heroPrimaryButton.link,
          secondaryButtonText: heroSecondaryButton.text,
          secondaryButtonLink: heroSecondaryButton.link,
        },
        services: services,
        whyChooseUs: {
          title: whyTitle,
          description: whyDescription,
          stats: whyStats,
        },
        cta: {
          title: ctaTitle,
          description: ctaDescription,
          buttonText: ctaButton.text,
          buttonLink: ctaButton.link,
        },
      };

      await axios.post("/api/homepage", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Homepage content saved successfully!", {
        id: loadingToast,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to save homepage content",
        { id: loadingToast }
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="homepage">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading homepage content...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="homepage">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Homepage Content
            </h1>
            <p className="mt-2 text-gray-600">
              Edit all sections of your homepage including hero, services, and
              more.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#007BFF] text-white rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="We Build Powerful Digital Experiences..."
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Transform your vision into scalable..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={heroPrimaryButton.text}
                    onChange={(e) =>
                      setHeroPrimaryButton({
                        ...heroPrimaryButton,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Hire Us"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={heroPrimaryButton.link}
                    onChange={(e) =>
                      setHeroPrimaryButton({
                        ...heroPrimaryButton,
                        link: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="/contact"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryButton.text}
                    onChange={(e) =>
                      setHeroSecondaryButton({
                        ...heroSecondaryButton,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="View Services"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryButton.link}
                    onChange={(e) =>
                      setHeroSecondaryButton({
                        ...heroSecondaryButton,
                        link: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="/services"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Services</h2>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                + Add Service
              </button>
            </div>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Service {index + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveService(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          handleUpdateService(index, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Service Title"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          handleUpdateService(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows="2"
                        placeholder="Service description..."
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Price (Optional)
                      </label>
                      <input
                        type="text"
                        value={service.price || ""}
                        onChange={(e) =>
                          handleUpdateService(index, "price", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="e.g., $200-$5000 or Custom Quote"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty if no price should be shown
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Why Choose Us Section
            </h2>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={whyTitle}
                  onChange={(e) => setWhyTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Why Choose HenryMo Technologies?"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={whyDescription}
                  onChange={(e) => setWhyDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Full-stack expertise, affordable premium quality..."
                />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Stats</h3>
                <button
                  onClick={handleAddStat}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  + Add Stat
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {whyStats.map((stat, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        Stat {index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveStat(index)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) =>
                        handleUpdateStat(index, "value", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded text-sm mb-2"
                      placeholder="20+"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) =>
                        handleUpdateStat(index, "label", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Global Clients"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Call-to-Action Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ready to build something amazing?"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={ctaDescription}
                  onChange={(e) => setCtaDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Let's bring your project to life."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Button Text</label>
                  <input
                    type="text"
                    value={ctaButton.text}
                    onChange={(e) =>
                      setCtaButton({ ...ctaButton, text: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Button Link</label>
                  <input
                    type="text"
                    value={ctaButton.link}
                    onChange={(e) =>
                      setCtaButton({ ...ctaButton, link: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
