import { createContext, useEffect, useRef, useState } from "react";
import toPX from "to-px";

import { cls } from "../lib/utils";

import Header from "./Header";

export const LayoutContext = createContext({
    headerWidth: 0,
    sideBarWidth: 0,
    mainWidth: 0
});

export default function Layout({
    activeItemId,
    children,
    sideBarChildren,
    sideBarWidth = "18rem",
    headerWidth = "12rem",
    headerResizable = true,
    headerResizableMinWidth = "12rem",
    headerResizableMaxWidth = "-1rem",
    sideBarResizable = true,
    sideBarResizableMinWidth = "18rem",
    sideBarResizableMaxWidth = "-1rem"
}: {
    activeItemId: string;
    children: React.ReactNode;
    sideBarChildren?: React.ReactNode;
    sideBarWidth?: string;
    headerWidth?: string;
    headerResizable?: boolean;
    headerResizableMinWidth?: string;
    headerResizableMaxWidth?: string;
    sideBarResizable?: boolean;
    sideBarResizableMinWidth?: string;
    sideBarResizableMaxWidth?: string;
}) {
    const [hw, setHw] = useState(toPX(headerWidth) as number),
        [sw, setSw] = useState(toPX(sideBarWidth) as number),
        [mw, setMw] = useState(0),
        headerRef = useRef<HTMLHeadingElement>(),
        sidebarRef = useRef<HTMLDivElement>(),
        mainRef = useRef<HTMLDivElement>();

    const coerce = (value: number, min: number, max: number) => {
        if (max < 0) max = window.innerWidth;
        if (value < min) return min;
        if (value > max) return max;
        return value;
    };

    const header = (
            <Header
                activeItemId={activeItemId}
                style={{ gridArea: "header" }}
                refHeader={headerRef}
                className="header-layout-header"
            />
        ),
        main = (
            <main
                className={cls("lg:py-8", "px-4", "dark:bg-black", "h-full")}
                style={{ gridArea: "content" }}
                ref={mainRef}
            >
                {children}
            </main>
        );

    const resizer = (side, ref, minWidth, maxWidth, setWidth) => () => {
        const { current } = ref;
        if (!current) return;
        const safeSetWidth = (value: number) =>
            setWidth(coerce(value, toPX(minWidth), toPX(maxWidth)));
        const resize = (e) => {
            if (!e.buttons) document.removeEventListener("mousemove", resize);
            const { clientX } = e;
            if (side === "left") {
                let { left } = current.getBoundingClientRect();
                safeSetWidth(clientX - left);
            } else {
                let { right } = current.getBoundingClientRect();
                safeSetWidth(right - clientX);
            }
        };
        current.addEventListener("mousedown", (e) => {
            if (side === "left" && e.offsetX < current.offsetWidth - 10) return;
            if (side === "right" && e.offsetX > 10) return;

            e.preventDefault();
            document.addEventListener("mousemove", resize);
        });
        current.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", resize);
        });
    };

    useEffect(() => {
        setMw(window.innerWidth - hw - sw);
    }, [hw, sw]);

    headerResizable &&
        useEffect(
            resizer(
                "left",
                headerRef,
                headerResizableMinWidth,
                headerResizableMaxWidth,
                setHw
            ),
            []
        );
    sideBarResizable &&
        useEffect(
            resizer(
                "right",
                sidebarRef,
                sideBarResizableMinWidth,
                sideBarResizableMaxWidth,
                setSw
            ),
            []
        );

    if (sideBarChildren) {
        return (
            <LayoutContext.Provider
                value={{ headerWidth: hw, sideBarWidth: sw, mainWidth: mw }}
            >
                <div className="header-layout dark:bg-dark-surface">
                    {header}
                    {main}
                    <aside
                        className={cls(
                            "bg-light-surface dark:bg-dark-surface",
                            "shadow-lg",
                            "h-full",
                            "overflow-y-auto",
                            "lg:py-8 px-4",
                            "max-xl:hidden"
                        )}
                        style={{ gridArea: "sidebar" }}
                        ref={sidebarRef}
                    >
                        {sideBarChildren}
                    </aside>
                    <style jsx>
                        {`
                            .header-layout {
                                display: grid;
                                grid-template-rows: 4rem 1fr;
                                grid-template-columns: ${hw}px 1fr;
                                height: 100vh;
                                grid-template-areas:
                                    "header header"
                                    "content content";
                                grid-gap: 1.5rem;
                                overflow: hidden;
                            }

                            :global(.header-layout-header) {
                                grid-area: header;
                                position: relative;
                            }

                            :global(.header-layout-header)::after {
                                content: "";
                                position: absolute;
                                top: 0;
                                right: -0.5rem;
                                width: 1rem;
                                height: 100%;
                                cursor: col-resize;
                            }

                            aside {
                                grid-area: header;
                                position: relative;
                            }

                            aside::after {
                                content: "";
                                position: absolute;
                                top: 0;
                                left: -0.5rem;
                                width: 1rem;
                                height: 100%;
                                cursor: col-resize;
                            }

                            @media (min-width: 1024px) {
                                .header-layout {
                                    grid-gap: 1rem;
                                    grid-template-areas:
                                        "header content"
                                        "header content";
                                }
                            }
                            @media (min-width: 1280px) {
                                .header-layout {
                                    grid-template-columns: ${hw}px 1fr ${sw}px;
                                    grid-template-areas: "header content sidebar";
                                    grid-template-rows: 1fr;
                                }
                            }
                        `}
                    </style>
                </div>
            </LayoutContext.Provider>
        );
    } else {
        return (
            <LayoutContext.Provider
                value={{ headerWidth: hw, sideBarWidth: -1, mainWidth: mw }}
            >
                <div className="header-layout dark:bg-dark-surface">
                    {header}
                    {main}
                    <style jsx>
                        {`
                            .header-layout {
                                display: grid;
                                grid-template-rows: 4rem 1fr;
                                grid-template-columns: ${hw}px 1fr;
                                height: 100vh;
                                grid-template-areas:
                                    "header header"
                                    "content content";
                                grid-gap: 1.5rem;
                                overflow: hidden;
                            }

                            :global(.header-layout-header) {
                                grid-area: header;
                                position: relative;
                            }

                            :global(.header-layout-header)::after {
                                content: "";
                                position: absolute;
                                top: 0;
                                right: -0.5rem;
                                width: 1rem;
                                height: 100%;
                                cursor: col-resize;
                            }

                            @media (min-width: 1024px) {
                                .header-layout {
                                    grid-gap: 1rem;
                                    grid-template-areas:
                                        "header content"
                                        "header content";
                                }
                            }
                        `}
                    </style>
                </div>
            </LayoutContext.Provider>
        );
    }
}
