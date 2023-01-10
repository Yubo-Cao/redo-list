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
            onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") {
                    setEdit(false);
                }
                if (document.activeElement === ref.current) {
                    if (e.key === "Enter" || e.key === " ") {
                        setEdit(true);
                    }
                }
                if (e.key === "Escape") setEdit(false);
            }}
            ref={ref}
            tabIndex={0}
        >
            {edit ? (
                <DocumentEditor id={description} />
            ) : (
                <DocumentViewer
                    id={description}
                    placeholder="Write the description of the todo."
                    onClick={(e) => setEdit(true)}
                    className="px-3 py-2 cursor-pointer"
                />
            )}
        </div>
    );
}
