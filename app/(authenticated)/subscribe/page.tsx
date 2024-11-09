"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {BackButton} from '@/components/BackButton';
import { useToast } from "@/hooks/use-toast";

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, SetIsSubscribed] = useState<Boolean>(false);
  const [subscriptionEnds, setSubscriptionEnds] = useState<string | null>(null);
  const router = useRouter();
  const {toast} = useToast();


  const fetchSubcriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/subscription`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      const data = await response.json();
      SetIsSubscribed(data.isSubscribed);
      setSubscriptionEnds(data.subscriptionEnds);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Subscription status fetched successfully",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching subscription status", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription status, Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchSubcriptionStatus();
  }, [fetchSubcriptionStatus]);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      const data = await response.json();
      SetIsSubscribed(true);
      setSubscriptionEnds(data.subscriptionEnds);
      router.refresh();
      setIsLoading(false);
      toast({
        title: "Success",
        description: "You have succeessfully subscribed",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error subscribing", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occured while subscribing. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-3xl">
        <BackButton />
        <h1 className="text-3xl font-bold mb-8 text-center">Subscriptions</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Subscription status</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You are a subscribed user. Subscriptions ends on{" "}
                    {new Date(subscriptionEnds!).toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You are not currently a subscribed. Subscribe now to unlock
                    all features!
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleSubscribe}
                  className="mt-4"
                  disabled={isLoading}
                >
                  Subscribe Now
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
