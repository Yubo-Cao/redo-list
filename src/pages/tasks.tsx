import {
    addTodo,
    fetchTodos,
    selectEditTodoId,
    selectExtendedEditing,
    selectRootTodoIds,
    selectTodoStatus,
    todoExtendedEditingChanged
} from "@features/todos/todosSlice";

import Button from "@components/Button";
import { formatDate } from "@components/Date";
import Icon from "@components/Icon";
import Layout from "@components/Layout";
import Sidebar from "@components/Sidebar";

import MDCalendar from "@/components/Calendar";
import { useAppDispatch, useAppSelector } from "@/store";
import dynamic from "next/dynamic";

const TodoList = dynamic(() => import("@features/todos/TodoList"), {
    ssr: false
});
const Editor = dynamic(() => import("@features/todos/TodoEditor"), {
    ssr: false
});

export default function Tasks() {
    const dispatch = useAppDispatch(),
        editTodoId = useAppSelector(selectEditTodoId),
        ids = useAppSelector(selectRootTodoIds),
        status = useAppSelector(selectTodoStatus),
        extendedEditing = useAppSelector(selectExtendedEditing);

    if (status !== "idle") dispatch(fetchTodos());

    return (
        <Layout activeItemId={"tasks"} sideBarWidth={"22rem"}>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
                    <p>Tasks</p>
                    <p className="text-uim-400 text-sm font-normal">
                        {formatDate(new Date())}
                    </p>
                </h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => {
                        dispatch(addTodo({}) as any);
                    }}
                    content="both"
                >
                    <Icon name="add" size={24} />
                    <span>New Task</span>
                </Button>
            </div>
            <TodoList className="mt-4" ids={ids} />
            <Sidebar
                width={512}
                minWidth={256}
                maxWidth={768}
                onClick={(e) => e.stopPropagation()}
                collapsed={!extendedEditing}
                onCollapse={() => dispatch(todoExtendedEditingChanged(false))}
                onExpand={() => dispatch(todoExtendedEditingChanged(true))}
            >
                {editTodoId == null ? (
                    <>
                        <MDCalendar />
                    </>
                ) : (
                    <Editor id={editTodoId} />
                )}
            </Sidebar>
        </Layout>
    );
}
