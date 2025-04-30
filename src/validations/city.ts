import { z } from "zod";

export const CreateCitySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  imageUrl: z.string().url(),
});

export type CreateCityTyes = z.infer<typeof CreateCitySchema>;
