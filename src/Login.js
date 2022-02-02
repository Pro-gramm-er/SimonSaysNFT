import { useWeb3React } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import React from "react";
import connectors from "./connectors";

function LoginButton() {
  const { active, account, activate, deactivate } = useWeb3React();

  function createConnectHandler(connectorId) {
    return async () => {
      try {
        const connector = connectors[connectorId];

        if (connector.walletConnectProvider?.wc?.uri) {
          connector.walletConnectProvider = undefined;
        }

        await activate(connector);
      } catch (error) {
        console.error(error);
      }
    };
  }

  async function handleDisconnect() {
    try {
      deactivate();
    } catch (error) {
      console.error(error);
    }
  }

  if (active) {
    return (
      <>
        <div>Connected to {account}</div>
        <button onClick={handleDisconnect}>Disconnect</button>
      </>
    );
  }

  return (
    <>
      <button
        key="Login"
        onClick={createConnectHandler(Object.keys(connectors)[2])}
      >
        Login
      </button>
    </>
  );
}

export default LoginButton;
