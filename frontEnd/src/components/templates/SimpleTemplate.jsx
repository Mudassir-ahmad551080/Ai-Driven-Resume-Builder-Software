import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemContext";

const SimpleTemplate = ({ data, accentColor }) => {
  const [theme] = useTheme();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div id={theme} className="max-w-4xl mx-auto bg-white text-zinc-200 p-12 min-h-screen">
      {/* Header Section */}
      <header id={theme} className="text-center mb-8">
        <h1 id={theme} className="text-4xl font-serif font-bold text-zinc-400 mb-2 uppercase tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p id={theme} className="text-lg font-medium mb-4" style={{ color: accentColor }}>
          {data?.personal_info?.profession || "Profession"}
        </p>

        {/* Contact Info Bar */}
        <div id={theme} className="flex flex-wrap justify-center gap-4 text-sm text-zinc-600">
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} />
              <a href={data.personal_info.linkedin} target="_blank" >
                {data.personal_info.linkedin.replace("https://www.", "")}
              </a>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <a href={data.personal_info.website} target="_blank" >
                {data.personal_info.website.replace("https://www.", "")}
              </a>
            </div>
          )}
        </div>
      </header>

      <hr className="border-zinc-200 mb-8" />

      {/* Professional Summary */}
      {(data.professionalSummary || data.professional_summary) && (
        <section id={theme} className="mb-8">
          <h2 id={theme} className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <p id={theme} className="text-sm text-zinc-700 leading-relaxed">
            {data.professionalSummary || data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <section id={theme} className="mb-8">
          <h2 id={theme} className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ borderColor: accentColor + '30', color: accentColor }}>
            Experience
          </h2>
          <div id={theme} className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-zinc-400">{exp.position}</h3>
                  <span className="text-xs font-medium text-zinc-400 italic">
                    {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>{exp.company}</p>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 text-sm text-zinc-500 space-y-1">
                    {exp.description.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <section id={theme} className="mb-8">
          <h2 id={theme} className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ borderColor: accentColor + '30', color: accentColor }}>
            Education
          </h2>
          <div id={theme} className="grid grid-cols-1 gap-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-zinc-400">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  <p className="text-sm text-zinc-500">{edu.institute}</p>
                </div>
                <span className="text-xs text-zinc-500">{formatDate(edu.graduation_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <section id={theme} className="mb-8">
          <h2 id={theme} className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="text-sm text-zinc-500 after:content-[','] last:after:content-[''] mr-1">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section id={theme}>
          <h2 id={theme} className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ borderColor: accentColor + '30', color: accentColor }}>
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-zinc-300 text-sm">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" className="text-xs underline text-zinc-500">Link</a>
                  )}
                </div>
                <p className="text-xs italic mb-1" style={{ color: accentColor }}>{project.type}</p>
                <p className="text-sm text-zinc-400">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SimpleTemplate;