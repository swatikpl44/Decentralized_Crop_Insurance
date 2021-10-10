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
    </React.Fragment>
  );
};

export default HomePage;
