import { cls } from "../lib/utils";

import { forwardRef } from "react";

export type ButtonProps = Omit<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > & {
        content?: "text" | "icon" | "both";
        variant?: "solid" | "outline" | "none";
        accent?: "pri" | "sec" | "uim";
        stack?: "horizontal" | "vertical";
        padding?: boolean;
    },
    "ref"
>;

const COLOR_CLASSNAMES = {
    solid: {
        pri: "bg-pri-500 dark:bg-pri-600 text-white dark:text-dark-surface",
        sec: "bg-sec-500 dark:bg-sec-600 text-light-text dark:text-dark-text",
        uim: "bg-uim-400 dark:bg-uim-500 text-light-text dark:text-dark-text"
    },
    outline: {
        pri: "border border-pri-500 dark:border-pri-600 text-pri-500 dark:text-pri-600",
        sec: "border border-sec-500 dark:border-sec-600 text-sec-500 dark:text-sec-600",
        uim: "border border-uim-300 dark:border-uim-600 text-uim-500 dark:text-uim-500"
    },
    none: {
        pri: "text-pri-500 dark:text-pri-600",
        sec: "text-sec-500 dark:text-sec-600",
        uim: "text-uim-300 dark:text-uim-500"
    }
};

const CONTENT_CLASSNAMES = {
    icon: "rounded-full justify-center",
    text: "rounded-md",
    both: "rounded-md"
};

const PADDING_CLASSNAMES = {
    horizontal: {
        text: "px-4 py-2",
        icon: "px-2 py-2",
        both: "px-4 pl-3 py-2"
    },
    vertical: {
        text: "px-4 py-2",
        icon: "px-2 py-2",
        both: "px-2 py-2"
    }
};

function button(props: ButtonProps, ref): React.ReactElement<ButtonProps> {
    const {
        content = "text",
        variant = "solid",
        accent = "pri",
        stack = "horizontal",
        padding = true,
        className,
        ...rest
    } = props;
    if (content === "icon" && !props.children)
        throw new Error("Button: icon content requires children");
    return (
        <>
            <button
                {...rest}
                ref={ref}
                className={cls(
                    "flex items-center justify-center",
                    stack === "vertical" && "flex-col",
                    "transition-colors",
                    COLOR_CLASSNAMES[variant][accent],
                    padding && PADDING_CLASSNAMES[stack][content],
                    CONTENT_CLASSNAMES[content],
                    className
                )}
            >
                {props.children}
            </button>
            <style jsx>{`
                button:active,
                button:focus {
                    outline: none;
                }
            `}</style>
        </>
    );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(button);
export default Button;
