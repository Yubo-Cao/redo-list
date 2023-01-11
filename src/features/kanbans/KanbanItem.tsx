import { TransparentEditor } from "../documents/TransparentEditor";
import TodoList from "../todos/TodoList";
import {
    Kanban,
    defaultKanban,
    deleteKanban,
    kanbanUpdated,
    selectKanbanById
} from "./kanbansSlice";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { TransparentInput } from "@/components/TransparentInput";
import { cls } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import React from "react";
import { Item, Menu, useContextMenu } from "react-contexify";

export type KanbanProps = Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & {
    id: Kanban["id"];
};

export const KanbanItem: React.FC<KanbanProps> = ({
    id,
    className,
    ...props
}: KanbanProps) => {
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
        <div
            className={cls("card p-4", cls(className))}
            onContextMenu={handleMenu}
            {...props}
        >
            <div className="flex justify-between">
                <TransparentInput
                    value={title}
                    onChange={(value) =>
                        dispatch(
                            kanbanUpdated({ id, update: { title: value } })
                        )
                    }
                    className="text-xl font-medium"
                />
                {IconButton("more_horiz", (e) => setExpanded(!exapnded))}
            </div>
            <TransparentEditor id={description} />
            <TodoList ids={tasks} />
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
            <style jsx>
                {`
                    :global(.kanban-menu) {
                        --contexify-menu-minWidth: 12rem;
                        --contexify-activeItem-bgColor: transparent;
                        --contexify-menu-padding: 0.5rem 1rem;
                    }

                    .collapsed {
                        clip-path: polygon(0 0, 100% 0%, 100% 0, 0 0);
                    }

                    .expanded {
                        clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%);
                    }
                `}
            </style>
        </div>
    );
};
