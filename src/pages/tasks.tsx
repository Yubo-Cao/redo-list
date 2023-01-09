import {
    addTodo,
    selectExtendedEditor,
    todoSetExtendedEditor,
    todoStartEdit
} from "@features/todos/todosSlice";

import Button from "@components/Button";
import { formatDate } from "@components/Date";
import Icon from "@components/Icon";
import Layout from "@components/Layout";
import Sidebar from "@components/Sidebar";

import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";

const TodoList = dynamic(() => import("@features/todos/TodoList"), {
    ssr: false
});
const Editor = dynamic(() => import("@features/todos/TodoEditor"), {
    ssr: false
});

export default function Tasks() {
    const dispatch = useDispatch(),
        extendedEditor = useSelector(selectExtendedEditor);

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
            <TodoList className="mt-4" />
            <Sidebar
                minWidth={256}
                maxWidth={-1}
                onClick={(e) => e.stopPropagation()}
                collapsed={!extendedEditor}
                onCollapse={() => dispatch(todoSetExtendedEditor(false))}
                onExpand={() => dispatch(todoSetExtendedEditor(true))}
            >
                <Editor />
            </Sidebar>
        </Layout>
    );
}
