"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SmoothScrollLink({
  href,
  children,
  className,
  onClick,
}: SmoothScrollLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Check if this is a hash link
    if (href.includes("#")) {
      const [path, hash] = href.split("#");

      // If we're on the same page (or navigating to home with hash)
      if (path === "" || path === "/" || pathname === path || pathname === "/") {
        e.preventDefault();

        // Execute any provided onClick handler
        if (onClick) {
          onClick();
        }

        // If we're not on the home page, navigate there first
        if (pathname !== "/" && path === "/") {
          router.push("/");
          // Wait for navigation then scroll
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        } else {
          // Already on the right page, just scroll
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else {
        // Navigate to different page with hash
        if (onClick) {
          onClick();
        }
        router.push(href);
      }
    } else {
      // Regular link, execute onClick if provided
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Link
      href={href}
      className={`cursor-pointer ${className || ''}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
