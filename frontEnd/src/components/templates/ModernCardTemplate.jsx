import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Award,
} from "lucide-react";

const ModerCardTemplate = ({ data, accentColor = "#0f172a" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month] = dateStr.split("-");
      return new Date(year, month - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper function to convert text with newlines into bullet points
  const renderDescription = (content) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    return (
      <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white font-serif text-slate-900 antialiased p-3">
      {/* Container for A4 proportions */}
      <div className="max-w-[210mm] mx-auto bg-white">
        {/* CENTERED HEADER */}
        <header className="text-center  border-b pb-3">
          <h1 className="text-5xl font-light tracking-tight  text-slate-900 mb-3">
            {data.personal_info?.full_name?.split(" ").map((word, i) => (
              <span key={i} className={i === 0 ? "font-bold" : "font-light"}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="text-lg uppercase tracking-[0.3em] text-slate-500 mb-6 font-sans">
            {data.personal_info?.profession}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-y-2 gap-x-6 text-[13px] font-sans text-slate-600">
            {data.personal_info?.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={12} /> {data.personal_info.email}
              </span>
            )}
            {data.personal_info?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> {data.personal_info.phone}
              </span>
            )}
            {data.personal_info?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {data.personal_info.location}
              </span>
            )}
            {data.personal_info?.linkedin && (
              <a
                href={data.personal_info.linkedin}
                className="flex items-center gap-1.5 text-slate-900 font-medium"
              >
                <Linkedin size={12} />{" "}
                {data.personal_info.linkedin.replace("https://www.", "")}
              </a>
            )}
            {data.personal_info?.website && (
              <a
                href={data.personal_info.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-900 font-medium"
              >
                <Globe size={12} />{" "}
                {data.personal_info.website.replace("https://www.", "")}
              </a>
            )}
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="space-y-10 font-sans">
          {/* PROFILE SECTION */}
          {(data.professionalSummary || data.professional_summary) && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  About Me
                </h2>
              </div>
              <div className="md:col-span-3">
                <div className="text-[15px] leading-relaxed text-slate-700 italic border-l-2 pl-6 py-1 border-slate-100">
                  {/* Updated to use bullet points helper */}
                  {renderDescription(
                    data.professionalSummary || data.professional_summary
                  )}
                </div>
              </div>
            </section>
          )}

          {/* EXPERIENCE SECTION */}
          {data.experience && data.experience.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  Experience
                </h2>
              </div>
              <div className="md:col-span-3 space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        {exp.position}
                      </h3>
                      <span className="text-xs font-bold text-slate-400 tabular-nums">
                        {formatDate(exp.start_date)} —{" "}
                        {exp.is_current
                          ? "Present"
                          : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <div
                      className="text-sm font-semibold tracking-wide uppercase mb-2"
                      style={{ color: accentColor }}
                    >
                      {exp.company}
                    </div>
                    {/* Updated to use bullet points helper */}
                    <div className="text-[14px]">
                      {renderDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS SECTION */}
          {data.skills && data.skills.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  Expertise
                </h2>
              </div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                  {data.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-[13px] text-slate-700"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PROJECTS SECTION */}
          {data.projects && data.projects.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  Projects
                </h2>
              </div>
              <div className="md:col-span-3 space-y-3">
                {data.projects.map((pro, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-50 pb-2 last:border-0"
                  >
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <p>{pro.name}</p>
                      <a href={pro.link} target="_blank" rel="noreferrer">
                        {pro.link && (
                          <span className="text-[10px] font-normal text-slate-500">
                            {pro.link}
                          </span>
                        )}
                      </a>
                    </h3>
                    <p
                      style={{ color: accentColor }}
                      className="text-xs mb-2 opacity-70 italic"
                    >
                      {pro.type}
                    </p>
                    {/* Updated to use bullet points helper */}
                    <div className="text-[13px]">
                      {renderDescription(pro.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION SECTION */}
          {data.education && data.education.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
              <div className="md:col-span-1">
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  Education
                </h2>
              </div>
              <div className="md:col-span-3 space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-slate-600">{edu.institute}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400">
                        {formatDate(edu.graduation_date)}
                      </span>
                      {edu.gpa && (
                        <p className="text-[10px] font-black text-slate-900">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.marks && (
                        <p className="text-[10px] font-black text-slate-900">
                          Marks: {edu.marks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerCardTemplate;