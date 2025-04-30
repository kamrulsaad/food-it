import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  imageUrl: z.string().url(),
});

export type CategoryTypes = z.infer<typeof CategorySchema>;
