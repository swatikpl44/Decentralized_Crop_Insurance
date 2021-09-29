import React, { useState, useEffect } from "react";
import PolicyContract from "./contracts/Policy.json";
import getWeb3 from "./getWeb3";
import BlockchainContext from "./Contexts/BlockchainContext";
import HomePage from "./Components/homePage";

import "./App.css";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PolicyContract.networks[networkId];
        const instance = new web3.eth.Contract(
          PolicyContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  if (typeof web3 === "undefined") {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <BlockchainContext.Provider value={{ web3, accounts, contract }}>
        <HomePage />
      </BlockchainContext.Provider>
    </div>
  );
}

export default App;
