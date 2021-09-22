import React, { useContext, useState, useEffect } from "react";
import BlockchainContext from "../Contexts/BlockchainContext";

const HomePage = () => {
  const [storageValue, setStorageValue] = useState(undefined);
  const blockchainContext = useContext(BlockchainContext);

  const { web3, accounts, contract } = blockchainContext;

  useEffect(() => {
    const load = async () => {
      // Stores a given value, 5 by default.
      await contract.methods.set(50).send({ from: accounts[0] });

      // Get the value from the contract to prove it worked.
      const response = await contract.methods.get().call();

      // Update state with the result.
      setStorageValue(response);
    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
  }, [web3, accounts, contract]);

  return <div>The stored value is: {storageValue}</div>;
};

export default HomePage;
