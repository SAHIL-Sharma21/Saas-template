"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CreditCard, LogOut } from "lucide-react";

export function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold">Todo Master</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage src={user.imageUrl} alt="User Avatar">
                          <AvatarFallback>
                            {user.firstName?.charAt(0) || "U"}
                          </AvatarFallback>
                          ?
                        </AvatarImage>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/subscribe" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Subscribe</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="mr-2">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
