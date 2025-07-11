import { z } from "zod";

export const CreateRiderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string(),
  phone: z.string().min(8, "Phone number required"),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(4),
  state: z.string().min(2),
  vehicleType: z.string().min(2),
});

export type CreateRiderType = z.infer<typeof CreateRiderSchema>;
