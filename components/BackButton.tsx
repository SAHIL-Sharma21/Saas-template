'use client'

import { useRouter } from 'next/router'
import React from 'react'
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
    const router = useRouter();
  return (
    <Button
    variant="outline"
    onClick={() => router.back()}
    className='mb-4'
    >
        <ChevronLeft className='mr-2 h-4 w-4' />
        Back
    </Button>
  );
}