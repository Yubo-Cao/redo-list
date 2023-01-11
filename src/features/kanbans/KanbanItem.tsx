import { TransparentEditor } from "../documents/TransparentEditor";
import TodoItem from "../todos/TodoItem";
import TodoMultiselect from "../todos/TodoMultiselect";
import {
    Kanban,
    currentKanbanChanged,
    defaultKanban,
    deleteKanban,
    selectKanbanById
} from "./kanbansSlice";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { TransparentInput } from "@/components/TransparentInput";
import {
    selectAllKanbans,
    updateKanban
} from "@/features/kanbans/kanbansSlice";
import { Todo, selectRootTodoIds } from "@/features/todos/todosSlice";
import { cls } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import React, { forwardRef } from "react";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import { Item, Menu, useContextMenu } from "react-contexify";

export type KanbanProps = {
    id: Kanban["id"];
    provided: DroppableProvided;
    className?: string;
    style?: React.CSSProperties;
};

const KanbanItem = ({ id, className, style, provided, ...rest }, ref) => {
    const dispatch = useAppDispatch();

    // kanban
    const kanban = useAppSelector((state) => selectKanbanById(state, id)),
        { title, description, tasks } = kanban || defaultKanban;

    // contexify
    const menuId = `kanban-menu-${id}`,
        { show } = useContextMenu({ id: menuId }),
        handleMenu = (e) => {
            try {
                show({ event: e });
            } catch (e) {
                console.error(e);
            }
        };

    // expand
    const [exapnded, setExpanded] = React.useState(false);

    // capable of being todo
    const todoIds = useAppSelector((state) => {
        const kanbans = selectAllKanbans(state),
            usedTodos = new Set(
                kanbans.reduce((acc, kanban) => {
                    if (kanban.id !== id) acc.push(...kanban.tasks);
                    return acc;
                }, [])
            );
        return selectRootTodoIds(state).filter((id) => !usedTodos.has(id));
    });

    if (!kanban) return null;

    const IconButton = (
        icon: string,
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    ) => (
        <Button
            content="icon"
            accent="none"
            onClick={onClick}
            ring={false}
            className="text hover:bg-uim-50 dark:hover:bg-uim-800"
        >
            <Icon name={icon} size={18} />
        </Button>
    );

    return (
        <li
            className={cls(
                "kanban-item card clickable p-4 flex flex-col",
                className
            )}
            onContextMenu={handleMenu}
            ref={ref}
            style={style}
            onClick={(e) => dispatch(currentKanbanChanged(id))}
        >
            <div className="flex justify-between">
                <TransparentInput
                    value={title}
                    onChange={(value) =>
                        dispatch(updateKanban({ id, update: { title: value } }))
                    }
                    className="text-xl font-medium"
                />
                {IconButton("more_horiz", (e) => setExpanded(!exapnded))}
            </div>
            <TransparentEditor
                id={description}
                placeholder="Add description..."
                className={cls(exapnded && "expanded", exapnded || "collapsed")}
            />
            <div className="flex flex-col gap-2 flex-1">
                <Droppable key={id} droppableId={`kanban-${id}`}>
                    {(provided, snapshot) => (
                        <ul
                            className={cls(
                                "flex gap-2 flex-col h-32 flex-1 overflow-y-auto",
                                className
                            )}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {tasks.map((id, idx) => (
                                <Draggable
                                    key={id}
                                    draggableId={`task-${id}`}
                                    index={idx}
                                >
                                    {(provided) => (
                                        <TodoItem
                                            id={id}
                                            ref={provided.innerRef}
                                            metas={["dueDate"]}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        />
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
                <TodoMultiselect
                    ids={todoIds}
                    value={tasks}
                    onChange={(e: Todo["id"][]) => {
                        dispatch(
                            updateKanban({
                                id,
                                update: { tasks: e }
                            })
                        );
                    }}
                />
            </div>
            <Menu
                id={menuId}
                theme="accent"
                className="kanban-menu bg-light-surface dark:bg-dark-surface dark:border"
            >
                <Item id="delete" onClick={() => dispatch(deleteKanban(id))}>
                    <div className="flex gap-1 items-center">
                        <Icon name="delete" size={16} />
                        <span>Delete</span>
                    </div>
                </Item>
            </Menu>
            <style global jsx>
                {`
                    .kanban-menu {
                        --contexify-menu-minWidth: 12rem;
                        --contexify-activeItem-bgColor: transparent;
                        --contexify-menu-padding: 0.5rem 1rem;
                    }

                    .kanban-item .collapsed {
                        clip-path: polygon(0 0, 100% 0%, 100% 0, 0 0);
                        @apply absolute;
                    }

                    .kanban-item .collapsed + *::before {
                        content: "";
                        @apply h-0.5 w-full bg-uim-500 dark:bg-uim-400;
                    }

                    .kanban-item .expanded {
                        clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%);
                    }
                `}
            </style>
        </li>
    );
};

export default forwardRef(KanbanItem);
