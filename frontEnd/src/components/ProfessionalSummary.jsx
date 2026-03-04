import { Loader2, Sparkles } from 'lucide-react';
import React from 'react';
import { useTheme } from '../context/ThemContext';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';
const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const [theme] = useTheme();
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleAIEnhance = async () => {
    if (!data) {
      toast.error("Please enter some text first!");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Enhance the following professional summary to make it more compelling and impactful:\n\n"${data}"`;
      const response = await api.post('/api/ai/enhance-pro-summ', { usercontent: prompt }, {
        headers: { Authorization: token }
      });

      // FIX: Match the key 'enhancedSummary' from your backend response
      if (response.data && response.data.enhancedSummary) {
        setResumeData(prev => ({
          ...prev,
          professionalSummary: response.data.enhancedSummary
        }));
        toast.success('Professional summary enhanced successfully!');
      }
    } catch (error) {
      console.error('Error enhancing professional summary:', error);
      toast.error('Failed to enhance professional summary.');
    } finally {
      setIsGenerating(false);
    }
  };




  return (
    <div id={theme} className="space-y-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div id={theme} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 id={theme} className="text-lg font-semibold text-gray-800">Professional Summary</h3>
          <p id={theme} className="text-sm text-gray-500">
            Add a concise summary that highlights your key experience and skills.
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={handleAIEnhance}
          type="button"
          className=" w-[200px] items-center  flex gap-1 px-1 py-2    text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all"
        >
          {isGenerating ? (<Loader2 className="animate-spin size-4 " />) : (<Sparkles size={16} />)}
          {isGenerating ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      {/* Textarea */}
      <div className="mt-4">
        <textarea
          id={theme}
          rows={7}
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 resize-none"
          placeholder="Write a compelling summary about your professional background, highlighting your years of experience, key strengths, and career achievements..."
        />
        <p id={theme} className="mt-2 text-xs text-gray-500">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
