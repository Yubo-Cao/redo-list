import Button from "@/components/Button";
import Layout from "@/components/Layout";
import NoSsr from "@/components/NoSsr";
import Title from "@/components/Title";
import {
    getAllKanbans,
    selectKanbanStatus,
    sleectAllKanbans
} from "@/features/kanbans/kanbansSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useState } from "react";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable
} from "react-beautiful-dnd";

const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k + offset}-${new Date().getTime()}`,
        content: `item ${k + offset}`
    }));

function reorder<T>(list: T[], src: number, dst: number) {
    const result = Array.from(list),
        [removed] = result.splice(src, 1);
    result.splice(dst, 0, removed);
    return result;
}

function move<T>(
    src: T[],
    dst: T[],
    droppableSrc: { index: number; droppableId: string },
    droppableDst: { index: number; droppableId: string }
) {
    const sc = [...src],
        dc = [...dst],
        [removed] = sc.splice(droppableSrc.index, 1);
    dc.splice(droppableDst.index, 0, removed);
    return {
        [droppableSrc.droppableId]: sc,
        [droppableDst.droppableId]: dc
    };
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

function Dashboard() {
    const [state, setState] = useState([getItems(10), getItems(5, 10)]),
        kanbans = useAppSelector(sleectAllKanbans),
        status = useAppSelector(selectKanbanStatus),
        dispatch = useAppDispatch();

    if (status !== "idle") dispatch(getAllKanbans());

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        if (!destination) return;

        const src: number = +source.droppableId;
        const dst: number = +destination.droppableId;

        if (src === dst) {
            const items = reorder(state[src], source.index, destination.index);
            const newState = [...state];
            newState[src] = items;
            setState(newState);
        } else {
            const result = move(state[src], state[dst], source, destination);
            const newState = [...state];
            newState[src] = result[src];
            newState[dst] = result[dst];
            setState(newState.filter((group) => group.length));
        }
    }

    return (
        <NoSsr>
            <div>
                <Button onClick={() => setState([...state, []])}>
                    Add new board
                </Button>
                <div className="flex">
                    <DragDropContext onDragEnd={onDragEnd}>
                        {state.map((el, ind) => (
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(
                                            snapshot.isDraggingOver
                                        )}
                                        {...provided.droppableProps}
                                    >
                                        {el.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        )}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-around"
                                                            }}
                                                        >
                                                            {item.content}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newState =
                                                                        [
                                                                            ...state
                                                                        ];
                                                                    newState[
                                                                        ind
                                                                    ].splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    setState(
                                                                        newState.filter(
                                                                            (
                                                                                group
                                                                            ) =>
                                                                                group.length
                                                                        )
                                                                    );
                                                                }}
                                                            >
                                                                delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>
            </div>
        </NoSsr>
    );
}

export default function Board() {
    return (
        <Layout activeItemId="dashboard">
            <Title title="Dashboard" />
            <Dashboard />
        </Layout>
    );
}
