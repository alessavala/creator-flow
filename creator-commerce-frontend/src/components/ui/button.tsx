"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] active:duration-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-chart-5 via-primary to-accent bg-[length:200%_auto] bg-left text-primary-foreground shadow-md shadow-primary/30 hover:scale-[1.04] hover:-translate-y-0.5 hover:bg-right hover:shadow-xl hover:shadow-accent/40",
        secondary:
          "bg-card text-foreground border border-border shadow-sm hover:scale-[1.03] hover:-translate-y-0.5 hover:bg-muted-surface hover:shadow-lg",
        outline:
          "border border-border bg-transparent text-foreground hover:scale-[1.03] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted-surface",
        ghost: "text-foreground hover:scale-[1.03] hover:bg-muted-surface",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md shadow-destructive/25 hover:scale-[1.04] hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/35",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm [&_svg]:size-4",
        sm: "h-9 px-4 text-xs [&_svg]:size-3.5",
        lg: "h-14 px-8 text-base [&_svg]:size-5",
        icon: "h-11 w-11 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Comp>
  );
});
