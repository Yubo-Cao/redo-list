import DocumentEditor from "@features/documents/DocumentEditor";
import {
    Todo,
    selectEditTodoId,
    selectTodoById
} from "@features/todos/todosSlice";

import Icon from "@components/Icon";

import "bytemd/dist/index.css";

import { AppDispatch } from "@/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

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
            <div className="prose max-w-none">
                <h2 className="text-light-text dark:text-dark-text">{title}</h2>
                <DocumentEditor id={description} />
            </div>
        </>
    );
}
