import React, { useState, useEffect, useContext } from "react";
import NavBar from "../Components/navbarNotLanding";
import styles from "../Components/styles/claimPolicy.module.css";
import BlockchainContext from "../Contexts/BlockchainContext";

const policyKeys = [
  "policyId",
  "premium",
  "area",
  "endTime",
  "location",
  "coverageAmount",
  "forFlood",
  "cropId",
  "state",
];

const ClaimPolicy = () => {
  const [policyId, setPolicyId] = useState("");
  const [calamityDate, setCalamityDate] = useState("");
  const [myPolicies, setMyPolicies] = useState([]);
  const [pStates, setPStates] = useState([]);

  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      const myPolicy = await contract.methods
        .viewMyPolicies(accounts[0])
        .call();
      const bal = await contract.methods.balanceOf().call();

      setMyPolicies(myPolicy);
      //console.log(allPolicies);
    };

    const findState = async () => {
      const res = [];
      for (var i = 0; i < myPolicies.length; i++) {
        var val = myPolicies[i][policyKeys[8]];
        if (val === "0") {
          res.push("Pending");
        } else if (val === "1") {
          res.push("Active");
        } else if (val === "2") {
          res.push("Paid Out");
        } else if (val === "3") {
          res.push("Timed Out");
        }
      }
      setPStates(res);
    };

    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
      findState();
    }
  }, [web3, accounts, contract, myPolicies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = Date.now();

    await contract.methods.claimPolicy(policyId).send({ from: accounts[0] });
    console.log("Claimed");
  };

  const cardsRow = () => {
    const row = [];

    for (var i = 0; i < myPolicies.length; i += 3) {
      row.push(
        <div className={`row ${styles.rows}`}>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  Policy No. {myPolicies[i][policyKeys[0]]}
                </h5>
                Status: &nbsp;
                <span
                  className={
                    pStates[i] === "Pending"
                      ? `${styles.pending}`
                      : pStates[i] === "Active"
                      ? `${styles.active}`
                      : pStates[i] === "Paid Out"
                      ? `${styles.paid}`
                      : `${styles.timed}`
                  }
                >
                  {pStates[i]}
                </span>
                <p>
                  Location :{" "}
                  <span className={`${styles.text}`}>
                    {myPolicies[i][policyKeys[4]]}
                  </span>
                  , Area :{" "}
                  <span className={`${styles.text}`}>
                    {myPolicies[i][policyKeys[2]]} acres
                  </span>
                  <br />
                  Crop :{" "}
                  <span className={`${styles.text}`}>
                    {myPolicies[i][policyKeys[7]] === "0" ? "Rabi" : "Kharif"}
                  </span>
                  , Against :{" "}
                  <span className={`${styles.text}`}>
                    {myPolicies[i][policyKeys[6]] == "1" ? "Flood" : "Drought"}
                  </span>
                </p>
                <p>
                  Active Till :{" "}
                  <span className={`${styles.text}`}>
                    {new Date(
                      myPolicies[i][policyKeys[3]] * 1000
                    ).toLocaleDateString("en-IN")}
                  </span>
                </p>
                <p>
                  Premium paid :{" "}
                  <span className={`${styles.text}`}>
                    {" "}
                    {myPolicies[i][policyKeys[1]]}{" "}
                  </span>{" "}
                  <br /> The maximum amount payable in the event of claim is{" "}
                  <span className={`${styles.text}`}>
                    {" "}
                    {myPolicies[i][policyKeys[5]]}{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {i + 1 < myPolicies.length && (
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Policy No. {myPolicies[i + 1][policyKeys[0]]}
                  </h5>
                  Status: &nbsp;
                  <span
                    className={
                      pStates[i + 1] === "Pending"
                        ? `${styles.pending}`
                        : pStates[i + 1] === "Active"
                        ? `${styles.active}`
                        : pStates[i + 1] === "Paid Out"
                        ? `${styles.paid}`
                        : `${styles.timed}`
                    }
                  >
                    {pStates[i + 1]}
                  </span>
                  <p>
                    Location :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 1][policyKeys[4]]}
                    </span>
                    , Area :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 1][policyKeys[2]]} acres
                    </span>
                    <br />
                    Crop :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 1][policyKeys[7]] === "0"
                        ? "Rabi"
                        : "Kharif"}
                    </span>
                    , Against :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 1][policyKeys[6]] == "1"
                        ? "Flood"
                        : "Drought"}
                    </span>
                  </p>
                  <p>
                    Active Till :{" "}
                    <span className={`${styles.text}`}>
                      {new Date(
                        myPolicies[i + 1][policyKeys[3]] * 1000
                      ).toLocaleDateString("en-IN")}
                    </span>
                  </p>
                  <p>
                    Premium paid :{" "}
                    <span className={`${styles.text}`}>
                      {" "}
                      {myPolicies[i + 1][policyKeys[1]]}{" "}
                    </span>{" "}
                    <br /> The maximum amount payable in the event of claim is{" "}
                    <span className={`${styles.text}`}>
                      {" "}
                      {myPolicies[i + 1][policyKeys[5]]}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {i + 2 < myPolicies.length && (
            <div className="col-sm-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Policy No. {myPolicies[i + 2][policyKeys[0]]}
                  </h5>
                  Status: &nbsp;
                  <span
                    className={
                      pStates[i + 2] === "Pending"
                        ? `${styles.pending}`
                        : pStates[i + 2] === "Active"
                        ? `${styles.active}`
                        : pStates[i + 2] === "Paid Out"
                        ? `${styles.paid}`
                        : `${styles.timed}`
                    }
                  >
                    {pStates[i + 2]}
                  </span>
                  <p>
                    Location :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 2][policyKeys[4]]}
                    </span>
                    , Area :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 2][policyKeys[2]]} acres
                    </span>
                    <br />
                    Crop :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 2][policyKeys[7]] === "0"
                        ? "Rabi"
                        : "Kharif"}
                    </span>
                    , Against :{" "}
                    <span className={`${styles.text}`}>
                      {myPolicies[i + 2][policyKeys[6]] == "1"
                        ? "Flood"
                        : "Drought"}
                    </span>
                  </p>
                  <p>
                    Active Till :{" "}
                    <span className={`${styles.text}`}>
                      {new Date(
                        myPolicies[i + 2][policyKeys[3]] * 1000
                      ).toLocaleDateString("en-IN")}
                    </span>
                  </p>
                  <p>
                    Premium paid :{" "}
                    <span className={`${styles.text}`}>
                      {" "}
                      {myPolicies[i + 2][policyKeys[1]]}{" "}
                    </span>{" "}
                    <br /> The maximum amount payable in the event of claim is{" "}
                    <span className={`${styles.text}`}>
                      {" "}
                      {myPolicies[i + 2][policyKeys[5]]}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return row;
  };

  return (
    <React.Fragment>
      <NavBar />
      <div className={`container-fluid ${styles.entire}`}>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="form-floating input-group mb-3">
            <label htmlFor="Cover" className={`${styles.radio}`}>
              Enter your policy ID to claim :
            </label>
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              placeholder="Policy Id"
              required={true}
            />
            <label className={`${styles.dateField}`}>Date of Calamity : </label>
            <input
              type="text"
              className="form-control"
              value={calamityDate}
              onChange={(e) => setCalamityDate(e.target.value)}
              id="date"
              placeholder="dd-mm-yyyy"
            />
            <div>
              <button
                className={`btn btn-block text-uppercase fw-bold mb-2 ${styles.btn}`}
                type="submit"
              >
                Claim
              </button>
            </div>
          </div>
        </form>
        <h4 className={`${styles.header}`}>My Policies : </h4>
        <br />
        {myPolicies && myPolicies.length && cardsRow()}
      </div>
    </React.Fragment>
  );
};

export default ClaimPolicy;
