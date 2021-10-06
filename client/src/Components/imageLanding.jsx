import React from "react";
import { Link } from "react-scroll";
import styles from "./styles/image_landing.module.css";

const ImageLanding = (props) => {
  return (
    <React.Fragment>
      <div className={styles.backgroundImage}>
        <div className={styles.title}>
          <p className={styles.text}> Decentralized Crop Insurance</p>
          <p className={styles.header}> EasyInsure</p>
          <p className={styles.details}> No Middlemen, Timely Payouts</p>
        </div>
        <button
          className={`btn btn-success p-3 ${styles.btn}`}
          onClick={() => {
            window.location.assign("/create");
          }}
        >
          CREATE POLICY
        </button>
      </div>
    </React.Fragment>
  );
};

export default ImageLanding;
