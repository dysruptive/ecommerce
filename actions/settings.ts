"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  generalSettingsSchema,
  paymentSettingsSchema,
} from "@/lib/validations/settings";
import {
  resolveAccountNumber,
  createSubaccount,
} from "@/lib/paystack";

type ActionResult = { success: true } | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

export async function updateGeneralSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = generalSettingsSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
      address: formData.get("address"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        contactEmail: parsed.data.contactEmail || null,
        contactPhone: parsed.data.contactPhone || null,
        address: parsed.data.address || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateGeneralSettings error:", error);
    return { success: false, error: "Failed to update settings." };
  }
}


export async function verifyBankAccount(
  bankCode: string,
  accountNumber: string,
): Promise<{ success: true; accountName: string } | { success: false; error: string }> {
  try {
    const { resolveAccountNumber } = await import("@/lib/paystack");
    const result = await resolveAccountNumber(accountNumber, bankCode);
    return { success: true, accountName: result.accountName };
  } catch {
    return { success: false, error: "Could not verify account. Check the number and bank." };
  }
}

export async function connectPaystackAccount(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const bankName = (formData.get("bankName") as string | null) ?? "";
    const parsed = paymentSettingsSchema.safeParse({
      bankCode: formData.get("bankCode"),
      accountNumber: formData.get("accountNumber"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    if (!tenant) return { success: false, error: "Tenant not found." };

    let accountName: string;
    try {
      const resolved = await resolveAccountNumber(
        parsed.data.accountNumber,
        parsed.data.bankCode,
      );
      accountName = resolved.accountName;
    } catch {
      return {
        success: false,
        error: "Could not verify bank account. Check the account number and bank, then try again.",
      };
    }

    let subaccountCode: string;
    try {
      subaccountCode = await createSubaccount({
        businessName: tenant.name,
        settlementBank: parsed.data.bankCode,
        accountNumber: parsed.data.accountNumber,
        percentageCharge: 0,
        description: `${tenant.name} — ${accountName}`,
      });
    } catch (err) {
      console.error("createSubaccount error:", err);
      return { success: false, error: "Failed to create Paystack subaccount. Please try again." };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        paystackSubaccountCode: subaccountCode,
        paystackAccountName: accountName,
        paystackBankName: bankName || null,
        paystackAccountNumber: parsed.data.accountNumber,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("connectPaystackAccount error:", error);
    return { success: false, error: "Failed to connect Paystack account." };
  }
}

export async function updateLogoUrl(logoUrl: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl },
    });
    return { success: true };
  } catch (error) {
    console.error("updateLogoUrl error:", error);
    return { success: false, error: "Failed to update logo." };
  }
}
