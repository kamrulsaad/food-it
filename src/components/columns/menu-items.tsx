"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MenuItem } from "../../../prisma/generated/prisma";
import DeleteMenu from "./components/deletemenu";

export const menuColumns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const url = row.original.imageUrl;
      return (
        <div className="relative w-16 h-16">
          {url ? (
            <Image
              src={url}
              alt="Item"
              fill
              className="object-contain rounded-md"
            />
          ) : (
            <div className="bg-gray-200 rounded-md w-full h-full" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price (৳)",
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-orange-600">
        ৳ {Number(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: "available",
    header: "Status",
    cell: ({ row }) => {
      const available = row.original.available;
      return (
        <div
          className={`text-sm font-semibold ${
            available ? "text-green-600" : "text-red-600"
          }`}
        >
          {available ? "Available" : "Disabled"}
        </div>
      );
    },
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
                href={`/dash/owner/menu/${item.id}`}
                className="cursor-pointer"
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dash/owner/menu/${item.id}/edit`}
                className="cursor-pointer"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DeleteMenu item={item} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
