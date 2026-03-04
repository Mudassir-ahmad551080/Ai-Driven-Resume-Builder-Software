import { useTheme } from "../../context/ThemContext";
import { Linkedin, Globe, Mail, Phone, MapPinPlus } from "lucide-react";
const MinimalTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  const [theme] = useTheme();

  return (
    <div
      id={theme}
      className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light"
    >
      {/* Header */}
      <header id={theme} className="mb-10">
        {data.personal_info?.image &&
        typeof data.personal_info.image === "string" ? (
          <div id={theme} className="mb-6 ">
            <img
              id={theme}
              src={data.personal_info.image}
              alt="Profile"
              className="w-32 h-32 object-cover md:mr-100 rounded-full mx-auto"
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
              className="w-32 h-32  object-cover rounded-full mx-auto"
            />
          </div>
        ) : null}
        <h1 id={theme} className="text-4xl font-thin mb-4 tracking-wide">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p
          id={theme}
          className="uppercase mb-3 text-zinc-700 font-medium text-sm tracking-widest"
        >
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div id={theme} className="flex flex-wrap gap-6 text-sm text-gray-600">
          {data.personal_info?.email && (
            <span
              className="flex items-center gap-1 text-center justify-center"
              id={theme}
            >
              <Mail className="size-4" /> {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <span
              className="flex items-center gap-1 text-center justify-center"
              id={theme}
            >
              <Phone className="size-4" />
              {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.location && (
            <span
              className="flex items-center gap-1 text-center justify-center"
              id={theme}
            >
              <MapPinPlus className="size-4" />
              {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <a
              target="_blank"
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
          <p id={theme} className="text-gray-700 leading-relaxed">
            {data.professionalSummary || data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section id={theme} className="mb-10">
          <h2
            id={theme}
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div id={theme} className="space-y-6">
            {data.experience.map((exp, index) => (
              <div id={theme} key={index}>
                <div
                  id={theme}
                  className="flex justify-between items-baseline mb-1"
                >
                  <h3 id={theme} className="text-lg font-medium">
                    {exp.position}
                  </h3>
                  <span id={theme} className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p id={theme} className="text-gray-600 mb-2">
                  {exp.company}
                </p>
                {exp.description && (
                  <div
                    id={theme}
                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                  >
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section id={theme} className="mb-10">
          <h2
            id={theme}
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div id={theme} className="space-y-4">
            {data.projects.map((proj, index) => (
              <div
                id={theme}
                key={index}
                className="flex flex-col gap-2 justify-between items-baseline"
              >
                <h3 id={theme} className="text-lg font-medium">
                  {proj.name}
                </h3>
                <h3 id={theme} className="text-lg font-medium" style={{ color: accentColor }}>
                  {proj.type}
                </h3>
                <a id={theme} href={proj.link}  target="_blank" className="text-sm mb-1" style={{ color: accentColor }}>
                      {proj.link}
                  </a>
                <p id={theme} className="text-gray-600">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section id={theme} className="mb-10">
          <h2
            id={theme}
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div id={theme} className="space-y-4">
            {data.education.map((edu, index) => (
              <div
                id={theme}
                key={index}
                className="flex justify-between items-baseline"
              >
                <div id={theme}>
                  <h3 id={theme} className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p id={theme} className="text-gray-600">
                    {edu.institute}
                  </p>
                  {edu.gpa && (
                    <p id={theme} className="text-sm text-gray-500">
                      GPA: {edu.gpa}
                    </p>
                  )}
                  {edu.marks && (
                    <p id={theme} className="text-sm text-gray-600">
                      Marks: {edu.marks}
                    </p>
                  )}
                </div>
                <span id={theme} className="text-sm ml-1 text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
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
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <div id={theme} className="text-gray-700">
            {data.skills.join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
