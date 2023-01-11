import {
    addTodo,
    fetchTodos,
    selectEditTodoId,
    selectExtendedEditing,
    selectRootTodoIds,
    selectTodoStatus,
    todoExtendedEditingChanged
} from "@features/todos/todosSlice";

import { formatDate } from "@components/Date";
import Layout from "@components/Layout";
import Sidebar from "@components/Sidebar";

import Button from "@/components/Button";
import MDCalendar from "@/components/Calendar";
import Icon from "@/components/Icon";
import Title from "@/components/Title";
import Editor from "@/features/todos/TodoEditor";
import TodoList from "@/features/todos/TodoList";
import { useAppDispatch, useAppSelector } from "@/store";

export default function Tasks() {
    const dispatch = useAppDispatch(),
        editTodoId = useAppSelector(selectEditTodoId),
        ids = useAppSelector(selectRootTodoIds),
        status = useAppSelector(selectTodoStatus),
        extendedEditing = useAppSelector(selectExtendedEditing);

    if (status !== "idle") dispatch(fetchTodos());

    return (
        <Layout activeItemId={"tasks"} sideBarWidth={"22rem"}>
            <Title title="Tasks" subtitle={formatDate(new Date(), false)}>
                <Button
                    content="both"
                    onClick={(e) => dispatch(addTodo({ title: "New task" }))}
                >
                    <Icon name="add" size={24} />
                    <span>New todo</span>
                </Button>
            </Title>
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
