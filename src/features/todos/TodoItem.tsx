import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo, deleteTodo } from "./todosSlice";

import { cls } from "@lib/utils";

import { formatDate } from "@components/Date";
import Icon from "@components/Icon";

import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

import {
    Todo,
    selectEditTodoId,
    selectTodoById,
    selectTodoSubtaskCompleteTotal,
    selectTodoSubtaskTotal,
    todoStartEdit
} from "./todosSlice";

export default function TodoItem({ id }: { id: Todo["id"] }) {
    const todo: Todo = useSelector((state) => selectTodoById(state, id)),
        dispatch = useDispatch(),
        subtaskCount = useSelector(selectTodoSubtaskTotal(id)),
        subtaskCompleteCount = useSelector(selectTodoSubtaskCompleteTotal(id)),
        editTodoId = useSelector(selectEditTodoId),
        menuId = `todo-${id}-menu`,
        { show } = useContextMenu({ id: menuId });

    const _wrap =
        <T,>(name: string, hook?: (T) => any) =>
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

    const completedRef = useRef(null),
        titleRef = useRef(null),
        descriptionRef = useRef(null),
        importantRef = useRef(null);

    const editing = editTodoId === id,
        setEditing = (value: boolean) => {
            if (value && !editing) dispatch(todoStartEdit(id));
            else if (!value && editing) dispatch(todoStartEdit(null));
        };

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
    const setImportant = _wrap("important"),
        setCompleted = _wrap("completed"),
        setTitle = _wrap("title"),
        setDescription = _wrap("description");

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

    const Title = () => {
        const style = cls(
            "font-semibold",
            "text-light-text dark:text-dark-text",
            RESETTER
        );

        return editing ? (
            <input
                type="text"
                value={title}
                className={style}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        descriptionRef.current?.focus();
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                placeholder="Title of the task"
                ref={titleRef}
            />
        ) : (
            <p className={style} ref={titleRef}>
                {title}
            </p>
        );
    };

    const Description = () => {
        const style = cls("text-uim-400", "text-sm", "text-ellipsis", RESETTER);
        return editing ? (
            <input
                type="text"
                value={description}
                className={style}
                onChange={(e) => setDescription(e.target.value)}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                placeholder="Description of the task"
                ref={descriptionRef}
            />
        ) : (
            <p className={style} ref={descriptionRef}>
                {description}
            </p>
        );
    };

    const Completed = () => (
        <input
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted(!completed)}
            onClick={(e) => e.stopPropagation()}
            className={cls(
                "w-5 h-5",
                "rounded-lg",
                "text-pri-500 checked:bg-pri-500 hover:border-pri-400",
                "dark:bg-dark-surface dark:checked:bg-pri-500 dark:border-uim-500",
                "focus:border-pri-400 focus:ring-0 focus:ring-transparent"
            )}
            ref={completedRef}
        />
    );

    const Important = () => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                setImportant(!important);
            }}
            className={cls(
                "flex justify-center items-center",
                "rounded-full p-1",
                "focus:outline-0 focus:ring-1 focus:ring-pri-400 dark:focus:ring-uim-500",
                important
                    ? "hover:bg-pri-100 dark:hover:bg-pri-600/50"
                    : "hover:bg-uim-100 dark:hover:bg-uim-900"
            )}
            ref={importantRef}
        >
            <Icon
                name="star"
                size={24}
                fill={true}
                className={cls(
                    important
                        ? "text-pri-400"
                        : "text-uim-400 dark:text-dark-text",
                    "transition-colors"
                )}
            />
        </button>
    );

    return (
        <li
            className={cls(
                "flex items-center gap-4 px-4 py-3 rounded-lg",
                "shadow dark:border dark:border-uim-500",
                "bg-light-surface dark:bg-dark-surface",
                "hover:bg-uim-50/50 dark:hover:bg-uim-900",
                "cursor-pointer",
                "todo-item",
                editing && "editing"
            )}
            onClick={(e) => {
                if (e.target === completedRef.current) return;
                setEditing(true);
            }}
            onContextMenu={handleContextMenu}
            tabIndex={0}
            onFocus={() => setEditing(true)}
        >
            {Completed()}
            <div className={cls("flex-1", "flex", "flex-col")}>
                {Title()}
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
                    {dueDate && (
                        <span className="text-pri-400 mr-1">
                            {dueDate && formatDate(dueDate)}
                        </span>
                    )}
                </div>
            </div>
            {Important()}
            <style jsx>{`
                :global(*:focus),
                :global(.editing) {
                    outline: 1px solid #fb923c;
                    box-shadow: 0 2px 3px -1px #fb923c, 0 1px 2px -2px #fb923c;
                }

                :global([type="text"]:focus) {
                    outline: none;
                    box-shadow: none;
                }
            `}</style>
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
                <Item id="important" onClick={() => setImportant(!important)}>
                    <div className="flex gap-1 items-center">
                        <Icon name="star" size={16} />
                        <span>Mark as important</span>
                    </div>
                </Item>
            </Menu>
            <style jsx>{`
                :global(.todo-item *:focus),
                :global(.todo-item .editing) {
                    outline: 1px solid #fb923c;
                    box-shadow: 0 2px 3px -1px #fb923c, 0 1px 2px -2px #fb923c;
                }

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
