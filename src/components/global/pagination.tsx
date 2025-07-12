"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const prevPage = () => currentPage > 1 && onPageChange(currentPage - 1);
  const nextPage = () =>
    currentPage < totalPages && onPageChange(currentPage + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="sm"
        variant="outline"
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
      </Button>

      <span className="text-sm">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
