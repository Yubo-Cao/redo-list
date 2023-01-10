import Icon from "./Icon";
import { pauseEvent } from "@/lib/common";
import { cls, coerce } from "@/lib/utils";
import React, { useRef } from "react";

export type SidebarProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    children: React.ReactNode;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    direction?: "left" | "right" | "top" | "bottom";
    collapsable?: boolean;
    collapsed?: boolean;
    onCollapse: () => void;
    onExpand: () => void;
};

const SIDEBAR_RESIZE_HANDLE_SIZE = 4;

function HorizontalSidebar({
    children,
    minWidth,
    maxWidth,
    width = 256,
    direction,
    collapsable = true,
    onCollapse,
    onExpand,
    collapsed = false,
    className = "",
    ...rest
}: Omit<SidebarProps, "direction"> & { direction: "left" | "right" }) {
    const handle = useRef<HTMLDivElement>(null),
        sidebar = useRef<HTMLDivElement>(null),
        [w, setW] = React.useState(width),
        [resizing, setResizing] = React.useState(false),
        minW = minWidth ?? width === -1 ? 0 : minWidth ?? width,
        maxW = maxWidth ?? width === -1 ? 9999 : maxWidth ?? width;

    const onMove = (e: MouseEvent) => {
        pauseEvent(e);
        const { clientX } = e;
        if (direction === "left") {
            const { left } = sidebar.current.getBoundingClientRect();
            setW(coerce(clientX - left, minW, maxW));
        } else {
            const { right } = sidebar.current.getBoundingClientRect();
            setW(coerce(right - clientX, minW, maxW));
        }
    };

    const onDown = (e) => {
        e.stopPropagation();
        if (e.target === handle.current) {
            setResizing(true);
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", () => {
                setResizing(false);
                document.removeEventListener("mousemove", onMove);
            });
        }
    };

    const collapse = () => {
        if (collapsable) {
            if (collapsed) {
                onExpand();
            } else {
                onCollapse();
            }
        }
    };

    return (
        <>
            <div
                className={cls(
                    "horizontal-sidebar",
                    collapsed && "collapsed",
                    "bg-light-surface dark:bg-dark-surface",
                    !resizing && "transition-all",
                    className
                )}
                ref={sidebar}
                {...rest}
            >
                {children}
            </div>

            <div
                ref={handle}
                className={cls(
                    "horizontal-sidebar-resize-handle",
                    "hover:bg-uim-100 dark:hover:bg-uim-800",
                    collapsed &&
                        "shadow-lg bg-light-surface dark:bg-dark-surface collapsed"
                )}
                onMouseDown={onDown}
                onDoubleClick={collapse}
            >
                <div
                    className={cls(
                        "expand-collapse-button",
                        collapsed && "collapsed",
                        direction === "right" && collapsed && "justify-end"
                    )}
                    onClick={collapse}
                >
                    <Icon
                        name={"chevron_right"}
                        size={24}
                        className={cls(
                            "text-uim-500 dark:text-uim-400",
                            collapsed && "collapsed"
                        )}
                        style={{
                            transform:
                                (direction === "left"
                                    ? "rotate(0)"
                                    : "rotate(180deg)") +
                                (collapsed ? "rotate(0)" : "rotate(180deg)")
                        }}
                    />
                </div>
            </div>
            <style jsx>{`
                .horizontal-sidebar {
                    ${direction === "left" ? "left: 0;" : "right: 0;"}
                    width: ${w}px;
                    @apply absolute top-0 bottom-0
                        shadow-lg lg:py-8 px-6 z-10
                        overflow-hidden;
                    ${direction === "left"
                        ? "padding-right: 3rem;"
                        : "padding-left: 3rem;"}

                    &.collapsed {
                        width: 0;
                        padding: 0;
                    }
                }

                .horizontal-sidebar-resize-handle {
                    content: "";
                    @apply absolute top-0 bottom-0 z-20;
                    ${direction === "left"
                        ? `left: ${w - SIDEBAR_RESIZE_HANDLE_SIZE / 2}px;`
                        : `right: ${w - SIDEBAR_RESIZE_HANDLE_SIZE / 2}px;`}
                    width: ${SIDEBAR_RESIZE_HANDLE_SIZE}px;
                    @apply cursor-col-resize;

                    &.collapsed {
                        ${direction === "left"
                            ? `left: ${SIDEBAR_RESIZE_HANDLE_SIZE / 2}px;`
                            : `right: ${SIDEBAR_RESIZE_HANDLE_SIZE / 2}px;`}
                    }
                }

                .expand-collapse-button {
                    @apply absolute top-1/2 w-12 h-12 rounded-full
                         flex items-center z-20
                         px-1
                         select-none cursor-pointer;

                    ${direction === "left" ? "right: -6px;" : "left: unset;"}

                    &.collapsed {
                        ${direction === "left" ? "left: 0;" : "right: 0;"}
                    }
                }
            `}</style>
        </>
    );
}
function Sidebar(props: SidebarProps) {
    const { direction = "right", ...rest } = props;
    return direction === "left" || direction === "right" ? (
        <HorizontalSidebar {...rest} direction={direction} />
    ) : (
        <div />
    );
}

export default Sidebar;
