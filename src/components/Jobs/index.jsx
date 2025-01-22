import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import NoJobs from "../NoJobs";
import FailureView from "../FailureView";
import "./Jobs.css";

const employmentTypesList = [
  { label: "Full Time", employmentTypeId: "FULLTIME" },
  { label: "Part Time", employmentTypeId: "PARTTIME" },
  { label: "Freelance", employmentTypeId: "FREELANCE" },
  { label: "Internship", employmentTypeId: "INTERNSHIP" },
];

const salaryRangesList = [
  { salaryRangeId: "1000000", label: "10 LPA and above" },
  { salaryRangeId: "2000000", label: "20 LPA and above" },
  { salaryRangeId: "3000000", label: "30 LPA and above" },
  { salaryRangeId: "4000000", label: "40 LPA and above" },
];

const Jobs = () => {
  const [profileData, setProfileData] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempSearchInput, setTempSearchInput] = useState(""); // Temporary input value
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRange, setSelectedRange] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MTk2Mjg2MTN9.nZDlFsnSWArLKKeF0QbmdVfLgzUbx1BGJsqa2kc_21Y";

  

  async function fetchFilteredData() {

    const queryParameters = [
      selectedTags.length
        ? `employment_type=${selectedTags.join(",")}`
        : "employment_type=",
      selectedRange ? `minimum_package=${selectedRange}` : "minimum_package=",
      searchInput ? `search=${searchInput}` : "search=",
    ];
    
    
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    try {
      const finalUrl = `https://apis.ccbp.in/jobs?${queryParameters.join("&")}`;
      const response = await fetch(finalUrl, options);
      if (response.ok) {
        const data = await response.json();
        setJobsList(data.jobs);
      } else {
        throw new Error("Failed to fetch jobs data");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchFilteredData();
  }, [searchInput, selectedTags, selectedRange]);

  

  const getProfileData = async () => {
    
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };
  
    try {
      const response = await fetch("https://apis.ccbp.in/profile", options);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile_details);  // Assuming profile_details is the key in the response
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  useEffect(() => {
    getProfileData();
  }, []);

  const handleTags = (tag, event) => {
    const { checked } = event.target;
    const updatedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((item) => item !== tag);
    setSelectedTags(updatedTags);
  };

  const handleRange = (event) => {
    setSelectedRange(event.target.value);
  };

  const handleTempSearchInputChange = (event) => {
    setTempSearchInput(event.target.value); // Update tempSearchInput while typing
  };

  const handleSearchButtonClick = (event) => {
    event.preventDefault(); // Prevent page reload
    setSearchInput(tempSearchInput); // Update searchInput on button click
  };

  if (isLoading) {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="background-container">
        <div className="left-sidebar">
          {profileData ? (
            <div className="profile-card">
              <img
                src={profileData.profile_image_url}
                alt={`profile of ${profileData.name}`}
                className="profile-image"
              />
              <h1 className="profile-name">{profileData.name}</h1>
              <p className="profile-bio">{profileData.short_bio}</p>
            </div>
          ) : (
            <FailureView handleRetry={getProfileData} />
          )}
          <div className="types-list">
            <h3>Employment Type</h3>
            {
              console.log("employment")
            }
            {employmentTypesList.map((item) => (
              <label key={item.employmentTypeId}>
                <input
                  type="checkbox"
                  value={item.employmentTypeId}
                  onChange={(e) => handleTags(item.employmentTypeId, e)}
                />
                {item.label}
              </label>
            ))}
          </div>

          <div className="ranges-list">
            <h3>Salary Range</h3>
            {salaryRangesList.map((item) => (
              <label key={item.salaryRangeId}>
                <input
                  type="radio"
                  name="salaryRange"
                  value={item.salaryRangeId}
                  onChange={handleRange}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
        <div className="main-content">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form submission reload
              handleSearchButtonClick(e);
            }}
          >
            <input
              role="searchbox"
              type="search"
              placeholder="Search for jobs"
              value={tempSearchInput}
              onChange={handleTempSearchInputChange}
              className="search-input"
            />
            <button data-testid="searchButton" type="submit">
              Search
            </button>
          </form>

          {isLoading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : jobsList.length > 0 ? (
            <ul className="jobs-list">
              {jobsList.map((job) => (
                <li key={job.id} className="job-item">
                  <Link to={`/jobs/${job.id}`}>
                    <img
                      src={job.company_logo_url}
                      alt={`Company logo of ${job.title}`}
                      className="company-logo"
                    />
                    <div className="job-details">
                      <h2>{job.title}</h2>
                      <h1>Description</h1>
                      <p>{job.job_description}</p>
                      <p>{job.location}</p>

                      <p>{`${job.employment_type}`}</p>
                      <p>{`${job.package_per_annum}`}</p>
                      <p>{`${job.rating}`}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <NoJobs />
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
