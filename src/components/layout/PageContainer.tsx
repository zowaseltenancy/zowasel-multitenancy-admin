import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageContainer({ children }: Props) {
  return (
    <main className="flex-1 overflow-y-auto no-scrollbar bg-background p-6 lg:p-8">
      {children}
    </main>
  );
}