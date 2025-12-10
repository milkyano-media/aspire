"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { validateAdminKey } from "@/app/admin/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "admin_authenticated";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [state, formAction, isPending] = useActionState(validateAdminKey, {});

  // Check sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  // Handle successful validation
  useEffect(() => {
    // @ts-ignore
    if (state.success) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
    }
    // @ts-ignore
  }, [state.success]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div>
                <Input
                  name="key"
                  type="password"
                  placeholder="Enter admin key"
                  required
                  disabled={isPending}
                />
              </div>
              {state.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Authenticating..." : "Access Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
