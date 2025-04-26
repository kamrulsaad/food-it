// lib/validations/restaurant.ts
import { z } from "zod";

const CreateRestaurantSchema = z.object({
  name: z.string().min(2, { message: "Restaurant name must be at least 2 characters" }),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  logo: z.string().optional(),
  ownerId: z.string().min(1),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default CreateRestaurantSchema;
export type CreateRestaurantType = z.infer<typeof CreateRestaurantSchema>;
