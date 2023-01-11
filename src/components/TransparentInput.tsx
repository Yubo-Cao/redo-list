import { pauseEvent } from "@/lib/common";
import { cls } from "@/lib/utils";
import { MutableRefObject, forwardRef, useState } from "react";

export type TransparentInputProps = {
    value: string;
    onChange: (value: string) => void;
    edit?: boolean;
    onEdit?: (editing: boolean) => void;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
};

export const TransparentInput: React.FC<TransparentInputProps> = forwardRef(
    (props, ref: MutableRefObject<HTMLDivElement>) => {
        const { value, onChange, style, className, placeholder = "" } = props;

        // handle edit and fallback
        let { edit, onEdit } = props;
        const [_edit, _setEdit] = useState(edit);
        onEdit = onEdit != null ? onEdit : _setEdit;

        // default style
        const clz = cls("text-light-text dark:text-dark-text", "w-full");

        return (
            <div
                onClick={(e) => [onEdit(true), pauseEvent(e)]}
                onKeyDown={(e) => e.key === "Enter" && onEdit(false)}
                style={style}
                className={cls(className)}
                ref={ref}
            >
                {_edit ? (
                    <input
                        type="text"
                        className={cls(
                            clz,
                            "text-uim-500 dark:text-uim-400",
                            className
                        )}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        placeholder={placeholder}
                        tabIndex={0}
                        autoFocus
                    />
                ) : (
                    <p className={cls(clz, "cursor-pointer", className)}>
                        {value || placeholder}
                    </p>
                )}
            </div>
        );
    }
);
