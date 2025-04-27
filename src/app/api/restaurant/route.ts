import slugify from "slugify";
import bcrypt from "bcryptjs";
import CreateRestaurantSchema from "@/validations/restaurant";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateRestaurantSchema.parse(body);

    const slug = slugify(data.name, { lower: true });

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        logo: data.logo,
        ownerId: data.ownerId,
        slug,
        password: hashedPassword,
      },
    });

    // Update user's role to RESTAURANT_OWNER
    await prisma.user.update({
      where: { clerkId: data.ownerId },
      data: {
        role: "RESTATURANT_OWNER",
      },
    });

    return Response.json(restaurant);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
