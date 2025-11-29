"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageButtons = () => {
    const pages: (number | "...")[] = [];
    const maxButtons = 5;

    if (totalPages <= 1) return null;

    const addPage = (page: number) => {
      if (page > 0 && page <= totalPages && !pages.includes(page)) {
        pages.push(page);
      }
    };

    addPage(1);

    if (totalPages > 1) {
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= Math.ceil(maxButtons / 2)) {
        end = Math.min(totalPages - 1, maxButtons - 1);
      } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
        start = Math.max(2, totalPages - (maxButtons - 2));
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        addPage(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        addPage(totalPages);
      }
    }

    let lastValue: number | string | undefined = undefined;
    const finalPages = pages.filter((page) => {
      if (page === "..." && lastValue === "...") return false;
      lastValue = page;
      return true;
    });

    return finalPages.map((page, index) => {
      if (page === "...") {
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const isCurrent = page === currentPage;

      return (
        <PaginationItem key={index}>
          <PaginationLink
            href="#"
            isActive={isCurrent}
            onClick={() => onPageChange(page as number)}
            className={
              isCurrent
                ? "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200"
                : ""
            }
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          >
            Anterior
          </PaginationPrevious>
        </PaginationItem>

        {renderPageButtons()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          >
            Próximo
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
