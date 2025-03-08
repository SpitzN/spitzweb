import { Button } from "@/components/ui/button";
import { FaLinkedin, FaGithub } from "react-icons/fa";

import Link from "next/link";
import { GithubProfileUrl, GithubRepoUrl, LinkedInUrl } from "@/constants";

export function Footer() {
  return (
    <footer className="z-50 border-t bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose">
            Built by{" "}
            <Link
              href={GithubProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer font-medium underline underline-offset-4"
            >
              SpitzN
            </Link>
            . The source code is available on{" "}
            <Link
              href={GithubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={GithubProfileUrl} target="_blank" rel="noreferrer">
              <FaGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={LinkedInUrl} target="_blank" rel="noreferrer">
              <FaLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
