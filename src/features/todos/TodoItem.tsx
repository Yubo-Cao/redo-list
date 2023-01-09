import { cls } from "@lib/utils";

import Checkbox from "@components/Checkbox";
import { formatDate } from "@components/Date";
import Icon from "@components/Icon";

import { selectDocumentSummaryById } from "../documents/documentSlice";
import TodoCompleted from "./TodoCompleted";
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
import Button from "@/components/Button";
import { AppDispatch } from "@/store";
import { useRef } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";
import TodoTitle from "./TodoTitle";

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

    const _wrap =
        <T,>(name: string, hook?: (val: T) => any) =>
        (value: T) => {
            if (eval(name) === value) return;
            dispatch(
                updateTodo({
                    id,
                    update: { [name]: value } as Partial<Todo>
                }) as any
            );
            if (hook) hook(value);
        };

    const completedRef = useRef<HTMLInputElement>(null),
        titleRef = useRef<HTMLInputElement>(null),
        descriptionRef = useRef<HTMLInputElement>(null),
        importantRef = useRef<HTMLButtonElement>(null);

    if (!todo) return null;

    const editing = editTodoId === id,
        setEditing = (value: boolean) => {
            if (value && !editing) dispatch(todoStartEdit(id));
            else if (!value && editing) dispatch(todoStartEdit(null));
        };

    let { title, important, completed, tags, createDate, dueDate } = todo;

    const setImportant = _wrap("important"),
        setCompleted = _wrap("completed"),
        setTitle = _wrap("title");

    const RESETTER = cls("p-0", "border-0", "bg-transparent", "outline-none");

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        show({ event: e, props: {} });
    };

    const Sep = () => (
        <span className={cls("text-light-text", "dark:text-dark-text", "mx-1")}>
            ·
        </span>
    );

    const Description = () => (
        <p
            className={cls(
                "text-uim-400",
                "min-w-0",
                "text-sm",
                "overflow-hidden",
                "text-ellipsis",
                "whitespace-nowrap",
                RESETTER
            )}
        >
            {description}
        </p>
    );

    const Important = () => (
        <Button
            onClick={(e) => [e.stopPropagation(), setImportant(!important)]}
            content="icon"
            variant="none"
            padding={false}
            accent={important ? "pri" : "uim"}
            ref={importantRef}
        >
            <Icon name="star" size={24} fill={true} />
        </Button>
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
            <TodoCompleted id={id} ref={completedRef} />
            <div
                className={cls(
                    "flex-1",
                    "flex",
                    "flex-col",
                    "max-w-full",
                    "min-w-0"
                )}
            >
                <TodoTitle id={id} ref={titleRef} />
                {Description()}
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
                            {Sep()}
                        </>
                    )}
                    {subtaskCount > 0 && (
                        <>
                            <span>
                                {subtaskCompleteCount}/{subtaskCount}
                            </span>
                            {Sep()}
                        </>
                    )}
                    {createDate && (
                        <>
                            <span className="text-pri-400 mr-1">
                                {formatDate(createDate)}
                            </span>
                            {Sep()}
                        </>
                    )}
                    {dueDate && (
                        <span className="text-pri-400 mr-1">
                            {dueDate && formatDate(dueDate)}
                        </span>
                    )}
                </div>
            </div>
            {Important()}
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
                <Item id="important" onClick={() => setImportant(!important)}>
                    <div className="flex gap-1 items-center">
                        <Icon name="star" size={16} />
                        <span>Mark as important</span>
                    </div>
                </Item>
            </Menu>
            <style jsx>{`
                :global(.todo-item [type="text"]:focus) {
                    outline: none;
                    box-shadow: none;
                }

                :global(.todo-item .contexify_theme-accent) {
                    --contexify-menu-bgColor: #fff;
                    --contexify-separator-color: #eee;
                    --contexify-item-color: #666;
                    --contexify-activeItem-color: #ec913f;
                    --contexify-activeItem-bgColor: #fbedd5;
                    --contexify-rightSlot-color: #6f6e77;
                    --contexify-activeRightSlot-color: #ec913f;
                    --contexify-arrow-color: #6f6e77;
                    --contexify-activeArrow-color: #fff;

                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                        0 2px 4px -2px rgb(0 0 0 / 0.1);
                    padding: 0.5rem 0;
                    gap: 0.5rem;
                }
            `}</style>
        </li>
    );
}
