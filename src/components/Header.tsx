import { cls } from "../lib/utils";

import Button, { ButtonProps } from "./Button";
import Icon from "./Icon";
import Logo from "./Logo";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type NavigationItemProps = {
    name: string;
    icon: string;
    href: string;
    className?: string;
    id?: string;
    active?: boolean;
};

type NavigationProps = {
    items: NavigationItemProps[];
    activeItemId?: string;
    className?: string;
    style?: React.CSSProperties;
};

const navigationItems: NavigationItemProps[] = [
    {
        name: "My day",
        icon: "sunny",
        href: "/",
        id: "my-day"
    },
    {
        name: "Tasks",
        icon: "check",
        href: "/tasks",
        id: "tasks"
    },
    {
        name: "Kanban",
        icon: "dashboard",
        href: "/Kanban",
        id: "Kanban"
    }
];

function NavigationItem({
    name,
    icon,
    href,
    className,
    active
}: NavigationItemProps) {
    const [hover, setHover] = useState(false);
    return (
        <Link
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            href={href}
            className={cls(
                "flex items-center gap-2",
                "h-12",
                "transition-colors",
                "rounded-full",
                "px-1.5",
                active ? "dark:text-dark-text" : "dark:text-uim-100",
                active
                    ? "bg-pri-100 dark:bg-pri-600 hover:bg-pri-200 dark:hover:bg-pri-500"
                    : "hover:bg-uim-100 dark:hover:bg-uim-800",
                "lg:rounded-l-none",
                "lg:pl-4",
                className
            )}
            id={name}
        >
            <Icon
                name={icon}
                iconSize={24}
                size={36}
                grade={hover ? 100 : -250}
                className={cls(
                    "transition-all",
                    active && "text-pri-400 dark:text-pri-100",
                    active && hover && "text-pri-500 dark:text-pri-100"
                )}
                wrapperClassName={cls("transition-all", "sm:rounded-full")}
            />
            <span
                className={cls(
                    "transition-all",
                    "sm:hidden",
                    "md:block",
                    "md:text-sm",
                    active && "text-pri-500 dark:text-pri-100",
                    active && "font-bold",
                    !active && "font-light",
                    "lg:flex-1",
                    "mr-2"
                )}
            >
                {name}
            </span>
        </Link>
    );
}

const BUTTON_STYLE: {
    variant: "outline";
    style: React.CSSProperties;
    accent: "uim";
} = {
    variant: "outline",
    style: { width: 44, height: 44 },
    accent: "uim"
};

function MenuButton({ open, ...props }: ButtonProps & { open: boolean }) {
    return (
        <Button
            {...props}
            content="icon"
            {...BUTTON_STYLE}
            className="ml-1 mt-2 mb-2 sm:hidden"
        >
            <Icon name={open ? "menu_open" : "menu"} size={24} />
        </Button>
    );
}

function DarkLightToggle() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        if (!window) return;
        setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }, []);
    return (
        <Button
            onClick={() => {
                setDark(!dark);
                const html = document?.documentElement;
                if (!html) return;
                html.classList.toggle("dark");
            }}
            content="icon"
            className="lg:ml-4"
            {...BUTTON_STYLE}
        >
            <Icon name={dark ? "dark_mode" : "light_mode"} size={24} />
        </Button>
    );
}

function Navigation({
    items,
    activeItemId,
    className,
    style
}: NavigationProps) {
    const [open, setOpen] = useState(false),
        [prevWidth, setPrevWidth] = useState(0),
        ref = useRef<HTMLDivElement>(null);
    // scroll/resize/esc close
    useEffect(() => {
        const resize = (e: Event) => {
            setOpen(false);
            const target = e.target as Window;
            // prevent animation of transition between sm and md
            if (prevWidth > 640 && (target.innerWidth || 0) <= 640) {
                const current = ref.current;
                if (!current) return; // never happens
                current.classList.remove("transition-transform");
                setTimeout(() => {
                    current.classList.add("transition-transform");
                }, 100);
            }
            setPrevWidth(target.innerWidth);
        };
        window.addEventListener("resize", resize);
        const srcollClose = () => {
            setOpen(false);
        };
        window.addEventListener("scroll", srcollClose);
        const escClose = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                srcollClose();
            }
        };
        window.addEventListener("keydown", escClose);
        return () => {
            window.removeEventListener("scroll", srcollClose);
            window.removeEventListener("keydown", escClose);
            window.removeEventListener("resize", resize);
        };
    });
    return (
        <div className={cls("z-10", "lg:w-full")}>
            <MenuButton
                open={open}
                onClick={() => {
                    setOpen(!open);
                }}
                className="sm:hidden"
            />
            <div
                className={cls(
                    "fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 transition-all backdrop-blur-lg",
                    open ? "bg-opacity-50" : "hidden",
                    "transition-opacity",
                    "sm:hidden"
                )}
                onClick={() => {
                    setOpen(false);
                }}
            />
            <nav
                className={cls(
                    // common
                    "transition-transform",
                    // sidebar
                    cls(
                        "max-sm:fixed",
                        "max-sm:top-0",
                        "max-sm:bottom-0",
                        "max-sm:left-0",
                        "max-sm:2xs:w-1/2",
                        "max-sm:rounded-r-xl",
                        "max-sm:shadow-lg",
                        "max-sm:px-2",
                        open
                            ? "max-sm:translate-x-0"
                            : "max-sm:-translate-x-fuller",
                        "max-sm:bg-uim-50 max-sm:dark:bg-uim-900"
                    ),
                    // header
                    cls("sm:flex", "sm:items-center"),
                    // persistent sidebar
                    cls("lg:h-auto", "lg:w-auto", "lg:-z-10", "lg:px-0"),
                    className
                )}
                style={style}
                ref={ref}
            >
                <MenuButton
                    open={open}
                    onClick={() => {
                        setOpen(!open);
                    }}
                    className={cls("my-2", "sm:hidden")}
                />
                <div
                    className={cls(
                        "sm:flex",
                        "sm:flex-row",
                        "sm:gap-2",
                        // persistent sidebar
                        "lg:flex-col",
                        "lg:justify-start",
                        "lg:gap-0",
                        "lg:w-full"
                    )}
                >
                    {items.map((item) => (
                        <NavigationItem
                            {...item}
                            active={item.id === activeItemId}
                            key={item.id}
                        />
                    ))}
                </div>
            </nav>
        </div>
    );
}

export default function Header({
    activeItemId,
    style,
    className,
    refHeader
}: {
    activeItemId: string;
    style?: React.CSSProperties;
    className?: string;
    refHeader?: React.RefObject<HTMLDivElement>;
}) {
    return (
        <header
            className={cls(
                // common
                cls(
                    "flex items-center gap-2",
                    "bg-light-surface dark:bg-dark-surface",
                    "shadow-lg",
                    "py-8 px-4"
                ),
                // sidebar
                cls("justify-end"),
                // header
                cls("flex-row", "sm:justify-between"),
                // persistent sidebar
                cls("lg:flex-col", "lg:h-auto", "lg:items-start", "lg:pl-0"),
                className
            )}
            style={style}
            ref={refHeader}
        >
            <div
                className={cls(
                    "flex",
                    "flex-1",
                    "items-center",
                    "gap-2",
                    // sidebar
                    "max-sm:flex-row-reverse",
                    "max-sm:justify-end",
                    // persistant sidebar
                    "lg:gap-4",
                    "lg:flex-col",
                    "lg:items-start",
                    "lg:w-full"
                )}
            >
                <Logo className="lg:ml-2" />
                <Navigation
                    items={navigationItems}
                    activeItemId={activeItemId}
                />
            </div>
            <DarkLightToggle />
        </header>
    );
}
