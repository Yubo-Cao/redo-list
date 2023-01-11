import { cls } from "../lib/utils";

import Image from "next/image";
import Link from "next/link";
import icon from "../public/icon.svg";

type LogoProps = {
    className?: string;
    style?: React.CSSProperties;
};

export default function Logo({ className = "" }: LogoProps) {
    return (
        <Link
            href="/"
            className={cls(
                "flex",
                "items-center",
                "gap-2",
                // chip
                "rounded-full",
                "transition-all",
                "bg-uim-100 dark:bg-uim-800",
                "hover:bg-uim-200 dark:hover:bg-uim-700",
                "p-2",
                className
            )}
        >
            <Image
                src={icon}
                className={cls(
                    "text-transparent",
                    "bg-clip-text",
                    "bg-gradient-to-tr from-pri-500 to-pri-500",
                    "dark:bg-gradient-to-tr dark:from-pri-100 dark:to-pri-100"
                )}
                width={36}
                height={36}
                alt="Logo"
            />
            <span
                className={cls(
                    className,
                    "text-base",
                    "font-mono",
                    "max-2xs:hidden",
                    "mr-1",
                    "dark:text-dark-text",
                    "min-w-fit"
                )}
            >
                GRADE TODO
            </span>
        </Link>
    );
}

export { Logo };
export type { LogoProps };
