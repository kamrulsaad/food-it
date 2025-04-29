import { authMiddleware } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authenticateUser = async () => {
  const user = await authMiddleware();

  if (!user?.id) throw new UploadThingError("Unauthorized");

  return { userId: user.id, email: user.email };
};

export const ourFileRouter = {
  menuItem: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  restaurantLogo: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
