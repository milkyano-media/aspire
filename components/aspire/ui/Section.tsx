import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "dark-blue"
    | "medium-blue"
    | "light-blue"
    | "white"
    | "gradient-blue"
    | "gradient-blue-top"
    | "gradient-blue-right";
  containerClassName?: string;
}

export function Section({
  children,
  className,
  variant = "white",
  containerClassName,
}: SectionProps) {
  const variantClasses = {
    "dark-blue": "bg-aspire-dark-blue text-white",
    "medium-blue": "bg-aspire-medium-blue text-white",
    "light-blue": "bg-aspire-light-blue text-aspire-text-dark",
    white: "bg-white text-aspire-text-dark",
    "gradient-blue":
      "bg-gradient-to-b from-aspire-medium-blue to-aspire-dark-blue text-white",
    "gradient-blue-top":
      "bg-gradient-to-t from-aspire-medium-blue to-aspire-dark-blue text-white",
    "gradient-blue-right":
      "bg-linear-90 from-[#0048B7] from-0% to-[#002051] to-100%",
  };

  return (
    <section className={cn("w-full", variantClasses[variant], className)}>
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
