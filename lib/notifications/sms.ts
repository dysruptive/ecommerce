export async function sendSMS(
  to: string,
  message: string,
  apiKey: string,
  senderName: string,
) {
  // Arkesel sender max 11 chars
  const sender = senderName.slice(0, 11);

  try {
    const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender,
        recipients: [to],
        message,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Arkesel SMS error:", result);
    }
    return result;
  } catch (error) {
    console.error("sendSMS error:", error);
  }
}

export function orderConfirmedSMS(params: {
  customerName: string;
  orderNumber: string;
  total: number;
  storeName: string;
}): string {
  return `Hi ${params.customerName}, your order #${params.orderNumber} has been confirmed. Total: GHS ${params.total.toFixed(2)}. Thank you for shopping with ${params.storeName}!`;
}

export function orderShippedSMS(params: {
  orderNumber: string;
  storeName: string;
}): string {
  return `Your order #${params.orderNumber} from ${params.storeName} has been shipped.`;
}

export function newOrderSMS(params: {
  orderNumber: string;
  total: number;
  customerName: string;
}): string {
  return `New order #${params.orderNumber} — GHS ${params.total.toFixed(2)} from ${params.customerName}.`;
}
