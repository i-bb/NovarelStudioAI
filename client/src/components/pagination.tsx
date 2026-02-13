import React from "react";
import { Button } from "@/components/ui/button";
import { log } from "console";

const Pagination = ({
  totalPages,
  currentPage,
  onClickPrev,
  onClickNext,
  onPageClick,
}: any) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={onClickPrev}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "ghost"}
                className="min-w-[36px]"
                onClick={() => onPageClick(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={onClickNext}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default Pagination;
