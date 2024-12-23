// src/components/sections/home/hero.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/common/social-links";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      {/* Content container */}
      <div className="container relative z-30 px-4">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Greeting */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-aurora-primary"
          >
            Hello, I&apos;m
          </motion.h2>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold md:text-6xl">
              <span className="animate-gradient-flow bg-gradient-to-r from-aurora-primary via-aurora-secondary to-aurora-accent bg-clip-text text-transparent">
                Nadav Spitzer
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-2xl text-xl text-muted-foreground md:text-2xl"
          >
            Full Stack Developer specializing in building exceptional digital experiences with
            React, Next.js, and TypeScript.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-aurora-primary hover:bg-aurora-primary/90">
                <Link href="/portfolio">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-aurora-surface-100 border-aurora-border"
                asChild
              >
                <Link href="/contact">Contact Me</Link>
              </Button>
            </motion.div>
          </motion.div>

          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
