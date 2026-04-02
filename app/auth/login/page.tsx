import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
