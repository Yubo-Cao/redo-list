import { cls } from "@/lib/utils";
import React from "react";
import Icon from "./Icon";

type ChipProps = React.DetailedHTMLProps<
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
                "inline-block relative align-baseline font-sans text-xs font-medium center leading-none whitespace-nowrap py-2 px-3.5 center rounded-lg select-none bg-pri-400 dark:bg-pri-600 text-white h-6",
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
                        iconSize={12}
                        size={18}
                        className="ml-2 hover:bg-uim-100/50 hover:dark:bg-uim-900/50 rounded-full p-1 cursor-pointer"
                    />
                </div>
            )}
        </div>
    );
}
