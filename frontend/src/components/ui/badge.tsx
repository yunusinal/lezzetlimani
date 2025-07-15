import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20",
        success:
          "border-transparent bg-success/10 text-success hover:bg-success/20",
        destructive:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        warning:
          "border-transparent bg-accent/10 text-accent-600 hover:bg-accent/20",
        info: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        outline: "border-border text-foreground hover:bg-muted",
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
