"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </main>
  );
}
