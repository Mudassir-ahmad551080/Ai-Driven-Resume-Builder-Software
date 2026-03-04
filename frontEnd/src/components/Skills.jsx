import React, { useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';

const Skills = ({ data = [], onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || data.includes(skill)) return;
    onChange([...data, skill]);
    setNewSkill('');
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border  border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        <p className="text-sm text-gray-500">
          Add your technical and soft skills
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
          className="
            flex-1 rounded-lg border border-gray-300
            px-3 py-2 text-sm
            focus:outline-none text-black focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500
          "
        />

        <button
          type="button"
          onClick={addSkill}
          className="
            inline-flex items-center justify-center gap-1
            rounded-lg bg-indigo-600 px-4 py-2
            text-sm font-medium text-white
            hover:bg-indigo-700 transition
            disabled:opacity-50
          "
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Skills List */}
      {data.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="
                inline-flex items-center gap-1
                rounded-full bg-indigo-50 px-3 py-1
                text-sm text-indigo-700
              "
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="
                  rounded-full p-0.5
                  hover:bg-indigo-100 transition
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-6 mb-5 flex flex-col items-center text-center text-gray-400">
          <Sparkles className="mb-2 h-6 w-6" />
          <p className="text-sm font-medium">No skills added yet</p>
          <p className="text-xs">
            Start by adding your technical or soft skills
          </p>
        </div>
      )}
    </div>
  );
};

export default Skills;
