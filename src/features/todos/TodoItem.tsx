import { cls } from "@lib/utils";

import { formatDate } from "@components/Date";
import Icon from "@components/Icon";

import { pauseEvent } from "@/lib/common";
import { AppDispatch, RootState } from "@/store";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchDocument,
    selectDocumentStatusById,
    selectDocumentSummary
} from "../documents/documentSlice";
import TodoCompleted from "./TodoCompleted";
import TodoImportant from "./TodoImportant";
import TodoTitle from "./TodoTitle";
import {
    Todo,
    deleteTodo,
    selectEditTodoId,
    selectTodoById,
    selectTodoCompletedSubtasksCount,
    selectTodoSubtasksCount,
    todoExtendedEditorIdChanged,
    todoExtendedEditingChanged,
    todoStartEdit,
    updateTodo
} from "./todosSlice";

export type TodoItemProps = {
    id: Todo["id"];
    variant?: "main" | "subtask";
    features?: ("important" | "remove")[];
    onRemove?: (id: Todo["id"]) => void;
};

export default function TodoItem({
    id,
    variant,
    features,
    onRemove
}: TodoItemProps): JSX.Element {
    const dispatch = useDispatch<AppDispatch>(),
        todo: Todo | undefined = useSelector((state) =>
            selectTodoById(state, id)
        );

    const subtaskCount = useSelector((state: RootState) =>
            selectTodoSubtasksCount(state, id)
        ),
        completedSubtaskCount = useSelector((state: RootState) =>
            selectTodoCompletedSubtasksCount(state, id)
        );

    const editTodoId = useSelector(selectEditTodoId),
        contentStatus = useSelector((state: RootState) =>
            selectDocumentStatusById(state, id)
        ),
        description = useSelector(selectDocumentSummary(id));

    if (contentStatus.content === "needsUpdate") dispatch(fetchDocument(id));

    const menuId = `todo-${id}-menu`,
        { show, hideAll } = useContextMenu({ id: menuId });

    if (!todo) return null;

    const editing = editTodoId === id,
        setEditing = (value: boolean) => {
            if (value && !editing) dispatch(todoStartEdit(id));
            else if (!value && editing) dispatch(todoStartEdit(null));
        };

    let { important, tags, createDate, dueDate } = todo;

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            show({ event: e });
        } catch (e) {
            console.error(e);
        }
    };

    const Sep = () => <span className={cls("font-black", "mx-2")}>·</span>;

    return (
        <li
            className={cls(
                "flex items-center gap-4 px-4 py-3 card",
                "hover:bg-uim-50/50 dark:hover:bg-uim-900",
                "cursor-pointer"
            )}
            onClick={(e) => {
                if (e.button === 2) return;
                setEditing(true);
                pauseEvent(e);
            }}
            onDoubleClick={(e) => {
                dispatch(todoExtendedEditorIdChanged(id));
                dispatch(todoExtendedEditingChanged(true));
                setEditing(true);
                pauseEvent(e);
            }}
            onContextMenu={handleContextMenu}
            tabIndex={0}
        >
            <TodoCompleted id={id} />
            <div className={cls("flex-1", "flex", "flex-col", "min-w-0")}>
                <TodoTitle id={id} className="font-semibold" />
                <p
                    className={cls(
                        "text-uim-300 dark:text-uim-600",
                        "min-w-0",
                        "text-xs font-base",
                        "overflow-hidden",
                        "text-ellipsis",
                        "whitespace-nowrap",
                    )}
                >
                    {description}
                </p>
                <div className="flex font-medium items-center text-sm text-uim-400 mt-2">
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={cls(
                                        "px-2",
                                        "py-1",
                                        "bg-uim-100",
                                        "dark:bg-uim-800",
                                        "rounded-lg"
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {tags.length > 0 && subtaskCount > 0 && Sep()}
                    {subtaskCount > 0 && (
                        <span>
                            {completedSubtaskCount}/{subtaskCount}
                        </span>
                    )}
                    {(tags.length > 0 || subtaskCount > 0) && Sep()}
                    {createDate && <span>{formatDate(createDate)}</span>}
                    {createDate && dueDate && Sep()}
                    {dueDate && <span>{formatDate(dueDate)}</span>}
                </div>
            </div>
            <TodoImportant id={id} />
            <Menu id={menuId} theme="accent">
                <Item id="delete" onClick={() => dispatch(deleteTodo(id))}>
                    <div className="flex gap-1 items-center">
                        <Icon name="delete" size={16} />
                        <span>Delete</span>
                    </div>
                </Item>
                <Item id="edit" onClick={() => setEditing(true)}>
                    <div className="flex gap-1 items-center">
                        <Icon name="edit" size={16} />
                        <span>Edit</span>
                    </div>
                </Item>
                <Item
                    id="important"
                    onClick={() => {
                        dispatch(
                            updateTodo({
                                id,
                                update: { important: !important }
                            })
                        );
                    }}
                >
                    <div className="flex gap-1 items-center">
                        <Icon name="star" size={16} />
                        <span>Mark as important</span>
                    </div>
                </Item>
            </Menu>
        </li>
    );
}
