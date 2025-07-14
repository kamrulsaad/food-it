// /api/restaurant/preorders/[id]/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { PreOrderStatus } from "../../../../../../prisma/generated/prisma";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!["CONFIRMED", "CANCELLED_BY_RESTAURANT"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const preorder = await prisma.preOrder.findUnique({
    where: { id },
    include: {
      restaurant: true,
      user: {
        select: { email: true },
      },
    },
  });

  if (!preorder || preorder.restaurant.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (preorder.status !== "PENDING") {
    return NextResponse.json(
      { error: "Cannot update this pre-order" },
      { status: 400 }
    );
  }

  await prisma.preOrder.update({
    where: { id },
    data: {
      status: status as PreOrderStatus,
    },
  });

  // Inside your PUT API handler...
  if (status === "CANCELLED_BY_RESTAURANT" && preorder.user?.email) {
    const items = await prisma.preOrderItem.findMany({
      where: { preOrderId: preorder.id },
      include: {
        menuItem: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    const itemListHtml = items
      .slice(0, 5)
      .map(
        (item) => `
        <li>${item.quantity} × ${item.menuItem.name} — ৳${
          item.menuItem.price * item.quantity
        }</li>`
      )
      .join("");

    const scheduledTime = format(preorder.scheduledDate, "PPPp", {
      locale: bn,
    });

    const emailHtml = `
            <!DOCTYPE html>
            <html lang="bn">
            <head>
                <meta charset="UTF-8" />
                <title>প্রি-অর্ডার বাতিল</title>
                <style>
                body {
                    font-family: "Segoe UI", sans-serif;
                    background: #f9fafb;
                    color: #111827;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 24px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
                }
                .logo {
                    max-width: 120px;
                    margin-bottom: 20px;
                }
                .header {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .highlight {
                    font-weight: 600;
                    color: #b91c1c;
                }
                .section {
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                .item-list {
                    padding-left: 18px;
                }
                .footer {
                    font-size: 13px;
                    color: #6b7280;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 16px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 16px;
                    margin-top: 12px;
                    background: #ef4444;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 14px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <img src="https://food-it.xyz/logo.png" alt="Food It" class="logo" />

                <p class="header">আপনার প্রি-অর্ডার বাতিল করা হয়েছে</p>

                <div class="section">
                    প্রিয় গ্রাহক,<br /><br />
                    দুঃখিত! আপনার প্রি-অর্ডারটি, যা নির্ধারিত ছিল 
                    <span class="highlight">${scheduledTime}</span>, 
                    তা রেস্টুরেন্ট কর্তৃপক্ষের সিদ্ধান্ত অনুযায়ী বাতিল করা হয়েছে।
                </div>

                <div class="section">
                    <strong>অর্ডার সংক্ষেপ:</strong>
                    <ul class="item-list">
                    ${itemListHtml}
                    </ul>
                </div>

                <div class="section">
                    <strong>রিফান্ড তথ্য:</strong><br />
                    যদি আপনি অগ্রিম পেমেন্ট করে থাকেন, তাহলে অর্থ ফেরত আপনার উৎস অ্যাকাউন্টে 
                    <strong>সর্বোচ্চ ৫ কর্মদিবসের মধ্যে</strong> প্রদান করা হবে।
                </div>

                <div class="section">
                    আমাদের পক্ষ থেকে এই অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত। 
                    আপনি চাইলে পুনরায় অর্ডার করতে পারেন অথবা আমাদের অন্য রেস্টুরেন্ট ব্রাউজ করতে পারেন।
                </div>

                <a href="https://food-it.xyz/r" class="button">পুনরায় অর্ডার করুন</a>

                <div class="footer">
                    সহায়তার প্রয়োজনে যোগাযোগ করুন: 
                    <a href="mailto:support@foodit.com">support@foodit.com</a>
                </div>
                </div>
            </body>
            </html>
        `;

    await sendEmail({
      to: preorder.user.email,
      subject: "আপনার প্রি-অর্ডার বাতিল করা হয়েছে",
      html: emailHtml,
    });
  }

  return NextResponse.json({ success: true });
}
