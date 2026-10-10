import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="AngelsRadar"
        width={362}
        height={60}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}
