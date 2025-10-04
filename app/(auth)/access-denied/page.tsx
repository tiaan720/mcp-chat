"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function AccessDeniedPage() {
  const { user } = useUser();
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleRequestAccess = async () => {
    setIsRequesting(true);
    try {
      const response = await fetch('/api/request-access', {
        method: 'POST',
      });

      if (response.ok) {
        setHasRequested(true);
        toast.success("Access request sent! An administrator will review your request.");
      } else {
        toast.error("Failed to send access request. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting access:", error);
      toast.error("Failed to send access request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="max-w-md w-full p-8 bg-card rounded-lg border border-border shadow-lg">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Access Not Approved
          </h1>
          <p className="text-muted-foreground">
            Your account has been created, but you don't have permission to access this application yet.
          </p>
        </div>

        {user && (
          <div className="bg-muted/50 rounded-md p-4 text-sm">
            <p className="text-muted-foreground mb-1">Signed in as:</p>
            <p className="font-medium text-foreground">
              {user.primaryEmailAddress?.emailAddress || user.username}
            </p>
          </div>
        )}

        <div className="bg-muted/50 rounded-md p-4 text-sm text-muted-foreground">
          <p>
            {hasRequested
              ? "Your access request has been sent. You'll receive access once an administrator approves your account."
              : "Click the button below to request access from an administrator."}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {!hasRequested && (
            <Button 
              variant="default" 
              className="w-full"
              onClick={handleRequestAccess}
              disabled={isRequesting}
            >
              {isRequesting ? "Sending Request..." : "Request Access"}
            </Button>
          )}
          
          <SignOutButton>
            <Button variant="outline" className="w-full">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
