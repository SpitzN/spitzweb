import React from "react";
import { type LucideIcon, Circle } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

interface ListItem {
  text: string;
  subtitle: string;
  icon?: LucideIcon;
}

type Layout = "stack" | "row" | "grid";

const listVariants = cva("w-full mx-auto", {
  variants: {
    size: {
      xs: "max-w-xs text-xs",
      sm: "max-w-sm text-sm",
      md: "max-w-md text-base",
      lg: "max-w-lg text-lg",
      xl: "max-w-xl text-xl",
      full: "max-w-full",
    },
    variant: {
      simple: "border-none",
      bordered: "border border-muted rounded-lg p-4",
      elevated: "shadow-md rounded-lg p-4",
    },
    layout: {
      stack: "flex flex-col space-y-4",
      row: "flex flex-row flex-wrap gap-4",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    },
  },
  defaultVariants: {
    size: "full",
    variant: "simple",
    layout: "stack",
  },
});

interface CustomListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof listVariants>, "layout"> {
  title: string;
  items: ListItem[];
  iconSize?: number;
  layout?: Layout;
}

export function CustomList({
  title,
  items,
  size,
  variant,
  layout = "stack",
  iconSize = 18,
  className,
  ...props
}: CustomListProps) {
  return (
    <div className={cn(listVariants({ size, variant }), className)} {...props}>
      <h4 className="mb-4 text-2xl font-bold">{title}</h4>
      <ul className={listVariants({ layout })}>
        {items.map((item, index) => {
          const ItemIcon = item.icon || Circle;
          return (
            <li
              key={index}
              className={cn("flex items-start", layout !== "stack" && "min-w-[250px] flex-1")}
            >
              <span className="mr-3 mt-1">
                <ItemIcon size={iconSize} />
              </span>
              <div>
                <p className="font-medium">{item.subtitle}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
