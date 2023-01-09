import { cls } from "@lib/utils";

import { formatDate } from "@components/Date";
import Icon from "@components/Icon";

import { selectDocumentSummaryById } from "../documents/documentSlice";
import TodoCompleted from "./TodoCompleted";
import TodoImportant from "./TodoImportant";
import TodoTitle from "./TodoTitle";
import {
    Todo,
    deleteTodo,
    selectEditTodoId,
    selectTodoById,
    selectTodoSubtaskCompleteTotal,
    selectTodoSubtaskTotal,
    todoSetExtendedEditor,
    todoStartEdit,
    updateTodo
} from "./todosSlice";
import { AppDispatch } from "@/store";
import { useRef } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";

export default function TodoItem({ id }: { id: Todo["id"] }) {
    const todo: Todo | undefined = useSelector((state) =>
            selectTodoById(state, id)
        ),
        dispatch = useDispatch<AppDispatch>(),
        subtaskCount = useSelector(selectTodoSubtaskTotal(id)),
        subtaskCompleteCount = useSelector(selectTodoSubtaskCompleteTotal(id)),
        editTodoId = useSelector(selectEditTodoId),
        description = useSelector(selectDocumentSummaryById(todo?.description)),
        menuId = `todo-${id}-menu`,
        { show } = useContextMenu({ id: menuId });

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

    const Sep = () => (
        <span className={cls("font-black", "mx-2", "text-pri-500")}>·</span>
    );

    return (
        <li
            className={cls(
                "flex items-center gap-4 px-4 py-3 card",
                "hover:bg-uim-50/50 dark:hover:bg-uim-900",
                "cursor-pointer",
                "todo-item"
            )}
            onClick={(e) => {
                setEditing(true);
                e.stopPropagation();
            }}
            onDoubleClick={(e) => {
                setEditing(true);
                dispatch(todoSetExtendedEditor(true));
                e.stopPropagation();
            }}
            onContextMenu={handleContextMenu}
            tabIndex={0}
            onFocus={() => setEditing(true)}
        >
            <TodoCompleted id={id} />
            <div className={cls("flex-1", "flex", "flex-col")}>
                <TodoTitle id={id} />
                <p
                    className={cls(
                        "text-uim-400",
                        "min-w-0",
                        "text-sm",
                        "overflow-hidden",
                        "text-ellipsis",
                        "whitespace-nowrap"
                    )}
                >
                    {description}
                </p>
                <div className="flex items-center text-sm text-uim-400">
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={cls(
                                        "text-xs",
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
                            {subtaskCompleteCount}/{subtaskCount}
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
                <Item
                    id="delete"
                    onClick={() => dispatch(deleteTodo(id) as any)}
                >
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
