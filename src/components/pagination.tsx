import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
}

export function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <div className="flex justify-end items-center mt-6">
      <span className="text-sm text-gray-600 dark:text-white mr-4 font-sans">
        {page} de {totalPages}
      </span>
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-gray-700 font-medium mr-4"
      >
        <ChevronLeft />
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-gray-700 font-medium"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
