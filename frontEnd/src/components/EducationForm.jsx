import React from 'react'
import { useTheme } from '../context/ThemContext';
import { GraduationCap, Plus, Trash, Trash2 } from 'lucide-react';
const EducationForm = ({ data, onChange }) => {
    const addEducation = () => {
    const newEducation = {
      institute: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
      marks:''
    };
    onChange([...data, newEducation]);
  };
  const [theme] = useTheme();

  const removeEducation = (index) => {
    const updated = data.filter((_,i) => i !== index);
    onChange(updated);
  };
  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return (
     <div>
      <div id={theme} className="space-y-2">
        <div
          id={theme}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div id={theme} className=" md:mb-3 ">
            <h3 id={theme}  className="text-lg font-semibold text-gray-800">
              Education
            </h3>
            <p id={theme}  className="text-sm text-gray-500">
              Add Your Education detail...
            </p>
          </div>
          <button
         
            onClick={addEducation}
            type="button"
            className=" w-[150px] mb-4 items-center  flex gap-2 px-1 py-2    text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <div  id={theme} className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p  id={theme}>No Education Yet added...</p>
          <p  id={theme} className="text-sm">Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div key={index} className="">
              <div className="flex mb-3   justify-between">
                <h4>Education #{index + 1}</h4>
                <button onClick={() => removeEducation(index)}>
                  <Trash2 className="size-4 text-red-500" onClick={(index)=>{removeEducation(index)}} />
                </button>
              </div>
              <div>
                <input
                 id={theme}
                  type="text"
                  placeholder="institute name"
                  className="border border-gray-400 w-full md:w-50 p-2 rounded-lg"
                  value={education.institute || ""}
                  onChange={(e) =>
                  updateEducation(index, "institute", e.target.value)
                  }
                />

                <input
                 id={theme}
                  type="text"
                className="border md:ml-2 mt-2 w-full md:w-50 border-gray-400 p-2 rounded-lg"
                  placeholder="Degree (e.g, Bachelors, Master's)"
                  value={education.degree || ""}
                  onChange={(e) =>
                 updateEducation(index, "degree", e.target.value)
                  }
                />

                <input
                 id={theme}
                  type="text"
                  className="border border-gray-400 w-full md:w-50 p-2 rounded-lg mt-2"
                  value={education.field || ""}
                  placeholder='Field of Study'
                  onChange={(e) =>
                  updateEducation(index, "field", e.target.value)
                  }
                />
                <input
                 id={theme}
                  className=" border border-gray-400 p-2 rounded-lg md:ml-2 mt-2 w-full md:w-50 "
                  type="month"
                  placeholder='GPA(optional)'
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                   updateEducation(index, "graduation_date", e.target.value)
                  }
                />
              </div>
              
               <input
                 id={theme}
                  className=" border border-gray-400 p-2 rounded-lg  mt-2 w-full md:w-50 "
                  type="number"
                  placeholder='GPA(optional)'
                  value={education.gpa || ""}
                  onChange={(e) =>
                   updateEducation(index, "gpa", e.target.value)
                  }
                />
                <input
                 id={theme}
                  className=" border border-gray-400 p-2 rounded-lg md:ml-2 mt-2 w-full md:w-50 "
                  type="number"
                  placeholder='Marks(optional)'
                  value={education.marks || ""}
                  onChange={(e) =>
                   updateEducation(index, "marks", e.target.value)
                  }
                />
              
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm