"use client";

import * as React from "react";
import NextImage from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-body-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-red-500)] text-[var(--color-white)] hover:bg-[var(--color-red-500)]/80",
        white:
          "bg-[var(--color-white)] text-[var(--color-black)] hover:bg-[var(--color-white)]/80",
      },
      size: {
        default: "h-12 py-3 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconSrc?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconSrc, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {iconSrc && (
          <NextImage
            src={iconSrc}
            alt="Ícone do botão"
            width={18}
            height={18}
            className="mr-3"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
