import React from 'react'; // Ensure React is imported
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';
import MinimallmageTemplate from './templates/MinimalImageTemplate.jsx';
import MinimalTemplate from './templates/MinimalTemplate.jsx';
import { useTheme } from '../context/ThemContext.jsx';
import ModernCardTemplate from './templates/ModernCardTemplate.jsx';
import SimpleTemplate from './templates/SimpleTemplate.jsx';

// 1. Add isLoading to props
const ResumePreview = ({ data, template, accentColor, classes = '', isLoading = false }) => {
  const [theme] = useTheme();

  const renderTamplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case 'minimal-image':
        return <MinimallmageTemplate data={data} accentColor={accentColor} />;
      case 'modern-card-template':
        return <ModernCardTemplate data={data} accentColor={accentColor} />;
      case 'simple':
        return <SimpleTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  // 2. Define the Skeleton UI Component
  const ResumeSkeleton = () => (
    <div className="w-full h-full min-h-[800px] bg-white p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-100">
        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-4 mt-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Experience Section Skeleton */}
      <div className="mb-8">
        <div className="h-5 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div>
           <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
           <div className="flex flex-wrap gap-2">
             {[1,2,3,4].map(i => <div key={i} className="h-8 w-20 bg-gray-100 rounded"></div>)}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id={theme}
      className="w-full border border-gray-400 flex items-center justify-center transition-all duration-300"
    >
      <div id={theme} className="w-full">
        <div
          id={theme}
          className={`relative max-w-3xl mx-auto md:p-4 rounded-xl`}
        >
          {/* Resume Content or Loading State */}
          <div
            id={theme}
            className="transform transition-transform duration-300 hover:scale-[1.01] text-gray-900 text-sm sm:text-base leading-relaxed"
          >
            {/* 3. Conditional Rendering */}
            {isLoading ? <ResumeSkeleton /> : renderTamplate()}
          </div>

          {/* Subtle Accent Border (Only show if not loading for cleaner look) */}
          {!isLoading && (
            <div
              id={theme}
              className="absolute bottom-0 left-0 h-[3px] sm:h-1 w-full"
              style={{ backgroundColor: accentColor }}
            ></div>
          )}
        </div>
      </div>

      {/* Print styling */}
      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }

          @media print {
            body {
              background: white !important;
            }
            #resume-preview {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;