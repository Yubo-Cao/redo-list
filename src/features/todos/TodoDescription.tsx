import DocumentEditor from "../documents/DocumentEditor";
import { DocumentViewer } from "../documents/DocumentViewer";
import { Todo, selectTodoById } from "./todosSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TodoDescription({ id }: { id: Todo["id"] }) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        { description } = todo,
        [edit, setEdit] = useState(false),
        ref = useRef<HTMLDivElement>(null);

    return (
        <div
            onDoubleClick={(e) => {
                if (e.target !== ref.current) return;
                setEdit(!edit);
            }}
        >
            edit ? (
            <DocumentEditor id={description} />
            ) : (
            <DocumentViewer id={description} />)
        </div>
    );
}
