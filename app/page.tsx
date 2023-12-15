import { shortHex } from "./utils";
import { retrieveConnectedWalletFromCookie } from "./utils.server";

export default async function Home() {
  const userWallet = retrieveConnectedWalletFromCookie();

  if (!userWallet) {
    return (
      <main className="flex min-h-screen flex-col p-24">
        <h3 className="text-xl py-4">Home</h3>
        <div>
          <div>
            <strong>You are not connected.</strong>
          </div>
          <div className="pt-4">
            <div>
              - By clicking on the connect button on the top right you will:
            </div>
            <ol>
              <li>Connect your MetaMask wallet to this app</li>
              <li>
                A backend call to `POST /user-wallet` will automatically be
                triggered with the address and the chain ID of your wallet,
              </li>
              <li>
                The backend will create a cookie containing the address and the
                chain ID,
              </li>
              <li>
                Redirect to the current route and set the cookie in your
                browser.
              </li>
            </ol>
            <div>
              Every time you change your address or your network, the cookie
              will be updated using the same process.
            </div>
          </div>
          <div className="pt-4">
            <div>
              - You can browse public routes, but you can not browse routes
              restricted to connected users.
            </div>
            <div>
              Protected routes loaders will check for the wallet cookie
              existence and will redirect to the home page if it is not present.
            </div>
          </div>
          <div className="pt-4">
            - Once connected, route loaders retrieve the wallet from the cookie
            and can use it to perform the target requests.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h3 className="text-xl py-4">Home</h3>
      <div>
        <div>
          <strong>You are connected.</strong>
        </div>
        <div className="pt-4">
          <div>
            - Wallet address is {shortHex(userWallet.address)}, network is #
            {userWallet.chainId}.
          </div>
        </div>
        <div className="pt-4">
          <div>- You can browse public and protected routes.</div>
          <div>
            Loaders of protected routes and public routes with wallet
            enhancement will retrieve the wallet from the cookie and can use it
            to perform the target requests.
          </div>
        </div>
        <div className="pt-4">
          - Every time you change your address or your network, the cookie will
          be updated using the same process.
        </div>
      </div>
    </main>
  );
}
