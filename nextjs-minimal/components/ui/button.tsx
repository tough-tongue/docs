/**
 * Button Component - Minimal Design System
 *
 * A unified button system with consistent contrast and hover states.
 * All variants are designed for optimal readability in both light and dark modes.
 *
 * Variants:
 * - default: Primary teal action button
 * - destructive: Red for destructive actions
 * - outline: Bordered button with clear hover feedback
 * - secondary: Muted background for secondary actions
 * - ghost: Transparent with hover background
 * - link: Text-only with underline on hover
 * - social: High-contrast bordered button for OAuth/social logins
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        // Primary action - teal with clear hover darkening
        default:
          "bg-teal-600 text-white shadow-sm hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-600 dark:active:bg-teal-700",
        // Destructive - red with clear feedback
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/30 dark:bg-red-500 dark:hover:bg-red-600",
        // Outline - high contrast border with clear hover
        outline:
          "border-2 border-border bg-transparent text-foreground shadow-sm hover:bg-accent hover:border-teal-500/50 hover:text-accent-foreground active:bg-accent/80 dark:border-border dark:hover:bg-accent dark:hover:border-teal-400/50",
        // Secondary - muted background with clear contrast
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/70 active:bg-secondary/50 dark:bg-secondary dark:hover:bg-secondary/70",
        // Ghost - transparent with visible hover
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80 dark:hover:bg-accent",
        // Link - text with underline
        link: "text-teal-600 underline-offset-4 hover:underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300",
        // Social/OAuth - high contrast for login buttons
        social:
          "border-2 border-border bg-card text-foreground shadow-sm hover:bg-muted hover:border-foreground/20 active:bg-muted/80 dark:bg-card dark:border-border dark:hover:bg-muted dark:hover:border-foreground/30",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
