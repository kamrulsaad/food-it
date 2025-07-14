"use client";

import { useState } from "react";
import PaginatedPreOrderTable from "./PaginatedPreOrderTable";
import { RestaurantPreOrder } from "@/types/preorder";

interface Props {
  dateLabel: string;
  preorders: RestaurantPreOrder[];
}

export default function DaySection({ dateLabel, preorders }: Props) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const paginated = preorders.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(preorders.length / perPage);

  console.log({ dateLabel, preorders, paginated, page, totalPages });

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{dateLabel}</h3>
      <PaginatedPreOrderTable
        preorders={paginated}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
