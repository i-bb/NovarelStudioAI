import { TopNav } from "./TopNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30">
      <TopNav />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
