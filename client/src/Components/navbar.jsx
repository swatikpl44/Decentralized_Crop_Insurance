import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbar.module.css";

const Navbar = (props) => {
  const [navBackground, setNavBackGround] = useState(styles.notscrolled);
  const handleBtnClick = () => {
    if (navBackground === styles.scrolled) setNavBackGround(styles.notScrolled);
    else setNavBackGround(styles.scrolled);
  };
  return (
    <React.Fragment>
      <nav
        className={`navbar navbar-expand-lg sticky-top ${styles.navbar} ${props.navBackground} ${navBackground}`}
      >
        <li className={styles.title}>
          <Link className={styles.brand} to="/">
            EasyInsure
          </Link>
        </li>

        <button
          onClick={handleBtnClick}
          style={{ color: "inherit" }}
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i
            className="fa fa-bars p-1"
            style={{ color: "inherit" }}
            aria-hidden="true"
          ></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarToggler">
          {/* <Link to="/admin/login">loginPage</Link> */}
          <ul className={"navbar-nav "} style={{ margin: "0 0 0 auto" }}>
            <li style={{ float: "right" }}>
              <Link to="/claim">CLAIM INSURANCE</Link>
            </li>
            <li style={{ float: "right" }}>
              <Link to="/allPolicies">ALL POLICIES</Link>
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
