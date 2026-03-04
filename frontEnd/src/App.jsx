import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'
import ResumeAnalyzer from './components/ResumeAnalyzer.jsx'
import Preview from './pages/Preview.jsx'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import api from './config/api.js'
import { login,setLoading } from './app/features/authSlice.js'
// import ResumeAnalyzer from './components/ResumeAnalyzer.jsx'
const App = () => {
  const dispatch = useDispatch();

  const getuserData = async () => {
    const token = localStorage.getItem("token");
    try {
       if(token){
        const {data} = await api.get('/api/users/data',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        if(data.user){
          dispatch(login({user:data.user, token}));
        }
        dispatch(setLoading(false));
       }
       else{
        dispatch(setLoading(false));
       }
    } catch (error) {
      dispatch(setLoading(false));
      console.log("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    getuserData();
  }, []);
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} /><Toaster position="top-center" reverseOrder={false} />
     <Routes>
        {/* Define your routes here */}
        <Route path='/' element={<Home/>}/>
         <Route path='app' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>
        </Route>
        <Route path='view/:resumeId' element={<Preview/>}/>
        <Route path='/analyze-resume' element={<ResumeAnalyzer/>}/>
     </Routes>
    </>
  )
}

export default App