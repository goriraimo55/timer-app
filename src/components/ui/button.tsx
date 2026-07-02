import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary-strong text-[#04121a] font-semibold shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:brightness-110",
        accent:
          "bg-gradient-to-r from-accent to-accent-2 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:brightness-110",
        outline:
          "border border-border-strong bg-surface/60 text-foreground hover:bg-surface-2 hover:border-primary/50",
        ghost: "text-muted hover:text-foreground hover:bg-surface-2",
        subtle: "bg-surface-2 text-foreground hover:bg-border-strong/40",
        danger: "bg-danger/90 text-white hover:bg-danger",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
