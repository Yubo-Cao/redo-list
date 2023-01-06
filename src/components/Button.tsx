import { cls } from "../lib/utils";

type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
};

export default function Button({
    children,
    className,
    onClick,
    disabled,
    style
}: ButtonProps) {
    return (
        <button
            className={cls(
                "bg-pri-100 dark:bg-pri-500",
                "text-pri-500 dark:text-white",
                "font-medium",
                "rounded-lg",
                "px-4 py-2",
                "transition-colors",
                "hover:bg-pri-200 hover:dark:bg-pri-400",
                "focus:outline-none",
                "focus:ring-2 focus:ring-pri-400",
                className
            )}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
}
