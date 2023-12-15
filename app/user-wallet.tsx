"use client";
import * as React from "react";
import { getMetaMaskProvider, shortHex } from "./utils";
import { syncWalletCookie } from "./actions";

type UserWallet = {
  address: `0x${string}`;
  chainId: number;
};

export function UserWallet(props: { wallet: UserWallet | null }) {
  useSyncWallet();

  const connect = () => {
    const ethereum = getMetaMaskProvider();
    if (!ethereum) return;
    ethereum.request({ method: "eth_requestAccounts" });
  };

  if (!props.wallet) return <button onClick={connect}>Connect</button>;

  return (
    <div className="flex items-center">
      <div>Network #{props.wallet.chainId}</div>
      <div className="pl-8">{shortHex(props.wallet.address)}</div>
    </div>
  );
}

/**
 * This hook will check if the user is connected to a wallet and sync the state with the server.
 * If injected `ethereum` object is available, it will check for connected accounts and chain ID.
 * If the user is not connected, it will trigger the server action in order to clear the cookie and invalid the current server data.
 * If the user is connected, it will trigger the server action with the address and the chain ID. The cookie will be updated and the data invalidated.
 * If the user changes the connected account or the chain ID, it will trigger the server action with the address, the chain ID and the current pathname. The cookie will be updated and the server data invalidated.
 */
function useSyncWallet() {
  React.useEffect(() => {
    async function checkConnectedAccount(ethereum: any) {
      if (!ethereum) return () => {};
      const [account] = await ethereum.request({ method: "eth_accounts" });
      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (!account || !chainId) {
        syncWalletCookie(null);
      } else {
        syncWalletCookie({ address: account, chainId });
      }
    }
    function sync() {
      const ethereum = getMetaMaskProvider();
      if (!ethereum) return () => {};
      checkConnectedAccount(ethereum);
      const cb = () => checkConnectedAccount(ethereum);

      checkConnectedAccount(ethereum);
      ethereum.on("accountsChanged", cb);
      ethereum.on("chainChanged", cb);

      return () => {
        ethereum.off("accountsChanged", cb);
        ethereum.off("chainChanged", cb);
      };
    }
    const cleanup = sync();
    return cleanup;
  }, []);
}
