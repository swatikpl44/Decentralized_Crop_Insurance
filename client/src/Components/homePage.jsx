import React, { useContext, useState, useEffect } from "react";
import BlockchainContext from "../Contexts/BlockchainContext";

const cropKeys = ["name", "premiumPerAcre", "duration", "coveragePerAcre"];
const policyKeys = ["user", "policyId", "premium", "coverageAmount", "state"];

const HomePage = () => {
  const [rabi, setRabi] = useState([]);
  const [kharif, setKharif] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [myPolicies, setMyPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const [balance, setBalance] = useState("");
  const [area, setArea] = useState("");
  const [locationn, setLocationn] = useState("");
  const [crop, setCrop] = useState("");
  const [type, setType] = useState("");
  const blockchainContext = useContext(BlockchainContext);

  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      // Stores a given value, 5 by default.
      // await contract.methods.set(50).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response1 = await contract.methods.cropTypes(0).call();
      const response2 = await contract.methods.cropTypes(1).call();
      const policies = await contract.methods.viewAllPolicies().call();
      const myPolicy = await contract.methods
        .viewMyPolicies(accounts[0])
        .call();
      const bal = await contract.methods.balanceOf().call();

      // Update state with the result.
      setRabi(response1);
      setKharif(response2);
      setAllPolicies(policies);
      setMyPolicies(myPolicy);
      setBalance(bal);

      console.log(allPolicies);
      //console.log("my", myPolicies);
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

    const amount =
      area *
      (crop === "rabi"
        ? rabi.premiumPerAcre
        : crop === "kharif"
        ? kharif.premiumPerAcre
        : 0);

    const forFlood = type === "flood" ? true : false;
    const cropId = crop === "rabi" ? 0 : 1;
    await contract.methods.newPolicy(area, locationn, forFlood, cropId).send({
      from: accounts[0],
      to: contract,
      value: amount,
    });
    console.log("Created");
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    const amount = allPolicies[policyId][policyKeys[3]];

    await contract.methods.coverPolicy(policyId).send({
      from: accounts[0],
      to: contract,
      value: amount,
    });
    console.log("Covered");
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();

    const timestamp = Date.now();

    await contract.methods.claimPolicy(policyId).send({ from: accounts[0] });
    console.log("Claimed");
  };

  return (
    <div>
      The contract balance is {balance}
      {rabi &&
        cropKeys.map((item) => (
          <li key={item}>
            {" "}
            {item} : {rabi[item]}
          </li>
        ))}
      <br />
      <h4>All Policies</h4>
      {allPolicies &&
        allPolicies.length &&
        allPolicies.map((val, index) =>
          policyKeys.map((item) => (
            <li key={item}>
              {" "}
              {item} : {allPolicies[index][item]}{" "}
            </li>
          ))
        )}
      <br />
      <h4>My Policies</h4>
      {myPolicies &&
        myPolicies.length &&
        myPolicies.map((val, index) =>
          policyKeys.map((item) => (
            <li key={item}>
              {" "}
              {item} : {myPolicies[index][item]}{" "}
            </li>
          ))
        )}
      <br />
      <form
        onSubmit={(e) => {
          handleSubmit2(e);
        }}
      >
        <div className="form-floating mb-3">
          <label htmlFor="Cover" className="form-label">
            Cover Policy :
          </label>
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            placeholder="Enter policy Id"
            required={true}
          />
        </div>
        <div className="d-grid">
          <button
            className={`btn btn-lg btn-primary btn-block text-uppercase fw-bold mb-2`}
            type="submit"
          >
            Cover
          </button>
        </div>
      </form>
      <br />
      <form
        onSubmit={(e) => {
          handleSubmit3(e);
        }}
      >
        <div className="form-floating mb-3">
          <label htmlFor="Claim" className="form-label">
            Claim Policy :
          </label>
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            placeholder="Enter policy Id"
            required={true}
          />
        </div>
        <div className="d-grid">
          <button
            className={`btn btn-lg btn-primary btn-block text-uppercase fw-bold mb-2`}
            type="submit"
          >
            Claim
          </button>
        </div>
      </form>
      <br />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="form-floating mb-3">
          <label htmlFor="Area" className="form-label">
            Area :
          </label>
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter farm area"
            required={true}
          />
        </div>
        <div className="form-floating mb-3">
          <label htmlFor="Location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            value={locationn}
            onChange={(e) => setLocationn(e.target.value)}
            placeholder="Enter farm location"
            required={true}
          />
        </div>
        <div className="form-floating mb-3">
          <input
            type="radio"
            value="rabi"
            id="rabi"
            onChange={(e) => setCrop(e.target.value)}
            name="crop"
            required={true}
          />
          <label htmlFor="rabi"> &nbsp; Rabi</label>

          <input
            type="radio"
            value="kharif"
            id="kharif"
            onChange={(e) => setCrop(e.target.value)}
            name="crop"
            required={true}
          />
          <label htmlFor="kharif"> &nbsp; Kharif</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="radio"
            value="flood"
            id="flood"
            onChange={(e) => setType(e.target.value)}
            name="type"
            required={true}
          />
          <label htmlFor="flood"> &nbsp; Flood</label>

          <input
            type="radio"
            value="drought"
            id="drought"
            onChange={(e) => setType(e.target.value)}
            name="type"
            required={true}
          />
          <label htmlFor="drought"> &nbsp; Drought</label>
        </div>
        Premium to pay :{" "}
        {area *
          (crop === "rabi"
            ? rabi.premiumPerAcre
            : crop === "kharif"
            ? kharif.premiumPerAcre
            : 0)}
        <div className="d-grid">
          <button
            className={`btn btn-lg btn-primary btn-block text-uppercase fw-bold mb-2`}
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
