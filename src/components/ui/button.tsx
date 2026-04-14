import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  primary:
    "bg-white text-slate-950 hover:bg-white/90 border border-white/70 shadow-[0_10px_40px_rgba(255,255,255,0.15)]",
  secondary:
    "bg-white/8 text-white hover:bg-white/12 border border-white/12 backdrop-blur-sm",
  ghost: "bg-transparent text-white/80 hover:bg-white/6 border border-transparent"
} as const;

type ButtonVariant = keyof typeof buttonVariants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-200 hover:scale-[1.02] active:scale-[0.99]",
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
