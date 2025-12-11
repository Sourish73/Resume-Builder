import React from "react";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { formatYearMonth } from "../utils/helper";

const TemplateTwo = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  return (
    <div className="w-full bg-white font-sans text-gray-800 a4-wrapper">
      {/* Header Section */}
      <header className="text-center px-8 pt-8 pb-4 mb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileInfo.fullName || "Your Name"}</h1>
        <p className="text-sm text-gray-600 font-medium mb-2">{profileInfo.designation || "Professional Title"}</p>
        
        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-700 mb-3">
          {contactInfo.phone && (
            <span>{contactInfo.phone}</span>
          )}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:underline">
              {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a href={contactInfo.github} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} className="text-blue-600 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </header>

      <hr className="border-gray-400 mx-8 mb-4" />

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-6">
        {/* Summary */}
        {profileInfo.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider border-b border-gray-300 pb-1">Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{profileInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-300 pb-1">Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{exp.role}</h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 min-w-max">
                      <p>{formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}</p>
                      {exp.location && <p className="text-xs">{exp.location}</p>}
                    </div>
                  </div>
                  
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded border">
                        {exp.technologies}
                      </span>
                    </div>
                  )}
                  
                  {exp.description && (
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      {exp.description.split("\n").map((line, i) => (
                        <li key={i} className="list-disc">{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-300 pb-1">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-900">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                        {proj.linkType || "Live Demo"} <LuExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-xs px-2 py-1 rounded border">
                        {proj.technologies}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-700">{proj.description}</p>
                  
                  <div className="flex gap-3 text-sm">
                    {proj.github && (
                      <a href={proj.github} className="flex items-center gap-1 hover:underline text-blue-600">
                        <LuGithub size={14} /> Code
                      </a>
                    )}
                    {proj.liveDemo && (
                      <a href={proj.liveDemo} className="flex items-center gap-1 hover:underline text-blue-600">
                        <LuExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase text-gray-800 mb-3 tracking-wider border-b border-gray-300 pb-1">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-gray-600 min-w-max">
                      {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                    </p>
                  </div>
                  {edu.courses && (
                    <p className="text-xs text-gray-700">
                      <span className="font-medium">Courses:</span> {edu.courses}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout for remaining sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider border-b border-gray-300 pb-1">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs border">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider border-b border-gray-300 pb-1">Certifications</h2>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium text-gray-900">{cert.title}</p>
                    <p className="text-xs text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider border-b border-gray-300 pb-1">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, idx) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs border">
                    {lang.name} {lang.proficiency && `(${lang.proficiency})`}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && interests.some(Boolean) && (
            <section>
              <h2 className="text-sm font-bold uppercase text-gray-800 mb-2 tracking-wider border-b border-gray-300 pb-1">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.filter(Boolean).map((int, idx) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs border">
                    {int}
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

export default TemplateTwo;