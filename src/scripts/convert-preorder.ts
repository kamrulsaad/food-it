import prisma from "@/lib/prisma";

async function convertPreOrdersToOrders() {
  const now = new Date();

  const preOrders = await prisma.preOrder.findMany({
    where: {
      scheduledDate: { lte: now },
      status: "PENDING",
    },
    include: {
      PreOrderItem: true,
    },
  });

  if (preOrders.length === 0) {
    console.log("✅ No pre-orders to convert.");
    return;
  }

  console.log(`🔁 Converting ${preOrders.length} pre-orders to orders...`);

  for (const preorder of preOrders) {
    const order = await prisma.order.create({
      data: {
        userId: preorder.userId,
        restaurantId: preorder.restaurantId,
        address: "", // Update this if needed
        status: "PLACED",
        isScheduled: true,
        scheduledAt: preorder.scheduledDate,
        OrderItem: {
          create: preorder.PreOrderItem.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    await prisma.preOrder.update({
      where: { id: preorder.id },
      data: {
        status: "CONVERTED_TO_ORDER",
      },
    });

    console.log(`✅ Pre-order ${preorder.id} converted to Order ${order.id}`);
  }
}

convertPreOrdersToOrders()
  .then(() => {
    console.log("🎉 Done converting pre-orders.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error during conversion:", err);
    process.exit(1);
  });
