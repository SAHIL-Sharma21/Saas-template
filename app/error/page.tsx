// error page
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <div className="container mx-auto p-4 max-w-3xl min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
              OOPs! Somthing went wrong!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              We encountered an unexpected error. Don&apos;t worry, we&apos;re
              working on it.
            </p>
            <p className="text-muted-foreground mb-6">
              You&apos;ll be redirected to the home page in 5 seconds, or you
              can click the button below.
            </p>
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/")}
            >
              Go to Home page
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
