import { cls } from "@lib/utils";

import { formatDate } from "@components/Date";
import Icon from "@components/Icon";

import {
    fetchDocument,
    selectDocumentStatusById,
    selectDocumentSummary
} from "../documents/documentSlice";
import TodoCompleted from "./TodoCompleted";
import TodoDate from "./TodoDate";
import TodoImportant from "./TodoImportant";
import TodoTags from "./TodoTags";
import TodoTitle from "./TodoTitle";
import {
    Todo,
    deleteTodo,
    selectEditTodoId,
    selectTodoById,
    selectTodoCompletedSubtasksCount,
    selectTodoSubtasksCount,
    todoExtendedEditingChanged,
    todoExtendedEditorIdChanged,
    todoStartEdit,
    updateTodo
} from "./todosSlice";
import { pauseEvent } from "@/lib/common";
import { AppDispatch, RootState } from "@/store";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch, useSelector } from "react-redux";

export type TodoItemProps = {
    id: Todo["id"];
    variant?: "main" | "subtask";
    features?: ("important" | "complete")[];
    metas?: ("tags" | "createDate" | "dueDate" | "progress")[];
    onRemove?: (id: Todo["id"]) => void;
    onClick?: (e, id: Todo["id"]) => void;
    onDoubleClick?: (e, id: Todo["id"]) => void;
    className?: string;
    style?: React.CSSProperties;
};

const VARIANT_CLASSNAMES = {
    main: "card hover:bg-uim-50/50 dark:hover:bg-uim-900",
    subtask:
        "bg-uim-50 dark:bg-uim-900 rounded-lg hover:bg-uim-100 dark:hover:bg-uim-800"
};

export default function TodoItem(props: TodoItemProps): JSX.Element {
    let {
        id,
        variant,
        features = ["important", "complete"],
        metas = ["tags", "createDate", "dueDate", "progress"],
        onClick = (e, id) => {
            if (e.button === 2) return;
            setEditing(true);
            pauseEvent(e);
        },
        onDoubleClick = (e, id) => {
            dispatch(todoExtendedEditorIdChanged(id));
            dispatch(todoExtendedEditingChanged(true));
            setEditing(true);
            pauseEvent(e);
        },
        className = "",
        style = {}
    } = props;

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

    // context menu
    const menuId = `todo-${id}-menu`,
        { show } = useContextMenu({ id: menuId }),
        handleContextMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            try {
                show({ event: e });
            } catch (e) {
                console.error(e);
            }
        };

    if (!todo) return null;

    const editing = editTodoId === id,
        setEditing = (value: boolean) => {
            if (value && !editing) dispatch(todoStartEdit(id));
            else if (!value && editing) dispatch(todoStartEdit(null));
        };

    // easy reach metas components
    let { important, tags, createDate, dueDate } = todo;
    const extras: JSX.Element[] = [];
    if (tags.length > 0 && metas.includes("tags"))
        extras.push(
            <TodoTags
                id={id}
                className="text-sm"
                styles={{
                    chipTag: { className: "p-1 h-6 bg-uim-100/75" },
                    chipButton: {
                        className: "h-6 bg-uim-100/75",
                        size: 18
                    }
                }}
                key="tags"
            />
        );
    if (subtaskCount > 0 && metas.includes("progress"))
        extras.push(
            <span key="progress">
                {completedSubtaskCount}/{subtaskCount}
            </span>
        );
    if (createDate && metas.includes("createDate"))
        extras.push(
            <>
                <span className="mr-1">Since</span>
                <TodoDate
                    key="createDate"
                    id={id}
                    field="createDate"
                    clearStyle={true}
                />
            </>
        );
    if (dueDate && metas.includes("dueDate"))
        extras.push(
            <>
                <span className="mr-1">Due </span>
                <TodoDate
                    key="dueDate"
                    id={id}
                    field="dueDate"
                    clearStyle={true}
                />
            </>
        );
    for (let i = extras.length - 1; i > 0; i--)
        extras.splice(
            i,
            0,
            <span key={`sep-${i}`} className={cls("font-black", "mx-2")}>
                ·
            </span>
        );

    return (
        <li
            className={cls(
                "flex items-center gap-4 px-4 py-3 cursor-pointer",
                VARIANT_CLASSNAMES[variant || "main"],
                className
            )}
            onClick={(e) => onClick(e, id)}
            onDoubleClick={(e) => onDoubleClick(e, id)}
            onContextMenu={handleContextMenu}
            tabIndex={0}
            style={style}
        >
            {features?.includes("complete") && <TodoCompleted id={id} />}
            <div className={cls("flex-1", "flex", "flex-col", "min-w-0")}>
                <TodoTitle id={id} className="font-semibold" />
                {description && (
                    <p className={cls("description", metas.length && "mb-2")}>
                        {" "}
                        {description}
                    </p>
                )}
                <div className="flex items-center text-sm text-uim-400">
                    {extras}
                </div>
            </div>
            {features?.includes("important") && <TodoImportant id={id} />}

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
            <style jsx>
                {`
                    .description {
                        @apply text-uim-300 dark:text-uim-600 min-w-0 text-xs 
                        font-normal overflow-hidden text-ellipsis whitespace-nowrap;
                    }
                `}
            </style>
        </li>
    );
}
