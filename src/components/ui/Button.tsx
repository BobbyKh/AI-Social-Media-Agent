import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base = "inline-flex items-center justify-center font-medium rounded-md transition";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border border-transparent",
  secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border",
  ghost: "hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export default function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}


