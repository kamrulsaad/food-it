import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const page = async (props: Props) => {
  const { id } = await props.params;

  const city = await prisma.city.findUnique({
    where: { id },
  });

  if (!city) {
    return <div>City not found</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">City Details</h1>
        <Button className="bg-primary text-white hover:bg-orange-600">
          <Link href={"/dash/admin/cities/" + id + "/edit"}>Edit Details</Link>
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="mt-4">
          <p className="text-lg font-semibold">Name: {city?.name}</p>
          <p className="text-lg font-semibold">
            Available: {city?.available ? "Yes" : "No"}
          </p>
          <p className="text-lg font-semibold">
            Created At: {new Date(city.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <Image
          src={city.imageUrl}
          alt={city.name}
          width={200}
          height={200}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default page;
