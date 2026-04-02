const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
const PAYSTACK_BASE = "https://api.paystack.co";

interface InitializeTransactionParams {
  email: string;
  amount: number; // in pesewas (GHS * 100)
  callbackUrl: string;
  subaccountCode?: string | null;
  metadata: Record<string, string>;
}

interface InitializeTransactionResponse {
  status: boolean;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(
  params: InitializeTransactionParams,
): Promise<InitializeTransactionResponse> {
  const body: Record<string, unknown> = {
    email: params.email,
    amount: params.amount,
    callback_url: params.callbackUrl,
    metadata: params.metadata,
  };

  if (params.subaccountCode) {
    body.subaccount = params.subaccountCode;
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paystack initialize failed: ${res.status} ${text}`);
  }

  return res.json();
}

interface VerifyTransactionResponse {
  status: boolean;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata: Record<string, string>;
  };
}

export async function verifyTransaction(
  reference: string,
): Promise<VerifyTransactionResponse> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paystack verify failed: ${res.status} ${text}`);
  }

  return res.json();
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
): boolean {
  // Use Web Crypto API (works in both Node and Edge)
  const crypto = globalThis.crypto ?? require("crypto");

  if ("createHmac" in crypto) {
    // Node.js crypto
    const hash = (crypto as typeof import("crypto"))
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");
    return hash === signature;
  }

  // Fallback: can't do sync HMAC in Web Crypto, caller should handle
  return false;
}
