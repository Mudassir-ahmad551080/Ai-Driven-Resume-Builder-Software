import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";

import { useTheme } from "../context/ThemContext.jsx";
import { useSelector } from "react-redux";
import api from "../config/api.js";
import { toast } from "react-hot-toast";
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const colors = ["#9b5de5", "#fca3cc", "#f6d186", "#b5ead7", "#c7ceea"];
  const {user,token} = useSelector(state => state.auth);
  const [loading,setIsLoading] = React.useState(false);
  const [allResumes, setAllResumes] = React.useState([]);
  const [showcreatereume, setShowcreateresume] = React.useState(false);
  const [showuploadresume, setShowuploadresume] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [resume, setResume] = React.useState(null);
  const [editresumeId, setEditresumeId] = React.useState("");
  const navigate = useNavigate();
  const [theme] = useTheme();

  const loadAllResumes = async () => {
      try {
        const {data} = await api.get('/api/users/resumes',{
          headers: {
            Authorization: token
          }
        });
        setAllResumes(data.resumes);
      } catch (error) {
        console.error("Load Error:", error);
        toast.error("Failed to load resumes");
      }
  };

  const createResume = async (e) => {
  e.preventDefault();
  
  // 1. Validation check
  if (!token) {
    toast.error("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  try {
    const { data } = await api.post(
      '/api/resumes/create',
      { title },
      { 
        headers: { 
          // Ensure "Bearer" is spelled correctly and token exists
          Authorization: token 
        } 
      }
    );

    setAllResumes([...allResumes, data.resume]);
    setTitle("");
    setShowcreateresume(false);
    toast.success("Resume created!");
    navigate(`/app/builder/${data.resume._id}`);
  } catch (error) {
    // 2. Enhanced error logging
    console.error("Create Error:", error.response);
    toast.error(error.response?.data?.message || "Failed to create resume");
  }
}

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Please select a file first");
    if (!title) return toast.error("Please enter a title");

    setIsLoading(true);
    try {
        // 1. Extract text from PDF
        const resumeText = await pdfToText(resume);
        
        // DEBUG: Check if text was actually extracted
        console.log("Extracted Text:", resumeText);

        if (!resumeText || resumeText.trim().length === 0) {
            throw new Error("Could not extract text from this PDF. It might be an image-based PDF.");
        }

        const { data } = await api.post(
            '/api/ai/upload-resume',
            { title, resumeText }, // Sending both fields
            { 
                headers: { 
                    Authorization: token // Ensure your Interceptor or this header is correct
                } 
            }
        );

        toast.success("Resume parsed successfully!");
        setTitle("");
        setResume(null);
        setShowuploadresume(false);
        navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
        console.error("Upload Error:", error);
        toast.error(error.message || "Failed to upload resume");
    } finally {
        setIsLoading(false);
    }
};

  const editTitle = async (e) => {
  e.preventDefault();
  try {
    const { data } = await api.put(
      `/api/resumes/update`, // Or `/api/resumes/update/${editresumeId}`
      { 
        resumeId: editresumeId, 
        title: title // Flat structure is often preferred
      },
      {
        headers: {
          // Add "Bearer " if your backend requires it
          Authorization: token 
        }
      }
    );

    setAllResumes(allResumes.map(resume => 
      resume._id === editresumeId ? { ...resume, title } : resume
    ));
    
    setEditresumeId("");
    setTitle("");
    toast.success("Resume title updated");
  } catch (error) {
    console.error("Edit Error:", error);
    toast.error(error.response?.data?.message || "Failed to update resume title");
  }
};
  const deleteResume = async (resumeId) => {
    // 1. Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      // 2. API Call
      await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: token,
        },
      });

      // 3. Update State (Remove from UI immediately)
      setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

      // 4. Success Toast
      toast.success("Resume deleted successfully");
      
    } catch (error) {
      console.error("Delete Error:", error);
      // 5. Error Toast
      toast.error(error.response?.data?.message || "Failed to delete resume");
    }
  };
  useEffect(() => {
    loadAllResumes();
  },);

  return (
    <div id={theme} className="min-h-screen bg-gray-50 flex flex-col px-6 sm:px-10 py-6">
      {/* Header */}
      <div id={theme} className="w-full max-w-5xl mx-auto text-center mb-10">
        <h1 id={theme} className="text-3xl md:text-4xl font-semibold text-gray-800">
          Welcome, <span className="text-blue-600">{user?.name}</span>
        </h1>
        <p id={theme} className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your resumes or start creating a new one below.
        </p>
      </div>

      {/* Action Buttons */}
      <div id={theme} className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto justify-center">
        {/* Create Resume */}
        <button
  id={theme}
  onClick={() => setShowcreateresume(true)}
  className="flex flex-col items-center justify-center gap-3 
  bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 
  text-white px-6 py-20 rounded-2xl shadow-lg transition-all duration-300 
  hover:scale-105 hover:shadow-2xl hover:from-gray-400 hover:via-gray-500 hover:to-gray-600
  focus:outline-none focus:ring-4 focus:ring-gray-400 w-full sm:w-1/2"
>
  <PlusIcon className="w-10 h-10 p-2 bg-gray-700 rounded-full backdrop-blur-sm text-white" />
  <span className="text-lg text-black font-semibold">
    Create Resume
  </span>
</button>


        {/* Upload Resume */}
        <button
          onClick={() => setShowuploadresume(true)}
          className="flex flex-col items-center justify-center gap-3 
  bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 
  text-white px-6 py-20 rounded-2xl shadow-lg transition-all duration-300 
  hover:scale-105 hover:shadow-2xl hover:from-gray-400 hover:via-gray-500 hover:to-gray-500
  focus:outline-none focus:ring-4 focus:ring-gray-300 w-full sm:w-1/2"
        >
          <UploadCloudIcon className="w-10 h-10 p-2 bg-gray-600 text-white rounded-full backdrop-blur-sm" />
          <span className="text-lg text-black font-semibold">
            Upload Existing
          </span>
        </button>

      </div>

      {/* Divider */}
      <hr className="my-10 h-[2px] w-full border-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Resume Cards */}
      <div id={theme} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];
          return (
            <div
              id={theme}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              key={index}
              className="relative group p-6 rounded-xl shadow-md bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{
                borderTop: `4px solid ${baseColor}`,
              }}
            >
              {/* Icon */}
              <div
                id={theme} className="w-12 h-12 flex items-center justify-center rounded-full mb-4"
                style={{ backgroundColor: baseColor + "33" }}
              >
                <FilePenLineIcon
                  id={theme}
                  className="w-6 h-6"
                  style={{ color: baseColor }}
                />
              </div>

              {/* Title */}
              <p id={theme} className="font-semibold text-gray-800 text-lg truncate">
                {resume.title}
              </p>

              {/* Date */}
              <p id={theme} className="text-gray-500 text-sm mt-1">
                Updated on{" "}
                {new Date(resume.updateAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Hover Actions */}
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <TrashIcon onClick={() => deleteResume(resume._id)} className="w-4 h-4 text-red-500" />
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  <PencilIcon onClick={() => { setEditresumeId(resume._id); setTitle(resume.title) }} className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {
        showcreatereume && (
          <div 
             
            onClick={() => setShowcreateresume(false)}
            className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
             id={theme}
              onSubmit={createResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border border-gray-200 transition-all duration-300 scale-100 hover:scale-[1.01]"
            >
              {/* Close Icon */}
              <button
                id={theme}
                type="button"
                onClick={() => {
                  setShowcreateresume(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon id={theme} className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 id={theme} className="text-2xl font-semibold text-gray-800 text-center mb-2">
                Create a New Resume
              </h2>
              <p id={theme} className="text-gray-500 text-sm text-center">
                Give your resume a title to start building it.
              </p>

              {/* Input Field */}
              <input
                id={theme}
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />

              {/* Buttons */}
              <div id={theme} className="flex justify-end gap-3 mt-4">
                <button
                 id={theme}
                  type="button"
                  onClick={() => {
                    setShowcreateresume(false);
                    setTitle("");
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                 
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )
      }

      {
        showuploadresume && (
          <div
            onClick={() => setShowuploadresume(false)}
            className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
             id={theme}
              onSubmit={uploadResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border border-gray-200 transition-all duration-300 scale-100 hover:scale-[1.01]"
            >
              {/* Close Icon */}
              <button
               id={theme}
                type="button"
                onClick={() => {
                  setShowuploadresume(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon id={theme} className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 id={theme} className="text-2xl font-semibold text-gray-800 text-center mb-2">
                Upload Resume
              </h2>
              <p id={theme} className="text-gray-500 text-sm text-center">
                Give your resume a title to start building it.
              </p>

              {/* Input Field */}
              <input
               id={theme}
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />

              <div id={theme}>
                <label id={theme} htmlFor="resume-input">Select Resume File</label>
                <input  type="file" accept=".pdf" hidden id="resume-input" onChange={(e) => setResume(e.target.files[0])} />
                <div id={theme} className="mt-2 flex items-center gap-3">
                  <div
                    id={theme}
                    onClick={() => document.getElementById('resume-input').click()}
                    className={`
    flex flex-col items-center justify-center
    w-full max-w-md h-48 
    border-2 border-dashed rounded-2xl
    ${resume ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}
    cursor-pointer transition-all duration-200
  `}
                  >
                    {resume ? (
                      <p id={theme} className="text-lg font-medium text-gray-800">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud id={theme} className="size-14 stroke-1 text-blue-500 mb-2" />
                        <p id={theme} className="text-gray-600 font-medium">Upload Resume</p>
                        <p id={theme} className="text-xs text-gray-400 mt-1">(PDF, DOCX, etc.)</p>
                      </>
                    )}
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">

               {loading ? (<button type="button" className="px-5 flex gap-1 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md transition-all">
                   <LoaderCircleIcon className="animate-spin"/>
                  Uploading...
                </button>) : (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition-all"
                  >
                    Upload Resume
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      }

      {
        editresumeId && (
          <div
            onClick={() => setEditresumeId(false)}
            className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          >
            <form
              onSubmit={editTitle}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md flex flex-col gap-5 border border-gray-200 transition-all duration-300 scale-100 hover:scale-[1.01]"
            >
              {/* Close Icon */}
              <button
                type="button"
                onClick={() => {
                  setEditresumeId(false);
                  setTitle("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
                Edit Resume Title
              </h2>


              {/* Input Field */}
              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition-all"
                >
                  Updated
                </button>
              </div>
            </form>
          </div>
        )
      }


      {/* Nested Routes */}
      <div className="w-full max-w-5xl mt-12 mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;