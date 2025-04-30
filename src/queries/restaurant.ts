import prisma from "@/lib/prisma";

export const getApprovedRestaurants = async () => {
  return await prisma.restaurant.findMany({
    where: {
      approved: true,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      address: true,
      phone: true,
      deliveryFee: true,
      deliveryTime: true,
      openingTime: true,
      closingTime: true,
      cityRef: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
