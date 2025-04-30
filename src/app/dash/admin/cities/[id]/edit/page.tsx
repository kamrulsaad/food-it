import CreateCityForm from "@/components/forms/CityForm";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function CitiesPage({ params }: Props) {
  const { id } = await params;

  const city = await prisma.city.findUnique({
    where: { id },
  });

  if (!city) {
    return <div>City not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit City</h1>
      <CreateCityForm city={city} />
    </div>
  );
}
