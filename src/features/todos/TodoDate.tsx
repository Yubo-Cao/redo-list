import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import MDCalendar from "@/components/Calendar";
import { formatDate, fromISO, toISO } from "@/components/Date";
import { pauseEvent } from "@/lib/common";
import { cls } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRef } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

export type TodoDateProps = {
    id: Todo["id"];
    field: keyof Todo;
    className?: string;
    style?: React.CSSProperties;
    clearStyle?: boolean;
};

export default function TodoDate({
    id,
    field,
    className,
    clearStyle,
    ...rest
}: TodoDateProps) {
    const todo = useAppSelector((state) => selectTodoById(state, id)),
        menu_id = `todo-date-picker-${id}-${field}`,
        { show, hideAll } = useContextMenu({ id: menu_id }),
        handleMenu = (e) => {
            try {
                show({ event: e });
            } catch (e) {
                console.error(e);
            }
        },
        dispatch = useAppDispatch(),
        ref = useRef<HTMLDivElement>(null);

    if (!todo) return null;

    const date = todo[field] as string;
    const _try_or = (fn, or) => {
        try {
            return fn();
        } catch (e) {
            return or();
        }
    };

    return (
        <>
            <div
                className={cls(
                    !clearStyle &&
                        "font-bold text-xl mr-1 flex-1 cursor-pointer hover:font-black",
                    className
                )}
                onClick={handleMenu}
                ref={ref}
                tabIndex={0}
                onKeyDown={(e) => {
                    const cur = ref.current;
                    if (!cur) return;
                    pauseEvent(e);
                    if (e.key === "Enter" || e.key === " ") {
                        const rect = cur.getBoundingClientRect();
                        const mid = {
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2
                        };
                        const event = new MouseEvent("click", {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            ...mid
                        });
                        cur.dispatchEvent(event);
                    }
                }}
                {...rest}
            >
                {_try_or(
                    () => formatDate(fromISO(date)),
                    () => "Not specified"
                )}
            </div>
            <Menu
                id={menu_id}
                theme="accent"
                className="date-picker-menu bg-light-surface dark:bg-dark-surface"
            >
                <Item className="center w-full" closeOnClick={false}>
                    <MDCalendar
                        value={_try_or(
                            () => fromISO(date),
                            () => new Date()
                        )}
                        onChange={(date) => {
                            dispatch(
                                updateTodo({
                                    id,
                                    update: { [field]: toISO(date) }
                                })
                            );
                        }}
                        onClickDay={(date) => hideAll()}
                    />
                </Item>
            </Menu>
            <style jsx>
                {`
                    :global(.date-picker-menu) {
                        --contexify-menu-minWidth: 20rem;
                        --contexify-menu-padding: 1rem;
                        --contexify-activeItem-bgColor: transparent;
                        --contexify-menu-minWidth: 0;
                    }
                `}
            </style>
        </>
    );
}
