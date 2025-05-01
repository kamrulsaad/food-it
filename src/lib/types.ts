export type RestaurantPreview = {
  id: string;
  name: string;
  logo: string;
  coverPhoto: string;
  deliveryTime: string;
  deliveryFee: number;
  categories: string[];
  minPrice: number;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type Cart = {
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
  items: CartItem[];
};
