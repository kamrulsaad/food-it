// src/app/api/webhooks/preorder-reminder/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("key");

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const upcomingPreOrders = await prisma.preOrder.findMany({
    where: {
      status: "CONFIRMED",
      scheduledDate: {
        gte: now,
        lte: oneHourLater,
      },
    },
    include: {
      PreOrderItem: {
        include: {
          menuItem: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  for (const preOrder of upcomingPreOrders) {
    if (!preOrder.user?.email) continue;

    const itemsList = preOrder.PreOrderItem.map(
      (item) => `${item.menuItem.name} × ${item.quantity}`
    );
    const formattedDate = preOrder.scheduledDate.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Pre-Order Reminder</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            color: #111827;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #fff;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          }
          .logo {
            text-align: center;
            margin-bottom: 24px;
          }
          .logo img {
            max-height: 48px;
          }
          .heading {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .section {
            margin-bottom: 16px;
          }
          .highlight {
            font-weight: 600;
            color: #2563eb;
          }
          .item-list {
            padding-left: 18px;
            margin-top: 8px;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            text-align: center;
          }
          .button {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 20px;
            background-color: #22c55e;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://food-it.xyz/logo.png" alt="Food It Logo" />
          </div>

          <div class="heading">⏰ Your Pre-Order Is Almost Ready!</div>

          <div class="section">
            This is a reminder that your pre-order is scheduled for:
            <br />
            <span class="highlight">${formattedDate}</span>
          </div>

          <div class="section">
            <strong>Items to be delivered:</strong>
            <ul class="item-list">
              ${itemsList.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            Please ensure you're available to receive your delivery on time.
            Thank you for ordering with <strong>Food It</strong>!
          </div>

          <div class="section" style="text-align:center;">
            <a href="https://food-it.xyz/my-orders" class="button">
              View My Orders
            </a>
          </div>

          <div class="footer">
            If you have any questions, contact us at
            <a href="mailto:support@food-it.xyz">support@food-it.xyz</a>.
            <br />
            &copy; ${new Date().getFullYear()} Food It. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: preOrder.user.email,
      subject: "⏰ Reminder: Your Pre-Order Is Scheduled Soon",
      html,
    });
  }

  return NextResponse.json({
    notified: upcomingPreOrders.length,
  });
}
