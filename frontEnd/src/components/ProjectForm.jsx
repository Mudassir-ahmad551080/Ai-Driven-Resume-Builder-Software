import { Plus, Trash, Trash2 } from 'lucide-react';
import React from 'react'
import { useTheme } from '../context/ThemContext';

const ProjectForm = ({data,onChange}) => {
      const addProject = () => {
       const newProject = {
         name:'',
         type:'',
         link:'',
         code_link:'',
         description:'',
    };
    onChange([...data, newProject]);
  };
  const [theme] = useTheme();

  const removeProject = (index) => {
    const updated = data.filter((_,i) => i !== index);
    onChange(updated);
  };
  const updateProject = (index, field, value) => {
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
              Projects
            </h3>
            <p id={theme}  className="text-sm text-gray-500">
              Add Your Projects...
            </p>
          </div>
          <button
         
            onClick={addProject}
            type="button"
            className=" w-[150px] mb-4 items-center  flex gap-2 px-1 py-2    text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
      </div>
    
     
    
        <div className="space-y-4 mt-6">
          {data.map((project, index) => (
            <div key={index} className="">
              <div className="flex mb-3   justify-between">
                <h4>Project #{index + 1}</h4>
                <button onClick={() => removeProject(index)}>
                  <Trash2 className="size-4 text-red-500" onClick={(index)=>{removeProject(index)}} />
                </button>
              </div>
              <div className=''>
                <input
                 id={theme}
                  type="text"
                  placeholder="Project name"
                  className="border border-gray-400 w-full  p-2 rounded-lg"
                  value={project.name || ""}
                  onChange={(e) =>
                  updateProject(index, "name", e.target.value)
                  }
                />

                <input
                 id={theme}
                  type="text"
                className="border  mt-2 w-full  border-gray-400 p-2 rounded-lg"
                  placeholder="Project type"
                  value={project.type || ""}
                  onChange={(e) =>
                 updateProject(index, "type", e.target.value)
                  }
                />
                <input
                 id={theme}
                  type="text"
                 className="border  mt-2   w-full border-gray-400 p-2 rounded-lg"
                  placeholder="Project Live Link"
                  value={project.link || ""}
                  onChange={(e) =>
                 updateProject(index, "link", e.target.value)
                  }
                />
                 <input
                  id={theme} 
                  type="text" 
                  className="border  mt-2   w-full border-gray-400 p-2 rounded-lg"
                  placeholder="Project Code Link"
                  value={project.code_link || ""}
                 onChange={(e) =>
                 updateProject(index, "code_link", e.target.value)
                  }
                 
                 />
                <br />

                <textarea
                 id={theme}
                  type="text"
                  rows={4}
                  className="border border-gray-400 w-full  p-2 rounded-lg mt-2"
                  value={project.description || ""}
                  placeholder='Describe your Project...'
                  onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                  }
                />
                
              </div>
            </div>
          ))}
        </div>
     
    </div>
  )
}

export default ProjectForm