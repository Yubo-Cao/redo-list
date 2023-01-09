import { formatDate } from "@/components/Date";
import {
    Todo,
    selectEditTodoId,
    selectTodoById
} from "@features/todos/todosSlice";

import "bytemd/dist/index.css";

import TodoCompleted from "./TodoCompleted";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import TodoDescription from "./TodoDescription";

export default function EditorSidebar() {
    const editTodoId = useSelector(selectEditTodoId),
        todo: Todo = useSelector((state) => selectTodoById(state, editTodoId)),
        dispatch = useDispatch<AppDispatch>();

    if (!todo) return null;

    const id = editTodoId;

    let {
        title,
        description,
        important,
        completed,
        tags,
        createDate,
        dueDate,
        importance
    } = todo;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center outlined-card">
                <h2 className="font-bold text-2xl text-light-text dark:text-dark-text">
                    {title}
                </h2>
                <TodoCompleted id={id} />
            </div>
            <div className="outlined-card py-2">
                <TodoDescription id={id} />
            </div>
            <div className="outlined-card">
                <>
                    <span className="text-pri-400 mr-1">
                        {formatDate(createDate)}
                    </span>
                </>
            </div>

            <style jsx>{`
                .outlined-card {
                    @apply border border-uim-300 dark:border-uim-700 rounded-lg px-2 py-4;
                }
            `}</style>
        </div>
    );
}
