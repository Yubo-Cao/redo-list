import { useState } from "react";

import { cls } from "../lib/utils";
import { Icon, IconProps } from "./Icon";

type IconButtonProps = IconProps & {
    onClick?: () => void;
    iconClassName?: string;
    iconWrapperClassName?: string;
};

export default function IconButton(props: IconButtonProps) {
    const [hover, setHover] = useState(false),
        {
            className: buttonClassName,
            iconClassName,
            wrapperClassName,
            iconWrapperClassName = wrapperClassName
        } = props,
        finalIconProps = {
            ...props,
            className: iconClassName,
            wrapperClassName: iconWrapperClassName
        };
    return (
        <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={props.onClick}
            className={cls(
                "transition-colors",
                "flex items-center justify-center", // center icon
                "hover:bg-uim-100 dark:hover:bg-uim-700",
                "active:ring-2 active:ring-uim-700 active:bg-uim-100 dark:active:bg-uim-800 dark:active:ring-uim-200",
                "rounded-full border-2 dark:border-uim-500 dark:text-dark-text",
                buttonClassName
            )}
        >
            <Icon
                {...finalIconProps}
                grade={hover ? 100 : 0}
                className={cls("transition-all", finalIconProps.className)}
            />
        </button>
    );
}

export { IconButton };
export type { IconButtonProps };
