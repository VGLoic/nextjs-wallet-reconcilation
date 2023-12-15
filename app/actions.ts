"use server";

import { z } from "zod";
import { ZAddress, ZChainId } from "./utils.server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const ZUserWalletPayload = z.object({
  address: ZAddress,
  chainId: ZChainId,
});

export async function syncWalletCookie(
  payload: { address: `0x${string}`; chainId: string } | null,
) {
  const parsingResult = ZUserWalletPayload.safeParse(payload);
  if (!parsingResult.success) {
    cookies().delete("user-wallet");
  } else {
    cookies().set("user-wallet", JSON.stringify(parsingResult.data));
  }
  revalidatePath("/", "layout");
}
