import { cls } from "../lib/utils";

export type ButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    content?: "text" | "icon" | "both";
    variant?: "solid" | "outline";
    accent?: "pri" | "sec" | "uim";
    stack?: "horizontal" | "vertical";
};

const COLOR_CLASSNAMES = {
    solid: {
        pri: "bg-pri-500 dark:bg-pri-600 text-white dark:text-dark-surface",
        sec: "bg-sec-500 dark:bg-sec-600 text-light-text dark:text-dark-text",
        uim: "bg-uim-500 dark:bg-uim-600 text-light-text dark:text-dark-text",
    },
    outline: {
        pri: "border border-pri-500 dark:border-pri-600 text-pri-500 dark:text-pri-600",
        sec: "border border-sec-500 dark:border-sec-600 text-sec-500 dark:text-sec-600",
        uim: "border border-uim-500 dark:border-uim-600 text-uim-500 dark:text-uim-600",
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
        both: "pr-2 py-2"
    },
    vertical: {
        text: "px-4 py-2",
        icon: "px-2 py-2",
        both: "px-2 py-2"
    }
};

export default function Button(
    props: ButtonProps
): React.ReactElement<ButtonProps> {
    const {
        content = "text",
        variant = "solid",
        accent = "pri",
        stack = "horizontal",
        className
    } = props;
    if (content === "icon" && !props.children)
        throw new Error("Button: icon content requires children");
    return (
        <>
            <button
                {...props}
                className={cls(
                    "flex items-center justify-center",
                    stack === "vertical" && "flex-col",
                    "transition-colors",
                    COLOR_CLASSNAMES[variant][accent],
                    PADDING_CLASSNAMES[stack][content],
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
