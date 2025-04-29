import { z } from "zod";

export const CreateMenuItemSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Enter a valid price." }),
  imageUrl: z.string().url().optional(),
});

export type CreateMenuItemType = z.infer<typeof CreateMenuItemSchema>;
