import React, { useState, useEffect, useContext } from "react";
import NavBar from "../Components/navbarNotLanding";
import styles from "../Components/styles/forms.module.css";
import BlockchainContext from "../Contexts/BlockchainContext";
import { toast } from "react-toastify";

const CreatePolicy = () => {
  const [rabi, setRabi] = useState([]);
  const [kharif, setKharif] = useState([]);
  const [area, setArea] = useState("");
  const [locationn, setLocationn] = useState("");
  const [crop, setCrop] = useState("");
  const [type, setType] = useState("");
  const [loader, setLoader] = useState(false);

  const blockchainContext = useContext(BlockchainContext);
  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      const response1 = await contract.methods.cropTypes(0).call();
      const response2 = await contract.methods.cropTypes(1).call();

      // Update state with the result.
      setRabi(response1);
      setKharif(response2);
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
    try {
      setLoader(true);
      await contract.methods.newPolicy(area, locationn, forFlood, cropId).send({
        from: accounts[0],
        to: contract,
        value: amount,
      });
      toast.success("Policy Created.");
    } catch (err) {
      if (err.message) {
        toast.error("Policy Not Created. Please try again.");
      } else toast.error("Something went wrong");
    }
    setLoader(false);
    setRabi([]);
    setKharif([]);
    setArea("");
    setCrop("");
    setType("");
    setLocationn("");
  };

  return (
    <React.Fragment>
      <NavBar />
      <div className={`container-fluid ${styles.entire}`}>
        <div className="row">
          <div className={`col-md-4 col-lg-6 ${styles.bgImage}`}></div>
          <div className="col-md-8 col-lg-6">
            <div className={`${styles.form}`}>
              <h3 className={`${styles.heading} mb-4`}>Create a new policy</h3>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div className="form-floating mb-3">
                  <label htmlFor="Location" className="form-label">
                    Location :
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
                  <label
                    htmlFor="type"
                    className={`${styles.radio} form-label`}
                  >
                    {" "}
                    Crop Type :
                  </label>
                  <input
                    type="radio"
                    value="rabi"
                    id="rabi"
                    checked={crop === "rabi"}
                    onChange={(e) => setCrop(e.target.value)}
                    name="crop"
                    required={true}
                  />
                  <label className={`${styles.radio}`} htmlFor="rabi">
                    {" "}
                    &nbsp; Rabi
                  </label>

                  <input
                    type="radio"
                    value="kharif"
                    id="kharif"
                    checked={crop === "kharif"}
                    onChange={(e) => setCrop(e.target.value)}
                    name="crop"
                    required={true}
                  />
                  <label className={`${styles.radio}`} htmlFor="kharif">
                    {" "}
                    &nbsp; Kharif
                  </label>
                </div>

                <div className="form-floating mb-3">
                  <label
                    htmlFor="type"
                    className={`${styles.radio} form-label`}
                  >
                    {" "}
                    Calamity : &nbsp;
                  </label>
                  <input
                    type="radio"
                    value="flood"
                    id="flood"
                    checked={type === "flood"}
                    onChange={(e) => setType(e.target.value)}
                    name="type"
                    required={true}
                  />
                  <label className={`${styles.radio}`} htmlFor="flood">
                    {" "}
                    &nbsp; Flood
                  </label>

                  <input
                    type="radio"
                    value="drought"
                    id="drought"
                    checked={type === "drought"}
                    onChange={(e) => setType(e.target.value)}
                    name="type"
                    required={true}
                  />
                  <label className={`${styles.radio}`} htmlFor="drought">
                    {" "}
                    &nbsp; Drought
                  </label>
                </div>
                <div className="form-group form-inline">
                  <label className={`${styles.radio}`}>
                    Premium to pay (in wei) :{" "}
                  </label>
                  <input
                    type="premium"
                    className="form-control"
                    value={
                      area *
                      (crop === "rabi"
                        ? rabi.premiumPerAcre
                        : crop === "kharif"
                        ? kharif.premiumPerAcre
                        : 0)
                    }
                    id="premium"
                    placeholder="0"
                    disabled
                  />
                </div>
                <div className="d-grid">
                  <button
                    className={`btn btn-lg btn-block text-uppercase fw-bold mb-2 ${styles.btn}`}
                    type="submit"
                    disabled={loader}
                  >
                    {loader ? (
                      <i className="fa fa-refresh fa-spin" />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreatePolicy;
