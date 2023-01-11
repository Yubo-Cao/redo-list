import { addKanban } from "./kanbansSlice";
import Icon from "@/components/Icon";
import { cls } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import React from "react";

export type AddKanbanProps = {
    className?: string;
    style?: React.CSSProperties;
};

const AddKanban: React.FC<AddKanbanProps> = ({ className, style }) => {
    const dispatch = useAppDispatch();

    return (
        <button
            className={cls(
                "border-2 border-uim-200 dark:border-uim-700 border-dashed rounded-md text",
                "hover:bg-uim-50 dark:hover:bg-uim-900",
                "flex-col center",
                className
            )}
            style={style}
            onClick={(e) => dispatch(addKanban("New kanban"))}
        >
            <Icon size={48} name="add" />
            <p>New kanban</p>
        </button>
    );
};

export default AddKanban;
