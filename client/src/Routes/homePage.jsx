import React, { useState, useEffect } from "react";
import NavBar from "../Components/navbarLanding";
import ImageLanding from "../Components/imageLanding";
import ScrollToTop from "../Components/scrollToTop";

const HomePage = (p) => {
  return (
    <React.Fragment>
      <NavBar />
      <ScrollToTop />
      <ImageLanding />
      {/* <button type="button" className="btn btn-secondary" data-toggle="tooltip">
        <Link
          to={{
            pathname: "/create/",
          }}
        >
          Create Policy
        </Link>
      </button>
      <button type="button" className="btn btn-secondary" data-toggle="tooltip">
        <Link
          to={{
            pathname: "/myPolicies/",
          }}
        >
          View my policies
        </Link>
      </button>
      <button type="button" className="btn btn-secondary" data-toggle="tooltip">
        <Link
          to={{
            pathname: "/allPolicies/",
          }}
        >
          View all policies
        </Link>
      </button>
      <button type="button" className="btn btn-secondary" data-toggle="tooltip">
        <Link
          to={{
            pathname: "/claim/",
          }}
        >
          Claim Policy
        </Link>
      </button> */}
    </React.Fragment>
  );
};

export default HomePage;
