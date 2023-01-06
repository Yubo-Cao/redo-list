import Link from "next/link";

import { cls } from "../lib/utils";

import Icon from "./Icon";

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
            <Icon
                name="list"
                size={36}
                iconSize={24}
                wrapperClassName={cls(
                    "rounded-full",
                    "bg-gradient-to-tr from-pri-100 to-sec-200",
                    "dark:bg-gradient-to-tr dark:from-pri-500 dark:to-sec-500"
                )}
                className={cls(
                    "text-transparent",
                    "bg-clip-text",
                    "bg-gradient-to-tr from-pri-500 to-pri-500",
                    "dark:bg-gradient-to-tr dark:from-pri-100 dark:to-pri-100"
                )}
            />
            <span
                className={cls(
                    className,
                    "text-base",
                    "font-mono",
                    "max-2xs:hidden",
                    "mr-1",
                    "dark:text-dark-text"
                )}
            >
                GRADE TODO
            </span>
        </Link>
    );
}

export { Logo };
export type { LogoProps };
