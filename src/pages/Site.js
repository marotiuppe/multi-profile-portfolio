import React, { useState, useEffect } from "react";
import "./PageStyles.css";
import { useData } from "../context/dataContext";
import { Navigate, useParams } from "react-router-dom";
import VisitStats from "../components/VisitStats";

const Site = () => {
  const { profileId } = useParams();
  const { getProfileByProfileId } = useData();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfileByProfileId(profileId);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, getProfileByProfileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/404" replace />;
  }

  if (profile.status !== 'active') {
    return <Navigate to="/404" replace />;
  }

  const { site } = profile;

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
};

export default Site;
