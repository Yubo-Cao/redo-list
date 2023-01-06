import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatDate } from "../../components/Date";
import Icon from "../../components/Icon";
import { cls } from "../../lib/utils";
import {
    Todo,
    selectEditTodoId,
    selectTodoById,
    selectTodoSubtaskCompleteTotal,
    selectTodoSubtaskTotal,
    todoStartEdit
} from "./todosSlice";

export default function TodoItem({ id }: { id: Todo["id"] }) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        dispatch = useDispatch(),
        { title, description, dueDate, tags } = todo,
        subtaskCount = useSelector(selectTodoSubtaskTotal(id)),
        subtaskCompleteCount = useSelector(selectTodoSubtaskCompleteTotal(id)),
        editTodoId = useSelector(selectEditTodoId);

    const sep = () => <span className="text-light-text dark:text-dark-text">·</span>;

    const [important, setImportant] = useState(false),
        [completed, setCompleted] = useState(false);

    return (
        <li
            className={cls(
                "flex items-center gap-4 px-4 py-3 rounded-lg shadow dark:shadow-none dark:border",
                "hover:bg-uim-50 dark:hover:bg-uim-900",
                "cursor-pointer"
            )}
            onClick={() => dispatch(todoStartEdit(id))}
        >
            <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted(!completed)}
                onClick={(e) => e.stopPropagation()}
                className={cls(
                    "w-5 h-5",
                    "rounded-lg",
                    "checked:bg-pri-500",
                    "text-pri-500",
                    "focus:outline-none focus:ring-2 focus:ring-pri-400",
                    "dark:bg-dark-surface dark:checked:bg-pri-500 dark:border-pri-500",
                    "hover:border-pri-400"
                )}
            />
            <div className={cls("flex-1")}>
                <p className={cls("text-light-text dark:text-dark-text", "font-semibold")}>
                    {title}
                </p>
                <p className="text-uim-400 text-sm text-ellipsis">{description}</p>
                <div className="text-sm text-uim-400">
                    {tags.length > 0 && (
                        <>
                            <div>
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={cls(
                                            "text-xs text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg rounded-full px-2 py-1 mr-1"
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            sep()
                        </>
                    )}
                    {subtaskCount > 0 && (
                        <>
                            <span>
                                {subtaskCompleteCount}/{subtaskCount}
                            </span>
                            sep()
                        </>
                    )}
                    {dueDate && (
                        <span className="text-pri-400 mr-1">
                            {dueDate && formatDate(dueDate)}
                        </span>
                    )}
                </div>
            </div>
            <div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setImportant(!important);
                    }}
                    className={"flex justify-center items-center"}
                >
                    <Icon
                        name="star"
                        size={24}
                        fill={true}
                        className={cls(
                            important ? "text-pri-400" : "text-uim-400 dark:text-dark-text",
                            "transition-colors"
                        )}
                    />
                </button>
            </div>
        </li>
    );
}
