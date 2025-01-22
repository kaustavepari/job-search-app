import { Link } from "react-router-dom";
import NavBar from "../NavBar";
import "./Home.css"; // Create and include a CSS file for styling

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="home-container">
        <header className="home-header">
        </header>
        <main className="home-content">
          <h1 className="home-title">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information, and company reviews. 
            Find the job that fits your abilities and potential.
          </p>
          <Link to="/jobs">
            <button className="home-find-jobs-btn">Find Jobs</button>
          </Link>
        </main>
      </div>
    </>
  );
};

export default Home;
