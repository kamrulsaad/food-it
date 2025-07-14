import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPreOrderReminderEmail(
  to: string,
  items: string[],
  time: string
) {
  const res = await resend.emails.send({
    from: "noreply@food-it.xyz",
    to,
    subject: "Your Pre-order is scheduled soon!",
    html: `
      <p>Hello,</p>
      <p>Your pre-order is scheduled for <strong>${time}</strong>.</p>
      <p><strong>Items:</strong></p>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p>If you want to cancel, please visit your pre-orders page:</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/my-orders/preorder">Manage Pre-Orders</a>
      <p>Thanks for ordering with us!</p>
    `,
  });

  console.log("Email sent:", res);
}
