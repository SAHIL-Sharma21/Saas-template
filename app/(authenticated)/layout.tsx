'use client'

import React from 'react'
import {Navbar} from '@/components/Navbar';


export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

