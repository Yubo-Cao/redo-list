import AddKanban from "./AddKanban";
import KanbanItem from "./KanbanItem";
import {
    Kanban,
    addTodoToKanban,
    moveTodoInKanban,
    removeTodoFromKanban
} from "./kanbansSlice";
import { cls } from "@/lib/utils";
import { AppDispatch, useAppDispatch } from "@/store";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

export type KanbansProps = {
    ids: Kanban["id"][];
    className?: string;
    style?: React.CSSProperties;
};

const handleEnd = (dispatch: AppDispatch) => (result: DropResult) => {
    const { source: src, destination: dst } = result;
    if (!dst) return;
    const srcId = src.droppableId,
        dstId = dst.droppableId;

    if (srcId === dstId) {
        dispatch(
            moveTodoInKanban({
                kanbanId: parseInt(srcId.replace("kanban-", "")),
                todoId: parseInt(result.draggableId.replace("task-", "")),
                index: dst.index
            })
        );
    } else {
        dispatch(
            removeTodoFromKanban({
                kanbanId: parseInt(srcId.replace("kanban-", "")),
                todoId: parseInt(result.draggableId.replace("task-", ""))
            })
        );
        dispatch(
            addTodoToKanban({
                kanbanId: parseInt(dstId.replace("kanban-", "")),
                todoId: parseInt(result.draggableId.replace("task-", ""))
            })
        );
        dispatch(
            moveTodoInKanban({
                kanbanId: parseInt(dstId.replace("kanban-", "")),
                todoId: parseInt(result.draggableId.replace("task-", "")),
                index: dst.index
            })
        );
    }
};

const Kanbans: React.FC<KanbansProps> = ({ ids, className, ...rest }) => {
    const dispatch = useAppDispatch();

    return (
        <DragDropContext onDragEnd={handleEnd(dispatch)}>
            <ul className={cls("kanbans", className)} {...rest}>
                {ids.map((id) => (
                    <KanbanItem
                        id={id}
                        key={id}
                        className="snap-start"
                        style={{ height: "calc(100%)" }}
                    />
                ))}
                <AddKanban
                    style={{ height: "calc(100%)" }}
                    className="snap-start"
                />
            </ul>
            <style jsx>{`
                .kanbans {
                    grid-auto-rows: calc(100%);
                    @apply grid grid-cols-fit-72 gap-6 h-full overflow-x-auto overflow-auto snap-y snap-mandatory items-center py-1;

                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    &::-webkit-scrollbar {
                        display: none;
                    }
                }
            `}</style>
        </DragDropContext>
    );
};

export default Kanbans;
