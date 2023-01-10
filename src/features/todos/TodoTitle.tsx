import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import { cls } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function TodoTitle(
    {
        id,
        className,
        style
    }: {
        id: Todo["id"];
        className?: string;
        style?: React.CSSProperties;
    },
    ref?: React.RefObject<HTMLInputElement>
) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        { title } = todo,
        [edit, setEdit] = useState(false),
        dispatch = useDispatch<AppDispatch>();

    const clz = cls("text-light-text dark:text-dark-text", "w-full");

    return (
        <div
            onClick={(e) => setEdit(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setEdit(false);
                }
            }}
        >
            {edit ? (
                <input
                    type="text"
                    className={cls(clz, "font-black", className)}
                    value={title}
                    onChange={(e) => {
                        dispatch(
                            updateTodo({
                                id,
                                update: { title: e.target.value }
                            })
                        );
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    placeholder="Title of the task"
                    ref={ref}
                    tabIndex={0}
                    autoFocus
                />
            ) : (
                <p className={cls(clz, "cursor-pointer", className)}>
                    {title || "Title of the task"}
                </p>
            )}
        </div>
    );
}

const ForwardedTodoTitle = forwardRef(TodoTitle);
export default ForwardedTodoTitle;
export { TodoTitle, ForwardedTodoTitle };
