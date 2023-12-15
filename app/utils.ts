type WindowInstanceWithEthereum = Window &
  typeof globalThis & { ethereum?: any };

export function getMetaMaskProvider() {
  const ethereum = (window as WindowInstanceWithEthereum).ethereum;
  if (!ethereum) return null;
  // The `providers` field is populated
  // - when CoinBase Wallet extension is also installed
  // - when user is on Brave and Brave Wallet is not deactivated
  // The expected object is an array of providers, the MetaMask provider is inside
  // See https://docs.cloud.coinbase.com/wallet-sdk/docs/injected-provider-guidance for more information
  // See also https://metamask.zendesk.com/hc/en-us/articles/360038596792-Using-Metamask-wallet-in-Brave-browser
  if (Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find(
      (p: any) => p.isMetaMask && !p.isBraveWallet,
    );
    if (metaMaskProvider) return metaMaskProvider;
    const braveWalletProvider = ethereum.providers.find(
      (p: any) => p.isMetaMask && p.isBraveWallet,
    );
    if (!braveWalletProvider) return null;
    return braveWalletProvider;
  }
  if (!ethereum.isMetaMask) return null;
  return ethereum;
}

export function shortHex(v: string) {
  return v.substring(0, 6) + "..." + v.substring(v.length - 4);
}
