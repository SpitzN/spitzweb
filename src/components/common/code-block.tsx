"use client";

import React from "react";
import { Highlight, themes, Language } from "prism-react-renderer";
import { cn } from "@/lib/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeBlockProps {
  codeBlock: string;
  title?: string;
  language?: Language;
  className?: string;
}

export function CodeBlock({ codeBlock, title, language = "tsx", className }: CodeBlockProps) {
  return (
    <Card className={cn("w-full max-w-4xl overflow-hidden", className)}>
      {title && (
        <CardHeader className="bg-muted py-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Highlight theme={themes.nightOwl} code={codeBlock} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={cn(className, "overflow-x-auto p-4")} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-sm opacity-50">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </CardContent>
    </Card>
  );
}
