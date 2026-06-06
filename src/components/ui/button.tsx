import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
    default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
    outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90",
    secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
};

const sizeClasses: Record<ButtonSize, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-6",
    icon: "size-9",
};

export function buttonVariants({
    variant = "default",
    size = "default",
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
} = {}) {
    return cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
    );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
    ),
);

Button.displayName = "Button";

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
    return <Link className={buttonVariants({ variant, size, className })} {...props} />;
}
