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

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Category Details</h1>
        <Button className="bg-primary text-white hover:bg-orange-600">
          <Link href={"/dash/admin/categories/" + id + "/edit"}>Edit Details</Link>
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="mt-4">
          <p className="text-lg font-semibold">Name: {category?.name}</p>
          <p className="text-lg font-semibold">
            Available: {category?.available ? "Yes" : "No"}
          </p>
          <p className="text-lg font-semibold">
            Created At:{" "}
            {new Date(category.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={200}
          height={200}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default page;
