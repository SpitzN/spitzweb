"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GithubProfileUrl, LinkedInUrl } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
export interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

export function SocialLinks({ className }: { className?: string }) {
  const links = [
    {
      icon: FaGithub,
      href: { GithubProfileUrl },
      label: "GitHub Profile",
    },
    {
      icon: FaLinkedin,
      href: { LinkedInUrl },
      label: "LinkedIn Profile",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={cn("flex items-center gap-4", className)}
    >
      {links.map((socialLink) => (
        <motion.div key={socialLink.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-aurora-surface-100 hover:text-aurora-primary"
            asChild
          >
            <Link
              href={socialLink.href as unknown as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialLink.label}
            >
              <socialLink.icon className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
