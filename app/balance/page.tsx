import * as chains from "viem/chains";
import { retrieveConnectedWalletFromCookie } from "../utils.server";
import { createPublicClient, formatEther, http } from "viem";
import { getBalance } from "viem/actions";
import { redirect } from "next/navigation";

function chainIdToChain(chainId: number) {
  return Object.values(chains).find((c) => c.id === chainId);
}

export default async function Balance() {
  const userWallet = retrieveConnectedWalletFromCookie();

  if (!userWallet) return redirect("/");

  const chain = chainIdToChain(userWallet.chainId);
  if (!chain) return redirect("/");

  const client = createPublicClient({
    transport: http(),
    chain,
  });
  const balance = await getBalance(client, { address: userWallet.address });

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h3 className="text-xl py-4">Balance on chain {chain.name}</h3>
      <p>{formatEther(balance)} (Eth)</p>
    </main>
  );
}
