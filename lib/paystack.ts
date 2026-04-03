import { createHmac } from "crypto";

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

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex");
  return hash === signature;
}

export interface PaystackBank {
  name: string;
  code: string;
}

export async function listBanks(country = "ghana"): Promise<PaystackBank[]> {
  try {
    const res = await fetch(
      `${PAYSTACK_BASE}/bank?country=${country}&perPage=100&use_cursor=false`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((b: { name: string; code: string }) => ({
      name: b.name,
      code: b.code,
    }));
  } catch {
    return [];
  }
}

export async function resolveAccountNumber(
  accountNumber: string,
  bankCode: string,
): Promise<{ accountName: string }> {
  const res = await fetch(
    `${PAYSTACK_BASE}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
  );
  if (!res.ok) {
    throw new Error("Could not verify account");
  }
  const json = await res.json();
  return { accountName: json.data.account_name as string };
}

export async function createSubaccount(params: {
  businessName: string;
  settlementBank: string;
  accountNumber: string;
  percentageCharge?: number;
  description?: string;
}): Promise<string> {
  const res = await fetch(`${PAYSTACK_BASE}/subaccount`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      business_name: params.businessName,
      settlement_bank: params.settlementBank,
      account_number: params.accountNumber,
      percentage_charge: params.percentageCharge ?? 0,
      description: params.description,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paystack subaccount creation failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.data.subaccount_code as string;
}
