import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'
import React, { useState } from 'react'
import { useTheme } from '../context/ThemContext'

const PersonalInfo = ({data,onchange,removeBackground,setRemoveBackground}) => {

  const [theme] = useTheme();

  const handleChange = (field,value) => {
    onchange({
      ...data,
      [field]: value,
    });
  }
  const fields = [
    {label: 'First Name', key: 'full_name', required:true, icon:User, type: 'text' },
    {label: 'Email Address', key: 'email', required:true, icon:Mail, type: 'email' },
    {label: 'Phone Number', key: 'phone',  icon:Phone, type: 'tel' },
    {label: 'Location', key: 'location', icon:MapPin, type: 'text' },
    {label: 'Profession', key: 'profession', icon:BriefcaseBusiness, type: 'text' },
     {label: 'Linkedin Profile', key: 'linkedin', icon:Linkedin, type: 'url' },
      {label: 'Website Url', key: 'website', icon:Globe, type: 'url' },
  ]
  return (
   <div id={theme} className="space-y-3">
  {/* Header */}
  <h3 id={theme} className="text-2xl font-semibold text-gray-800 text-center">Personal Information</h3>
  <p id={theme} className="text-gray-500 text-sm text-center">Get started with your personal information</p>

  <div id={theme} className="flex flex-col items-center justify-center border border-gray-400 rounded-2xl p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm">
    <label id={theme} className="flex flex-col items-center cursor-pointer">
      {data.image ? (
        <img
          src={
            typeof data.image === "string"
              ? data.image
              : URL.createObjectURL(data.image)
          }
          alt="Profile"
          className="w-28 h-28 object-cover rounded-full border border-gray-300 shadow-md hover:scale-105 transition-transform duration-300 mb-4"
        />
      ) : (
        <div id={theme} className="flex flex-col items-center text-gray-500">
          <div id={theme} className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all mb-2">
            <User id={theme} className="w-10 h-10 text-gray-600" />
          </div>
          <span id={theme} className="text-sm font-medium text-gray-600">Upload user image</span>
        </div>
      )}
      <input
       id={theme}
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        onChange={(e) => handleChange("image", e.target.files[0])}
      />
    </label>

    {typeof data.image === "object" && (
      <div id={theme} className="mt-4 flex flex-col items-center space-y-2">
        <p id={theme} className="text-gray-700 font-medium">Remove Background</p>
        <label id={theme} className="relative inline-flex items-center cursor-pointer">
          <input
             id={theme}
            type="checkbox"
            className="sr-only peer"
            onChange={() => setRemoveBackground((prev) => !prev)}
            checked={removeBackground}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-200"></div>
          <span  className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5"></span>
        </label>
      </div>
    )}
  </div>

  <div>

    {
      fields.map((field)=>{
        const Icon =  field.icon;
        return (
         <div id={theme} className="space-y-1 mt-5" key={field.key}>
  <label id={theme} className="flex items-center gap-2 text-sm font-medium text-gray-700">
    <Icon id={theme} className="w-4 h-4 text-gray-500" />
    {field.label}
    {field.required && <span className="text-red-500">*</span>}
  </label>

  <input
    type={field.type}
    value={data[field.key] || ''}
    onChange={(e) => handleChange(field.key, e.target.value)}
    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
    placeholder={`Enter your ${field.label.toLowerCase()}`}
    required={field.required}
  />
</div>

        )
      })
    }

  </div>
</div>

  )
}

export default PersonalInfo