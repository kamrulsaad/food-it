// types/preorder.ts

import { MealSlot, PreOrderStatus } from "../../prisma/generated/prisma";

export type EnrichedItem = {
  name: string;
  price: number;
  quantity: number;
};

export type CustomerInfo = {
  email: string | null;
  address: string | null;
};

export type RestaurantPreOrder = {
  id: string;
  scheduledDate: string;
  mealSlot: MealSlot;
  status: PreOrderStatus;
  customer: CustomerInfo;
  items: EnrichedItem[];
};
