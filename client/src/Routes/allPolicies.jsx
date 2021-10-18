import React, { useState, useEffect, useContext } from "react";
import NavBar from "../Components/navbarNotLanding";
import styles from "../Components/styles/allPolicies.module.css";
import BlockchainContext from "../Contexts/BlockchainContext";
import { toast } from "react-toastify";

const policyKeys = ["policyId", "user", "coverageAmount", "state"];

const AllPolicy = () => {
  const [allPolicies, setAllPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const [loader, setLoader] = useState(false);

  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      const policies = await contract.methods.viewAllPolicies().call();
      setAllPolicies(policies);
      //console.log(allPolicies);
    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
  }, [web3, accounts, contract, allPolicies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (policyId >= allPolicies.length) {
      toast.error("Sorry, this policy ID doesn't exist.");
      return;
    }

    const amount = allPolicies[policyId][policyKeys[2]] * 1e15;

    try {
      setLoader(true);
      await contract.methods.coverPolicy(policyId).send({
        from: accounts[0],
        to: contract,
        value: amount,
      });
      toast.success("Policy Covered.");
    } catch (err) {
      if (err.message) {
        toast.error(
          "Either policy is already covered or doesn't exist for you to cover."
        );
      } else toast.error("Something went wrong");
    }
    setLoader(false);
    setPolicyId("");
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
              Pay Coverage Amount (in finney) :{" "}
            </label>
            <input
              type="text"
              className="form-control"
              value={
                policyId === "" || policyId >= allPolicies.length
                  ? 0
                  : allPolicies[policyId][policyKeys[2]]
              }
              id="coverage"
              placeholder="0"
              disabled
            />
            <div>
              <button
                className={`btn btn-block text-uppercase fw-bold mb-2 ${styles.btn}`}
                type="submit"
                disabled={loader}
              >
                {loader ? <i className="fa fa-refresh fa-spin" /> : "Cover"}
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
                <b>Farmer Account Address</b>
              </div>
              <div className="col-sm-2 text-center">
                <b>Coverage Amount (in Finney)</b>
              </div>
              <div className="col-sm-2 text-center">
                <b>Status</b>
              </div>
            </div>
          </li>
          {allPolicies &&
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
