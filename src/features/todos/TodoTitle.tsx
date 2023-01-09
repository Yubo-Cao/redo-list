import { useDispatch, useSelector } from "react-redux";

import { forwardRef, useState } from "react";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import { AppDispatch } from "@/store";
import { cls } from "@/lib/utils";

function TodoTitle(
    {
        id
    }: {
        id: Todo["id"];
    },
    ref?: React.RefObject<HTMLInputElement>
) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        { title } = todo,
        [edit, setEdit] = useState(false),
        dispatch = useDispatch<AppDispatch>();

    const style = cls(
        "font-semibold",
        "text-light-text dark:text-dark-text",
        "p-0",
        "border-0",
        "bg-transparent",
        "outline-none"
    );

    return (
        <div
            onDoubleClick={(e) => {
                setEdit(!edit);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setEdit(false);
                }
            }}
        >
            {edit ? (
                <input
                    type="text"
                    className={style}
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
                    autoFocus
                />
            ) : (
                <p className={style}>{title}</p>
            )}
        </div>
    );
}

const ForwardedTodoTitle = forwardRef(TodoTitle);
export default ForwardedTodoTitle;
export { TodoTitle, ForwardedTodoTitle };
