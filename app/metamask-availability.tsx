"use client";
import * as React from "react";
import { getMetaMaskProvider } from "./utils";

export function MetaMaskAvailability() {
  const [metamaskAvailabilityStatus, setMetamaskAvailabilityStatus] =
    React.useState<"init" | "available" | "unavailable">("init");
  React.useEffect(() => {
    setMetamaskAvailabilityStatus(
      getMetaMaskProvider() ? "available" : "unavailable",
    );
  }, []);

  if (metamaskAvailabilityStatus === "unavailable")
    return (
      <div>
        MetaMask is unavailable. You will not be able to test this demo :(
      </div>
    );

  return null;
}
