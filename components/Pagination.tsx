'use client'

import React from 'react'
import { Button } from './ui/button';

interface PaginationProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({currentPage, totalPage, onPageChange}: PaginationProps) {
  return (
    <>
        <div className='flex justify-center space-x-2 mt-4'>
            <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            >
                previous
            </Button>
            <span className='flex items-center'>
                Page {currentPage} of {totalPage}
            </span>
            <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPage}
            >
                Next
            </Button>
        </div>
    </>
  )
}
