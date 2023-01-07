import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

import { Sidebar } from "@features/todos/TodoEditor";
import { addTodo, todoStartEdit } from "@features/todos/todosSlice";

import Button from "@components/Button";
import { formatDate } from "@components/Date";
import Icon from "@components/Icon";
import Layout from "@components/Layout";

const TodoList = dynamic(() => import("../features/todos/TodoList"), {
    ssr: false
});

export default function Tasks() {
    const dispatch = useDispatch();

    return (
        <Layout
            activeItemId={"tasks"}
            sideBarWidth={"22rem"}
            sideBarChildren={<Sidebar />}
        >
            <div
                onClick={() => dispatch(todoStartEdit(null))}
                className="w-full h-full"
            >
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
                    >
                        <Icon name="add" size={24} />
                        <span>new Task</span>
                    </Button>
                </div>
                <TodoList className="mt-4" />
            </div>
        </Layout>
    );
}
