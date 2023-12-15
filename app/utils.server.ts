import { cookies } from "next/headers";
import { getAddress } from "viem";
import { z } from "zod";

export const ZChainId = z.string().transform((val, ctx) => {
  if (val === "" || isNaN(Number(val))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid number",
    });
    return z.NEVER;
  }
  return Number(val);
});

export const ZAddress = z
  .string()
  .length(42)
  .transform((val, ctx) => {
    try {
      const checkSumAddress = getAddress(val);
      if (checkSumAddress.toLowerCase() !== val.toLowerCase()) {
        throw new Error("Invalid address");
      }
      return checkSumAddress;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid address",
      });
      return z.NEVER;
    }
  });

export const ZUserWallet = z.object({
  address: ZAddress,
  chainId: z.number().positive(),
});

export function retrieveConnectedWalletFromCookie() {
  const cookie: { name: string; value: string } | undefined =
    cookies().get("user-wallet");
  if (!cookie || !cookie.value) return null;
  const parsingResult = ZUserWallet.safeParse(JSON.parse(cookie.value));

  if (!parsingResult.success) return null;
  return parsingResult.data;
}

export type UserWallet = z.infer<typeof ZUserWallet>;
