import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import FailureView from "../FailureView";
import "./JobItem.css"

const JobItem = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    
    const url = `https://apis.ccbp.in/jobs/${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MTk2Mjg2MTN9. nZDlFsnSWArLKKeF0QbmdVfLgzUbx1BGJsqa2kc_21Y`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const data = await response.json();
      setJobDetails(data.job_details);
      setSimilarJobs(data.similar_jobs);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <Loader type="ThreeDots" color="#4F46E5" height="50" width="50" />
      </div>
    );
  }

  if (error) {
    return <FailureView handleRetry={fetchJobDetails} />;
  }

  if (!jobDetails) {
    return <p>No job details found.</p>;
  }

  return (
    <div className="job-details-page">
      <NavBar />
      <div className="job-details-container">
        <div className="job-header">
          <img
            className="company-logo"
            src={jobDetails.company_logo_url}
            alt="job details company logo"
          />
          <div className="job-header-info">
            <h1 className="job-title">{jobDetails.title}</h1>
            <p className="employment-type">{jobDetails.employment_type}</p>
            <p className="package">{jobDetails.package_per_annum}</p>
          </div>
        </div>

        <div className="job-description">
          <h2>Job Description</h2>
          <p>{jobDetails.job_description}</p>
        </div>

        <div className="job-details-extra">
          <div className="details-item">
            <h3>Location:</h3>
            <p>{jobDetails.location}</p>
          </div>
          <div className="details-item">
            <h3>Rating:</h3>
            <p>{jobDetails.rating}</p>
          </div>
          <a className="visit-button" href={jobDetails.company_website_url}>
            Visit Company Website
          </a>
        </div>

        {jobDetails.life_at_company && (
          <div className="life-at-company">
            <h2>Life at the Company</h2>
            <p>{jobDetails.life_at_company.description}</p>
            <img
              src={jobDetails.life_at_company.image_url}
              alt="Life at the company"
            />
          </div>
        )}

        <div className="skills">
          <h2>Skills Required</h2>
          <ul>
            {jobDetails.skills?.map((skill) => (
              <li key={skill.name}>
                <img src={skill.image_url} alt={skill.name} />
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="similar-jobs">
          <h2>Similar Jobs</h2>
          <ul>
            {similarJobs.length > 0 ? (
              similarJobs.map((job) => (
                <li key={job.id} className="similar-job-item">
                  <img
                    src={job.company_logo_url}
                    alt="Similar job company logo"
                  />
                  <h3>{job.title}</h3>
                  <p>{job.job_description}</p>
                  <p>{job.employment_type}</p>
                  <p>{job.location}</p>
                  <p>Rating: {job.rating}</p>
                </li>
              ))
            ) : (
              <p>No similar jobs available at the moment.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobItem;
