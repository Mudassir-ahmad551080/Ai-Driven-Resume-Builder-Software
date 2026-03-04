import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemContext";

const ClassicTemplate = ({ data, accentColor }) => {
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
  const renderDescription = (content) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    return (
      <ul id={theme} className="list-disc pl-5 space-y-1 text-gray-700 leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div
      id={theme}
      className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed"
    >
      {/* Header */}
      {data.personal_info?.image &&
      typeof data.personal_info.image === "string" ? (
        <div id={theme} className="mb-6 ">
          <img
            id={theme}
            src={data.personal_info.image}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto"
            style={{ background: accentColor + "70" }}
          />
        </div>
      ) : data.personal_info?.image &&
        typeof data.personal_info.image === "object" ? (
        <div id={theme} className="mb-6">
          <img
            id={theme}
            src={URL.createObjectURL(data.personal_info.image)}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto"
          />
        </div>
      ) : null}
      <header
        id={theme}
        className="text-center mb-8 pb-6 border-b-2"
        style={{ borderColor: accentColor }}
      >
        <h1
          id={theme}
          className="text-3xl font-bold mb-2"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p
          id={theme}
          className="uppercase text-zinc-700 mb-2 font-medium text-sm tracking-widest"
        >
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div
          id={theme}
          className="flex flex-wrap justify-center gap-4 text-sm text-gray-600"
        >
          {data.personal_info?.email && (
            <div id={theme} className="flex items-center gap-1">
              <Mail id={theme} className="size-4" />
              <span id={theme}>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div id={theme} className="flex items-center gap-1">
              <Phone id={theme} className="size-4" />
              <span id={theme}>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div id={theme} className="flex items-center gap-1">
              <MapPin id={theme} className="size-4" />
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
      </header>

      {/* Professional Summary */}
      {(data.professionalSummary || data.professional_summary) && (
        <section id={theme} className="mb-6">
          <h2
            id={theme}
            className="text-xl font-semibold mb-3"
            style={{ color: accentColor }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          {/* Updated to use bullet points helper */}
          <div id={theme}>
            {renderDescription(
              data.professionalSummary || data.professional_summary
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section id={theme} className="mb-6">
          <h2
            id={theme}
            className="text-xl font-semibold mb-4"
            style={{ color: accentColor }}
          >
            PROFESSIONAL EXPERIENCE
          </h2>

          <div id={theme} className="space-y-4">
            {data.experience.map((exp, index) => (
              <div
                id={theme}
                key={index}
                className="border-l-3 pl-4"
                style={{ borderColor: accentColor }}
              >
                <div
                  id={theme}
                  className="flex justify-between items-start mb-2"
                >
                  <div id={theme}>
                    <h3 id={theme} className="font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p id={theme} className="text-gray-700 font-medium">
                      {exp.company}
                    </p>
                  </div>
                  <div id={theme} className="text-right text-sm text-gray-600">
                    <p id={theme} className="ml-3">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </p>
                  </div>
                </div>
                {/* Updated to use bullet points helper */}
                {exp.description && (
                  <div id={theme} className="mt-2">
                    {renderDescription(exp.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section id={theme} className="mb-6">
          <h2
            id={theme}
            className="text-xl font-semibold mb-4"
            style={{ color: accentColor }}
          >
            PROJECTS
          </h2>

          <ul id={theme} className="space-y-3">
            {data.projects.map((proj, index) => (
              <div
                id={theme}
                key={index}
                className="flex justify-between items-start border-l-3 border-gray-300 pl-6"
              >
                <div id={theme} className="w-full">
                  <li id={theme} className="font-semibold text-gray-800 list-none">
                    {proj.name}
                  </li>
                  <h3
                    id={theme}
                    className="text-lg font-medium"
                    style={{ color: accentColor }}
                  >
                    {proj.type}
                  </h3>
                  <a
                    id={theme}
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm mb-1 block"
                    style={{ color: accentColor }}
                  >
                    {proj.link}
                  </a>
                  {/* Updated to use bullet points helper */}
                  {proj.description && (
                    <div id={theme} className="mt-2">
                      {renderDescription(proj.description)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ul>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section id={theme} className="mb-6">
          <h2
            id={theme}
            className="text-xl font-semibold mb-4"
            style={{ color: accentColor }}
          >
            EDUCATION
          </h2>

          <div id={theme} className="space-y-3">
            {data.education.map((edu, index) => (
              <div
                id={theme}
                key={index}
                className="flex justify-between items-start"
              >
                <div id={theme}>
                  <h3 id={theme} className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p id={theme} className="text-gray-700">
                    {edu.institute}
                  </p>
                  {edu.gpa && (
                    <p id={theme} className="text-sm text-gray-600">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <div id={theme} className="text-sm ml-1 text-gray-600">
                  <p id={theme}>{formatDate(edu.graduation_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section id={theme} className="mb-6">
          <h2
            id={theme}
            className="text-xl font-semibold mb-4"
            style={{ color: accentColor }}
          >
            CORE SKILLS
          </h2>

          <div id={theme} className="flex gap-4 flex-wrap">
            {data.skills.map((skill, index) => (
              <div id={theme} key={index} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;