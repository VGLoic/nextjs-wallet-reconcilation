import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { MetaMaskAvailability } from "./metamask-availability";
import { UserWallet } from "./user-wallet";
import { retrieveConnectedWalletFromCookie } from "./utils.server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next & Wallet reconciliation",
  description: "Welcome to the example!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userWallet = retrieveConnectedWalletFromCookie();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>Next.js & Wallet reconciliation</div>
            <UserWallet wallet={userWallet} />
          </div>
          <div className="flex justify-between py-8 items-center">
            <h1 className="text-xl">Next.js & Wallet reconciliation</h1>
            <MetaMaskAvailability />
          </div>
          <div className="flex">
            <Link className="hover:underline" href="/">
              Home (public route)
            </Link>
            <Link className="pl-8 hover:underline" href="/usdc">
              USDC overview (public route with wallet enhancement)
            </Link>
            <Link className="pl-8 hover:underline" href="/balance">
              My Ether balance (protected route)
            </Link>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
