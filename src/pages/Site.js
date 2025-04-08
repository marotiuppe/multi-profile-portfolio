import React from "react";
import "./PageStyles.css";
import { useProfile } from "../context/ProfileContext";
import { Navigate } from "react-router-dom";
import VisitStats from "../components/VisitStats";

const Site = () => {
  const { currentProfile, loading, error } = useProfile();

  if (loading) {
    return;
  }

  if (error || !currentProfile) {
    return <Navigate to="/404" replace />;
  } else {
    const { site } = currentProfile;

    return (
      <div className="page-container">
        <h1 className="page-title">{site.title}</h1>
        <div className="page-content">
          <p>{site.introduction}</p>

          <h2>{site.technicalStack.title}</h2>
          <p>{site.technicalStack.description}</p>
          <ul>
            {site.technicalStack.technologies.map((tech, index) => (
              <li key={index}>
                <strong>{tech.name}</strong> - {tech.description}
              </li>
            ))}
          </ul>

          <h2>{site.developmentApproach.title}</h2>
          <p>{site.developmentApproach.description}</p>
          <ul>
            {site.developmentApproach.practices.map((practice, index) => (
              <li key={index}>{practice}</li>
            ))}
          </ul>

          <h2>{site.deployment.title}</h2>
          <p>{site.deployment.description}</p>

          <p>{site.footer.text}</p>
          <p>
            {site.footer.sourceCode.text}{" "}
            <a
              href={site.footer.sourceCode.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        </div>
        <VisitStats />
      </div>
    );
  }
};

export default Site;
