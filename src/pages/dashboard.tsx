import Layout from "@/components/Layout";
import NoSsr from "@/components/NoSsr";
import Sidebar from "@/components/Sidebar";
import Title from "@/components/Title";
import Kanbans from "@/features/kanbans/Kanbans";
import {
    addTodoToKanban,
    getAllKanbans,
    removeTodoFromKanban,
    selectAllKanbanIds,
    selectAllKanbans,
    selectCurrentKanbanId,
    selectKanbanById,
    selectKanbanStatus
} from "@/features/kanbans/kanbansSlice";
import TodoList from "@/features/todos/TodoList";
import {
    fetchTodos,
    selectRootTodoIds,
    selectTodoStatus
} from "@/features/todos/todosSlice";
import { useAppDispatch, useAppSelector } from "@/store";

function Dashboard() {
    const kanbans = useAppSelector(selectAllKanbanIds),
        status = useAppSelector(selectKanbanStatus),
        dispatch = useAppDispatch();

    if (status !== "idle") dispatch(getAllKanbans());

    return (
        <NoSsr>
            <Kanbans ids={kanbans} className="m-4 flex-1" />
        </NoSsr>
    );
}

export default function Board() {
    const dispatch = useAppDispatch(),
        currentKanbanId = useAppSelector(selectCurrentKanbanId),
        todoIds = useAppSelector((state) => {
            const kanbans = selectAllKanbans(state),
                usedTodos = new Set(
                    kanbans.reduce((acc, kanban) => {
                        if (kanban.id !== currentKanbanId)
                            acc.push(...kanban.tasks);
                        return acc;
                    }, [])
                );
            return selectRootTodoIds(state).filter((id) => !usedTodos.has(id));
        }),
        currentKanbanTodoIds = useAppSelector(
            (state) => selectKanbanById(state, currentKanbanId)?.tasks
        ),
        todoStatus = useAppSelector(selectTodoStatus),
        kanbanStatus = useAppSelector(selectKanbanStatus);

    if (todoStatus !== "idle") dispatch(fetchTodos());
    if (kanbanStatus !== "idle") dispatch(getAllKanbans());

    return (
        <Layout activeItemId="dashboard">
            <div className="flex flex-col h-full">
                <Title title="Dashboard" />
                <Dashboard />
            </div>
            <Sidebar
                size={512}
                minSize={256}
                maxSize={768}
                onClick={(e) => e.stopPropagation()}
            >
                <TodoList
                    ids={todoIds}
                    metas={["dueDate", "tags"]}
                    features={[]}
                    onClick={(e, id) =>
                        dispatch(
                            addTodoToKanban({
                                kanbanId: currentKanbanId,
                                todoId: id
                            })
                        )
                    }
                    itemProps={(id) => {
                        let props: any = {};
                        if (currentKanbanTodoIds?.includes(id)) {
                            props.className = "opacity-50";
                            props.onClick = (e) => {
                                dispatch(
                                    removeTodoFromKanban({
                                        kanbanId: currentKanbanId,
                                        todoId: id
                                    })
                                );
                            };
                        }
                        return props;
                    }}
                />
            </Sidebar>
        </Layout>
    );
}
