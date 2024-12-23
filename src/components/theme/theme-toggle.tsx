"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/utils";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <div className="group relative">
          {/* Background glow effect */}
          <div className="from-aurora-rose/0 to-aurora-sky/0 absolute left-0 top-0 h-full w-full rounded-lg bg-gradient-to-r via-aurora-primary/50 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
          <div
            role="button"
            className={cn(
              "relative flex items-center justify-center",
              "h-10 w-10 rounded-lg",
              "focus-visible:outline-none",
              "cursor-pointer",
              "transition-all duration-500"
            )}
            aria-label="Toggle theme"
            tabIndex={0}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-aurora-primary transition-all dark:-rotate-90 dark:scale-0 dark:text-aurora-secondary" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-aurora-primary transition-all dark:rotate-0 dark:scale-100 dark:text-aurora-secondary" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
