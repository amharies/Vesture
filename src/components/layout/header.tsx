import { ThemeToggle } from "../theme-toggle";
import CurrentDateTime from "./current-date-time";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1">
          <h1 className="text-lg font-bold font-headline text-primary">Vesture</h1>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <CurrentDateTime />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
