import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import MDCalendar from "@/components/Calendar";
import { formatDate, fromISO, toISO } from "@/components/Date";
import { AppDispatch } from "@/store";
import { useRef } from "react";
import { Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";

export type TodoDateProps = {
    id: Todo["id"];
    field: keyof Todo;
};

export default function TodoDate({ id, field }: TodoDateProps) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        menu_id = `todo-date-picker-${id}-${field}`,
        { show } = useContextMenu({ id: menu_id }),
        handleMenu = (e) => {
            try {
                show({ event: e });
            } catch (e) {
                console.error(e);
            }
        },
        dispatch = useDispatch<AppDispatch>(),
        ref = useRef<HTMLSpanElement>(null);

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
                className="font-bold text mr-1 flex-1 cursor-pointer hover:font-black"
                onClick={handleMenu}
                ref={ref}
                tabIndex={0}
                onKeyDown={(e) => {
                    const cur = ref.current;
                    if (!cur) return;
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
            >
                {_try_or(
                    () => formatDate(fromISO(date)),
                    () => "Not specified"
                )}
            </div>
            <Menu id={menu_id} theme="accent" className="date-picker-menu">
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
                />
            </Menu>
            <style jsx>
                {`
                    :global(.date-picker-menu) {
                        --contexify-menu-minWidth: 20rem;
                        --contexify-menu-padding: 1rem;
                    }
                `}
            </style>
        </>
    );
}
