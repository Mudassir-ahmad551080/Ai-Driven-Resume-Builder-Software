import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemContext";

const ModernTemplate = ({ data, accentColor }) => {
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
    // Split the text by new line character (\n) and remove empty lines
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
    <div id={theme} className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* Header */}
      <header
        id={theme}
        className="p-8 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-4xl font-light mb-3">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="uppercase mb-3 text-gray-950 font-medium text-sm tracking-widest">
          {data?.personal_info?.profession || "Profession"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
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

      <div className="p-8">
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
          <section id={theme} className="mb-8">
            <h2
              id={theme}
              className="text-2xl font-light mb-6 pb-2 border-b border-gray-200"
            >
              Experience
            </h2>

            <div id={theme} className="space-y-6">
              {data.experience.map((exp, index) => (
                <div
                  id={theme}
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                >
                  <div
                    id={theme}
                    className="flex justify-between items-start mb-2"
                  >
                    <div id={theme}>
                      <h3
                        id={theme}
                        className="text-xl font-medium text-gray-900"
                      >
                        {exp.position}
                      </h3>
                      <p
                        id={theme}
                        className="font-medium"
                        style={{ color: accentColor }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div
                      id={theme}
                      className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded"
                    >
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current
                        ? "Present"
                        : formatDate(exp.end_date)}
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
          <section id={theme} className="mb-8">
            <h2
              id={theme}
              className="text-2xl font-light mb-4 pb-2 border-b border-gray-200"
            >
              Projects
            </h2>

            <div id={theme} className="space-y-6">
              {data.projects.map((p, index) => (
                <div
                  id={theme}
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div id={theme} className="flex justify-between items-start">
                    <div id={theme}>
                      <h3
                        id={theme}
                        className="text-lg font-medium text-gray-900"
                      >
                        {p.name}
                      </h3>
                      <h3
                        id={theme}
                        className="text-lg font-medium"
                        style={{ color: accentColor }}
                      >
                        {p.type}
                      </h3>
                       <div className="flex gap-5 text-center items-center ">
                        <a
                        id={theme}
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm mb-1 block"
                        style={{ color: accentColor }}
                      >
                        {p.link}
                      </a>
                      <a
                        id={theme}
                        href={p.code_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm border px-2 py-1 rounded-md  mb-1 block"
                        // style={{ color: accentColor }}
                      >
                        Code_link
                      </a>
                       </div>
                    </div>
                  </div>
                  {/* Updated to use bullet points helper */}
                  {p.description && (
                    <div id={theme} className="mt-2 text-sm">
                      {renderDescription(p.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div id={theme} className="grid sm:grid-cols-2 gap-8">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section id={theme}>
              <h2
                id={theme}
                className="text-2xl font-light mb-4 pb-2 border-b border-gray-200"
              >
                Education
              </h2>

              <div id={theme} className="space-y-4">
                {data.education.map((edu, index) => (
                  <div id={theme} key={index}>
                    <h3 id={theme} className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p id={theme} style={{ color: accentColor }}>
                      {edu.institute}
                    </p>
                    <div
                      id={theme}
                      className="flex justify-between items-center text-sm text-gray-600"
                    >
                      <span id={theme}>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span id={theme}>GPA: {edu.gpa}</span>}
                      {edu.marks && (
                        <p id={theme} className="text-sm text-gray-600">
                          Marks: {edu.marks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section id={theme}>
              <h2
                id={theme}
                className="text-2xl font-light mb-4 pb-2 border-b border-gray-200"
              >
                Skills
              </h2>

              <div id={theme} className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    id={theme}
                    key={index}
                    className="px-3 py-1 text-sm text-white rounded-full"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;