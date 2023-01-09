import {
    Todo,
    selectEditTodoId,
    selectTodoById
} from "@features/todos/todosSlice";

import "bytemd/dist/index.css";

import TodoCompleted from "./TodoCompleted";
import TodoDescription from "./TodoDescription";
import TodoTitle from "./TodoTitle";
import { formatDate } from "@/components/Date";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

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
                <TodoTitle id={id} />
                <TodoCompleted id={id} />
            </div>
            <div className="outlined-card py-2">
                <TodoDescription id={id} />
            </div>
            <div className="outlined-card">
                <div className="flex items-center gap-2">
                    <Icon
                        name="calendar_today"
                        className="flex-0 text"
                        size={24}
                    />
                    <span className="flex-0 text">Create date:</span>
                    <span className="font-bold text-pri-400 mr-1 flex-1">
                        {formatDate(createDate)}
                    </span>
                </div>
            </div>

            <style jsx>{`
                .outlined-card {
                    @apply border border-uim-300 dark:border-uim-700 rounded-lg px-3 py-4;
                }
            `}</style>
        </div>
    );
}
