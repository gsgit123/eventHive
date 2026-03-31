import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10 mb-4">
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5c47a] text-[#875c1b] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f8f0d7] transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {getPages().map((page, idx) => (
        <React.Fragment key={idx}>
          {page === '...' ? (
            <div className="w-10 h-10 flex items-center justify-center text-[#a09070]">
              <MoreHorizontal size={18} />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                currentPage === page 
                  ? 'bg-gradient-to-br from-[#c4922a] to-[#875c1b] text-white border-transparent scale-105' 
                  : 'bg-white border border-[#e5c47a] text-[#1a1208] hover:border-[#c4922a] hover:text-[#c4922a] hover:-translate-y-0.5'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button 
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e5c47a] text-[#875c1b] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f8f0d7] transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
