"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Category } from "../../../../prisma/generated/prisma";
import DeleteCategory from "./deletecategory";
import ChangeCategoryStatus from "./changestatus";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => (
      <span
        className={row.original.available ? "text-green-600" : "text-red-600"}
      >
        {row.original.available ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-GB"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 ml-auto flex items-center justify-center rounded-md border bg-background hover:bg-accent cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/dash/admin/categories/${item.id}`}
                className="cursor-pointer"
              >
                View
              </Link>
            </DropdownMenuItem>
            <ChangeCategoryStatus item={item} />
            <DropdownMenuItem asChild>
              <Link
                href={`/dash/admin/categories/${item.id}/edit`}
                className="cursor-pointer"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DeleteCategory item={item} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
