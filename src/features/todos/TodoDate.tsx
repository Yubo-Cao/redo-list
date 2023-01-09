import MDCalendar from "@/components/Calendar";
import { formatDate, fromISO, toISO } from "@/components/Date";
import { AppDispatch } from "@/store";
import { Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";

export type TodoDateProps = {
    id: Todo["id"];
    field: keyof Todo;
    label: React.ReactNode;
};

export default function TodoDate({ id, field, label }: TodoDateProps) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        menu_id = `todo-date-picker-${id}-${field}`,
        { show } = useContextMenu({ id: menu_id }),
        handleMenu = (e) => show({ event: e }),
        dispatch = useDispatch<AppDispatch>();

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
        <div className="flex items-center gap-2" onClick={handleMenu}>
            {label}
            <span className="font-bold text mr-1 flex-1">
                {_try_or(
                    () => formatDate(fromISO(date)),
                    () => "Not specified"
                )}
            </span>
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
                                update: { createDate: toISO(date) }
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
        </div>
    );
}
