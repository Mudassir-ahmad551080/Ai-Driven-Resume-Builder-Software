import { Briefcase, Plus, Sparkles, Trash2, Loader2, Calendar, Building2, User } from "lucide-react";
import React, { useState } from 'react';
import { useTheme } from "../context/ThemContext";
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({ data, onChange }) => {
  const [theme] = useTheme();
  const { token } = useSelector((state) => state.auth);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhanceDescription = async (index) => {
    const currentDescription = data[index].description;
    if (!currentDescription) {
      toast.error("Please write some description text first!");
      return;
    }
    setLoadingIndex(index);
    try {
      const response = await api.post('/api/ai/enhance-job-desc', 
        { usercontent: currentDescription }, 
        { headers: { Authorization: token } }
      );
      if (response.data && response.data.enhancedJobDescription) {
        updateExperience(index, "description", response.data.enhancedJobDescription);
        toast.success("Job description enhanced successfully!");
      }
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description.");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div id={theme} className="w-full max-w-4xl mx-auto">
      {/* Section Header */}
      <div id={theme} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div id={theme}>
          <h3 id={theme} className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            Professional Experience
          </h3>
          <p id={theme} className="text-sm text-gray-500 mt-1">
            Detail your career history to showcase your expertise.
          </p>
        </div>
        <button
          id={theme}
          onClick={addExperience}
          type="button"
          className=" flex items-center flex  gap-2 border  px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 active:scale-95"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
          Add Position
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div id={theme} className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div id={theme} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h4 id={theme} className="text-lg font-medium text-gray-700">No experience added yet</h4>
          <p id={theme} className="text-sm text-gray-500 mb-6 text-center max-w-sm">
            Start building your resume by adding your past work experience, internships, or freelance projects.
          </p>
          <button
            id={theme}
            onClick={addExperience}
            className="text-green-600 font-medium hover:text-green-700 hover:underline flex items-center gap-1"
          >
            Click here to add your first job
          </button>
        </div>
      ) : (
        /* Experience List */
        <div id={theme} className="space-y-6">
          {data.map((experience, index) => (
            <div 
              key={index}
              id={theme} 
              className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
            >
              {/* Card Header & Delete */}
              <div id={theme} className="flex items-center justify-between mb-6">
                <div id={theme} className="flex items-center gap-3">
                  <span id={theme} className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                    {index + 1}
                  </span>
                  <h4 id={theme} className="text-lg font-semibold text-gray-800">
                    {experience.position || "Untitled Position"}
                  </h4>
                </div>
                <button 
                  id={theme}
                  type="button" 
                  onClick={() => removeExperience(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove this experience"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Form Grid */}
              <div id={theme} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                
                {/* Position Title */}
                <div id={theme} className="space-y-1.5">
                  <label id={theme} className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <User size={12} /> Job Title
                  </label>
                  <input
                    id={theme}
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all outline-none"
                    value={experience.position || ""}
                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                  />
                </div>

                {/* Company Name */}
                <div id={theme} className="space-y-1.5">
                  <label id={theme} className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Building2 size={12} /> Employer
                  </label>
                  <input
                    id={theme}
                    type="text"
                    placeholder="e.g. Google Inc."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all outline-none"
                    value={experience.company || ""}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div id={theme} className="space-y-1.5">
                  <label id={theme} className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Calendar size={12} /> Start Date
                  </label>
                  <input
                    id={theme}
                    type="month"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all outline-none"
                    value={experience.start_date || ""}
                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div id={theme} className="space-y-1.5">
                  <label id={theme} className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Calendar size={12} /> End Date
                  </label>
                  <input
                    id={theme}
                    type="month"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
                      experience.is_current 
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white"
                    }`}
                    disabled={experience.is_current}
                    value={experience.end_date || ""}
                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                  />
                </div>
              </div>

              {/* Checkbox */}
              <div id={theme} className="flex items-center gap-2 mb-6">
                <input 
                  id={theme}
                  type="checkbox" 
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  checked={experience.is_current || false} 
                  onChange={(e) => updateExperience(index, 'is_current', e.target.checked)} 
                />
                <label id={theme} className="text-sm text-gray-700 cursor-pointer select-none">
                  I am currently working here
                </label>
              </div>

              {/* Description Section with AI */}
              <div id={theme} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div id={theme} className="flex items-center justify-between mb-3">
                  <label id={theme} className="text-sm font-semibold text-gray-700">
                    Responsibilities & Achievements
                  </label>
                  
                  <button
                    id={theme}
                    type="button"
                    onClick={() => handleEnhanceDescription(index)}
                    disabled={loadingIndex === index}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-all border
                      ${loadingIndex === index 
                        ? "bg-green-50 text-green-700 border-green-200 cursor-wait" 
                        : "bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md"
                      }
                    `}
                  >
                    {loadingIndex === index ? (
                      <Loader2 className="animate-spin w-3 h-3" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {loadingIndex === index ? "Improving..." : "Enhance with AI"}
                  </button>
                </div>
                
                <div id={theme} className="relative">
                  <textarea
                    id={theme}
                    rows={5}
                    value={experience.description || ''}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-y min-h-[100px] bg-white"
                    placeholder="• Developed new features for the frontend using React...&#10;• Collaborated with backend team to optimize API endpoints..."
                  />
                  <div id={theme} className="absolute bottom-3 right-3 pointer-events-none">
                     {/* Character count placeholder */}
                  </div>
                </div>
                <p id={theme} className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                   <Sparkles className="w-3 h-3 text-yellow-500" />
                   <span id={theme}>Tip: Write a rough draft, then let AI polish it for you.</span>
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;