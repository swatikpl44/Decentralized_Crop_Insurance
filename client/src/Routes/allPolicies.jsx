import React, { useState, useEffect, useContext } from "react";
import NavBar from "../Components/navbarNotLanding";
import styles from "../Components/styles/allPolicies.module.css";
import BlockchainContext from "../Contexts/BlockchainContext";

const policyKeys = ["policyId", "user", "coverageAmount", "state"];

const AllPolicy = () => {
  const [allPolicies, setAllPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");

  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      const policies = await contract.methods.viewAllPolicies().call();
      setAllPolicies(policies);
      console.log(allPolicies);
    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
  }, [web3, accounts, contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = allPolicies[policyId][policyKeys[2]];

    await contract.methods.coverPolicy(policyId).send({
      from: accounts[0],
      to: contract,
      value: amount,
    });
    console.log("Covered");
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
          <label htmlFor="Cover" className="form-label">
            Enter the policy ID you want to cover :
          </label>
          <div className="form-floating input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              placeholder="Policy Id"
              required={true}
            />
            <label className={`${styles.radio}`}>
              Pay Coverage Amount (in wei) :{" "}
            </label>
            <input
              type="text"
              className="form-control"
              value={policyId === "" ? 0 : allPolicies[policyId][policyKeys[2]]}
              id="coverage"
              placeholder="0"
              disabled
            />
            <div>
              <button
                className={`btn btn-block text-uppercase fw-bold mb-2 ${styles.btn}`}
                type="submit"
              >
                Cover
              </button>
            </div>
          </div>
        </form>
        <br />
        <h4 className={`${styles.header}`}>All Policies : </h4>
        <br />
        <ul className="list-group">
          <li className={`list-group-item ${styles.listHeader}`}>
            <div className="row">
              <div className="col-sm-2 text-center">
                <b>Policy Id</b>
              </div>
              <div className="col-sm-6 text-center">
                <b>User Account Address</b>
              </div>
              <div className="col-sm-2 text-center">
                <b>Coverage Amount</b>
              </div>
              <div className="col-sm-2 text-center">
                <b>Status</b>
              </div>
            </div>
          </li>
          {allPolicies &&
            allPolicies.length &&
            allPolicies
              .map((val, index) => (
                <li className={`list-group-item ${styles.list}`} key={index}>
                  <div className="row">
                    <div className="col-sm-2 text-center">
                      <i>{allPolicies[index][policyKeys[0]]}</i>
                    </div>
                    <div className="col-sm-6 text-center">
                      <i>{allPolicies[index][policyKeys[1]]}</i>
                    </div>
                    <div className="col-sm-2 text-center">
                      <i>{allPolicies[index][policyKeys[2]]}</i>
                    </div>
                    <div
                      className={
                        "col-sm-2 text-center " +
                        (allPolicies[index][policyKeys[3]] === "0"
                          ? `${styles.active}`
                          : `${styles.inactive}`)
                      }
                    >
                      <i>
                        {allPolicies[index][policyKeys[3]] === "0"
                          ? "Open"
                          : "Covered"}
                      </i>
                    </div>
                  </div>
                </li>
              ))
              .reverse()}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default AllPolicy;
