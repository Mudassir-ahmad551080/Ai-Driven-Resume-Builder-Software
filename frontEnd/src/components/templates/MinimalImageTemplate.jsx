import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemContext";

const MinimalImageTemplate = ({ data, accentColor }) => {
  const [theme] = useTheme();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Helper function to convert text with newlines into bullet points
  const renderDescription = (content, isSummary = false) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    
    // Summary usually looks better as a standard block if it's short, 
    // but this enforces bullets for consistency as requested.
    return (
      <ul className={`list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1 ${isSummary ? "list-none ml-0" : ""}`}>
        {items.map((item, index) => (
          <li id={theme} key={index} className={isSummary ? "mb-2" : ""}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div id={theme} className="max-w-5xl mx-auto bg-white text-zinc-800">
      <div id={theme} className="grid grid-cols-3">
        <div id={theme} className="col-span-1 py-10">
          {/* Image */}
          {data.personal_info?.image && typeof data.personal_info.image === "string" ? (
            <div id={theme} className="mb-6 ">
              <img
                id={theme}
                src={data.personal_info.image}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
                style={{ background: accentColor + "70" }}
              />
            </div>
          ) : data.personal_info?.image && typeof data.personal_info.image === "object" ? (
            <div id={theme} className="mb-6">
              <img
                id={theme}
                src={URL.createObjectURL(data.personal_info.image)}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          ) : null}
        </div>

        {/* Name + Title */}
        <div id={theme} className="col-span-2 flex flex-col justify-center py-10 px-8">
          <h1 id={theme} className="text-4xl font-bold text-zinc-700 tracking-widest">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p id={theme} className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
            {data?.personal_info?.profession || "Profession"}
          </p>
        </div>

        {/* Left Sidebar */}
        <aside id={theme} className="col-span-1 border-r border-gray-400 flex flex-col p-0 pt-0">
          {/* Contact */}
          <section id={theme} className="mb-10 ">
            <h2 id={theme} className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              CONTACT
            </h2>
            <div id={theme} className="space-y-2 text-sm">
              {data.personal_info?.phone && (
                <div id={theme} className="flex items-center gap-2 mr-1 md:mr-0">
                  <Phone id={theme} size={14} style={{ color: accentColor }} />
                  <span id={theme}>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div id={theme} className="flex items-center gap-2 ">
                  <Mail id={theme} size={14} style={{ color: accentColor }} />
                  <span id={theme}>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div id={theme} className="flex items-center gap-2">
                  <MapPin id={theme} size={14} style={{ color: accentColor }} />
                  <span id={theme}>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.linkedin && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info?.linkedin}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="size-4" />
                  <span className="break-all text-xs">
                    {data.personal_info.linkedin.split("https://www.")[1]
                      ? data.personal_info.linkedin.split("https://www.")[1]
                      : data.personal_info.linkedin}
                  </span>
                </a>
              )}
              {data.personal_info?.website && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info?.website}
                  className="flex items-center gap-2"
                >
                  <Globe className="size-4" />
                  <span className="break-all text-xs">
                    {data.personal_info.website.split("https://")[1]
                      ? data.personal_info.website.split("https://")[1]
                      : data.personal_info.website}
                  </span>
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section id={theme} className="mb-8">
              <h2 id={theme} className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                EDUCATION
              </h2>
              <div id={theme} className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div id={theme} key={index}>
                    <p id={theme} className="font-semibold uppercase">
                      {edu.degree}
                    </p>
                    <p id={theme} className="font-semibold mr-2">
                      {edu.field}
                    </p>
                    <p id={theme} className="text-zinc-600 mt-1 mb-1 mr-2 flex flex-wrap">
                      {edu.institute}
                    </p>
                    <p id={theme} className="text-xs text-zinc-500">
                      {formatDate(edu.graduation_date)}
                    </p>
                    {edu.gpa && (
                      <p id={theme} className="text-sm text-gray-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.marks && (
                      <p id={theme} className="text-sm text-gray-600">
                        Marks: {edu.marks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section id={theme}>
              <h2 id={theme} className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                SKILLS
              </h2>
              <ul id={theme} className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li id={theme} key={index}>
                    • {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main id={theme} className="col-span-2 p-8 pt-0">
          {/* Summary */}
          {(data.professionalSummary || data.professional_summary) && (
            <section id={theme} className="mb-6">
              <h2 id={theme} className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                PROFESSIONAL SUMMARY
              </h2>
              <div id={theme}>
              {renderDescription(
                data.professionalSummary || data.professional_summary
              )}
            </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section id={theme}>
              <h2 id={theme} className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }}>
                EXPERIENCE
              </h2>
              <div id={theme} className="space-y-6 mb-8">
                {data.experience.map((exp, index) => (
                  <div id={theme} key={index}>
                    <div id={theme} className="flex justify-between items-center">
                      <h3 id={theme} className="font-semibold text-zinc-900">
                        {exp.position}
                      </h3>
                      <span id={theme} className="text-xs ml-3 text-zinc-500">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p id={theme} className="text-sm mb-2" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    <div id={theme}>
                      {renderDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section id={theme}>
              <h2 id={theme} className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div id={theme} className="space-y-4">
                {data.projects.map((project, index) => (
                  <div id={theme} key={index}>
                    <h3 id={theme} className="text-md font-medium text-zinc-800 mt-3">
                      {project.name}
                    </h3>
                    <p id={theme} className="text-sm mb-1" style={{ color: accentColor }}>
                      {project.type}
                    </p>
                    <a id={theme} href={project.link} target="_blank" rel="noreferrer" className="text-sm mb-1 block" style={{ color: accentColor }}>
                      {project.link}
                    </a>
                    <div id={theme}>
                      {renderDescription(project.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;