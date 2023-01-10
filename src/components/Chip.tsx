import Icon from "./Icon";
import { cls } from "@/lib/utils";
import React from "react";

export type ChipProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    children: React.ReactNode;
    style?: React.CSSProperties;
    deleteable?: boolean;
    onDelete?: () => void;
    className?: string;
};

export default function Chip({
    children,
    className,
    onDelete,
    deleteable = false,
    ...rest
}: ChipProps) {
    const [hover, setHover] = React.useState(false);

    return (
        <div
            className={cls(
                cls(
                    "px-2",
                    "py-1",
                    "bg-uim-200",
                    "dark:bg-uim-700",
                    "font-medium",
                    "rounded-lg",
                    "flex center"
                ),
                hover && deleteable && "pr-1.5",
                className
            )}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            {...rest}
        >
            {children}
            {hover && deleteable && (
                <div onClick={onDelete}>
                    <Icon
                        name="close"
                        iconSize={18}
                        size={24}
                        className="ml-2 hover:bg-uim-100/50 hover:dark:bg-uim-900/50 rounded-full p-1 cursor-pointer"
                    />
                </div>
            )}
        </div>
    );
}
