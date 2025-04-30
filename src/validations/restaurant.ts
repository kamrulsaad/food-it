import { WEEKDAYS } from "@/constants/weekdays";
import { z } from "zod";

export const CreateRestaurantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  cityId: z.string().min(1),
  state: z.string(),
  zipCode: z.string(),
  logo: z.string().url(),
  coverPhoto: z.string().url(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  workingDays: z.array(z.enum(WEEKDAYS)),
  deliveryTime: z.string().optional(),
  deliveryFee: z.coerce.number().min(0),
  ownerId: z.string().min(1),
});

export const UpdateRestaurantSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zipCode: z
    .string()
    .min(4, { message: "Zip Code must be at least 4 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  logo: z.string().optional(),
});

export type UpdateRestaurantType = z.infer<typeof UpdateRestaurantSchema>;

export default CreateRestaurantSchema;
export type CreateRestaurantType = z.infer<typeof CreateRestaurantSchema>;
