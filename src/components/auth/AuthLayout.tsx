import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {children}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Platform Admin v0.1
          </div>
        </div>
      </div>
    </main>
  );
}