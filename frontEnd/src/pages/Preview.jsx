import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeft, Loader } from 'lucide-react';
import api from '../config/api';

const Preview = () => {
  const {resumeId} = useParams();
  const [resumeData, setResumeData] = React.useState(null);
  const [isLoading,setIsLoading] = useState(true);

  const loadResume = async () => {
    try {
       const {data}  = await api.get('/api/resumes/public/'+resumeId);
       setResumeData(data);
    } catch (error) {
       console.log(error.message);
       
    }
    finally{
      setIsLoading(false);
    }
  }
  useEffect(() => {
    loadResume();
  }, [])
  return resumeData ? (
    <div>
      <div className='mx-auto max-w-3xl py-10 '>
        <ResumePreview classes='py-4 bg-white' data={resumeData} template={resumeData.template} accentColor={resumeData.accentColor} />
      </div>
    </div>
  ) : (
    <div className='h-screen items-center justify-center flex'>
       {isLoading ? <Loader/>:(
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
  {/* The Text Section */}
  <p className="text-5xl md:text-6xl font-black italic tracking-tighter text-gray-900 mb-4 drop-shadow-sm">
    Resume not found
  </p>
  
  <p className="text-gray-500 text-lg mb-8 max-w-md text-center">
    The link might be broken, or the resume has been set to private.
  </p>

  {/* The Button Section */}
  <Link 
    to="/" 
    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-200 transition-all duration-200 active:scale-95 w-full max-w-[280px] justify-center"
  >
    <ArrowLeft className="size-5 stroke-[3px]" /> 
    Go Back
  </Link>

  {/* Optional: Subtle Background Decoration */}
  <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
  </div>
</div>
       )}
    </div>
  )
}

export default Preview