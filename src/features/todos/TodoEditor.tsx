import DocumentEditor from "@features/documents/DocumentEditor";
import {
    Todo,
    selectEditTodoId,
    selectTodoById
} from "@features/todos/todosSlice";

import "bytemd/dist/index.css";

import { DocumentViewer } from "../documents/DocumentViewer";
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
        <>
            <div className="flex justify-between items-center mb-3 card">
                <h2 className="font-bold text-2xl text-light-text dark:text-dark-text">
                    {title}
                </h2>
                <TodoCompleted id={id} />
            </div>
            <div className="card">
                <TodoDescription id={id} />
            </div>
            <div className="card">
                
            </div>
        </>
    );
}
