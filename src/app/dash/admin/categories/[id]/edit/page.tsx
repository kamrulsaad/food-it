import CategoryForm from "@/components/forms/CategoryForm";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoriesEditPage({ params }: Props) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
