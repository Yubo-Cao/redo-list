import DocumentEditor from "../documents/DocumentEditor";
import { DocumentViewer } from "../documents/DocumentViewer";
import { Todo, selectTodoById } from "./todosSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TodoDescription({ id }: { id: Todo["id"] }) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        { description } = todo,
        [edit, setEdit] = useState(false);

    return (
        <div
            onDoubleClick={(e) => {
                setEdit(!edit);
            }}
            onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                    setEdit(false);
                }
            }}
        >
            {edit ? (
                <DocumentEditor id={description} />
            ) : (
                <DocumentViewer
                    id={description}
                    placeholder="Write the description of the todo."
                />
            )}
        </div>
    );
}
