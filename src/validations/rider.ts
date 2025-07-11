import { z } from "zod";
import { VEHICLETYPES } from "@/constants/vehicle-types";

export const CreateRiderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  cityId: z.string().min(1, "City is required"), // ✅ Changed
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(4, "Zip Code is required"),
  vehicleType: z.enum(VEHICLETYPES),
});

export type CreateRiderType = z.infer<typeof CreateRiderSchema>;
