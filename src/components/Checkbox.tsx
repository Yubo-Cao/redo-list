import { cls } from "@lib/utils";

import { forwardRef } from "react";

export type CheckboxProps = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > & { variant?: "pri" | "sec" | "uim" },
    "ref"
>;

export const VARIANT_CLASSNAMES = {
    pri: "checked:bg-pri-500 dark:checked:bg-pri-600 checked:text-pri-500",
    sec: "checked:bg-sec-500 dark:checked:bg-sec-600 checked:text-sec-500",
    uim: "checked:bg-uim-500 dark:checked:bg-uim-600 checked:text-uim-500"
};

function checkbox(
    props: CheckboxProps,
    ref
): React.ReactElement<CheckboxProps> {
    return (
        <>
            <input
                {...props}
                ref={ref}
                type="checkbox"
                className={cls(
                    "w-5 h-5",
                    "rounded-md border border-uim-300 dark:border-uim-700",
                    "bg-white-surface dark:bg-dark-surface",
                    VARIANT_CLASSNAMES[props.variant || "pri"],
                    props.className
                )}
            />
            <style jsx>{`
                input {
                    appearance: none;
                    background-position: center;
                }

                input:active,
                input:focus {
                    outline: none;
                }

                :global(input[type="checkbox"]:hover:not(:checked)) {
                    @apply bg-uim-100;
                }

                :global(.dark input[type="checkbox"]:hover:not(:checked)) {
                    @apply bg-uim-800;
                }

                input:checked {
                    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
                }
            `}</style>
        </>
    );
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(checkbox);
export default Checkbox;
