import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  storeName: string;
  storeEmail?: string | null;
}

function baseLayout(storeName: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${storeName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#18181b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7;">
        <!-- Header -->
        <tr><td style="background:#18181b;padding:24px 32px;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${storeName}</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #e4e4e7;background:#fafafa;">
          <p style="margin:0;font-size:12px;color:#71717a;">
            This email was sent by ${storeName}. If you have questions, reply to this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function orderItemsTable(
  items: { name: string; quantity: number; price: number }[],
): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#3f3f46;">${item.name}</td>
        <td style="padding:8px 0;font-size:14px;color:#71717a;text-align:center;">×${item.quantity}</td>
        <td style="padding:8px 0;font-size:14px;text-align:right;">GHS ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`,
    )
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="border-bottom:2px solid #e4e4e7;">
          <th style="padding:8px 0;font-size:12px;font-weight:600;color:#71717a;text-align:left;text-transform:uppercase;letter-spacing:.05em;">Item</th>
          <th style="padding:8px 0;font-size:12px;font-weight:600;color:#71717a;text-align:center;text-transform:uppercase;letter-spacing:.05em;">Qty</th>
          <th style="padding:8px 0;font-size:12px;font-weight:600;color:#71717a;text-align:right;text-transform:uppercase;letter-spacing:.05em;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="border-top:1px solid #e4e4e7;">
          <td colspan="2" style="padding:8px 0;font-size:13px;color:#71717a;">Subtotal</td>
          <td style="padding:8px 0;font-size:13px;text-align:right;">GHS ${items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function totalSection(data: OrderEmailData): string {
  const discountRow =
    data.discountAmount > 0
      ? `<tr><td style="padding:4px 0;font-size:13px;color:#71717a;">Discount</td><td style="padding:4px 0;font-size:13px;text-align:right;color:#16a34a;">-GHS ${data.discountAmount.toFixed(2)}</td></tr>`
      : "";
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr><td style="padding:4px 0;font-size:13px;color:#71717a;">Delivery</td><td style="padding:4px 0;font-size:13px;text-align:right;">GHS ${data.deliveryFee.toFixed(2)}</td></tr>
      ${discountRow}
      <tr style="border-top:2px solid #18181b;">
        <td style="padding:12px 0 4px;font-size:16px;font-weight:700;">Total</td>
        <td style="padding:12px 0 4px;font-size:16px;font-weight:700;text-align:right;">GHS ${data.total.toFixed(2)}</td>
      </tr>
    </table>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;">Order Confirmed! 🎉</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#71717a;">Hi ${data.customerName}, your order has been received and is being processed.</p>

    <div style="background:#f4f4f5;border-radius:6px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Order Number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;letter-spacing:.1em;">#${data.orderNumber}</p>
    </div>

    <h2 style="margin:0 0 4px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#71717a;">Your Items</h2>
    ${orderItemsTable(data.items)}
    ${totalSection(data)}

    <p style="margin:24px 0 0;font-size:14px;color:#71717a;">
      Thank you for shopping with <strong>${data.storeName}</strong>! We&apos;ll notify you when your order status changes.
    </p>`;

  await resend.emails.send({
    from: `${data.storeName} <noreply@resend.dev>`,
    to: data.customerEmail,
    subject: `Order Confirmed — #${data.orderNumber}`,
    html: baseLayout(data.storeName, content),
  });
}

export async function sendNewOrderEmailToOwner(
  data: OrderEmailData & { ownerEmail: string },
) {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;">New Order Received</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#71717a;">You have a new order from your store.</p>

    <div style="display:grid;gap:8px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;width:130px;">Order</td>
          <td style="padding:6px 0;font-size:13px;font-weight:600;">#${data.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;">Customer</td>
          <td style="padding:6px 0;font-size:13px;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;">Email</td>
          <td style="padding:6px 0;font-size:13px;">${data.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;">Items</td>
          <td style="padding:6px 0;font-size:13px;">${data.items.length} item${data.items.length !== 1 ? "s" : ""}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#71717a;">Total</td>
          <td style="padding:6px 0;font-size:16px;font-weight:700;">GHS ${data.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${orderItemsTable(data.items)}

    <p style="margin:24px 0 0;font-size:14px;color:#71717a;">
      Log in to your dashboard to view and manage this order.
    </p>`;

  await resend.emails.send({
    from: `${data.storeName} Orders <noreply@resend.dev>`,
    to: data.ownerEmail,
    subject: `New Order #${data.orderNumber} — GHS ${data.total.toFixed(2)}`,
    html: baseLayout(data.storeName, content),
  });
}

export async function sendOrderStatusEmail(params: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  newStatus: string;
  storeName: string;
}) {
  const statusLabels: Record<string, string> = {
    CONFIRMED: "Confirmed",
    PROCESSING: "Being Processed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  const label = statusLabels[params.newStatus] ?? params.newStatus;

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;">Order Update</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#71717a;">Hi ${params.customerName}, here&apos;s an update on your order.</p>

    <div style="background:#f4f4f5;border-radius:6px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">Order #${params.orderNumber}</p>
      <p style="margin:8px 0 0;font-size:18px;font-weight:700;">${label}</p>
    </div>

    <p style="margin:0;font-size:14px;color:#71717a;">
      Thank you for shopping with <strong>${params.storeName}</strong>.
    </p>`;

  await resend.emails.send({
    from: `${params.storeName} <noreply@resend.dev>`,
    to: params.customerEmail,
    subject: `Order #${params.orderNumber} — ${label}`,
    html: baseLayout(params.storeName, content),
  });
}
