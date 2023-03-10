import Button from "@components/Button";
import Icon from "@components/Icon";
import Layout from "@components/Layout";

import Sidebar from "@/components/Sidebar";
import {
    addMyDay,
    deleteMyDay,
    fetchMyDays,
    selectMyDayStatus,
    selectMyDays
} from "@/features/myday/mydaySlice";
import TodoList from "@/features/todos/TodoList";
import {
    fetchTodos,
    selectRootTodoIds,
    selectTodoStatus
} from "@/features/todos/todosSlice";
import { pauseEvent } from "@/lib/common";
import { useAppDispatch, useAppSelector } from "@/store";
import { useState } from "react";

export default function Index() {
    const dispatch = useAppDispatch(),
        mydays = useAppSelector(selectMyDays),
        myDayStatus = useAppSelector(selectMyDayStatus),
        [collapsed, setCollapsed] = useState(true),
        ids = useAppSelector(selectRootTodoIds),
        todoStatus = useAppSelector(selectTodoStatus);

    if (myDayStatus === "needsUpdate") dispatch(fetchMyDays());
    if (todoStatus === "needsUpdate") dispatch(fetchTodos());

    return (
        <Layout activeItemId={"my-day"}>
            <div
                className="flex justify-between items-center"
                onClick={(e) => setCollapsed(true)}
            >
                <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
                    <p>My Day</p>
                    <p className="text-uim-400 text-sm font-normal">Today</p>
                </h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={(e) => {
                        setCollapsed(false);
                        pauseEvent(e);
                    }}
                >
                    <Icon name="add" size={24} />
                    <span>Add task to my day</span>
                </Button>
            </div>
            <TodoList ids={mydays} className="mt-4" />
            <Sidebar
                collapsed={collapsed}
                onCollapse={() => setCollapsed(!collapsed)}
                onExpand={() => setCollapsed(!collapsed)}
                minSize={500}
                size={500}
                maxSize={728}
            >
                <TodoList
                    ids={ids}
                    metas={["dueDate", "tags"]}
                    features={[]}
                    onClick={(e, id) => {
                        dispatch(addMyDay(id));
                    }}
                    itemProps={(id) => {
                        let props: any = {};
                        if (mydays.includes(id)) {
                            props.className = "opacity-50";
                            props.onClick = (e) => {
                                dispatch(deleteMyDay(id));
                            };
                        }
                        return props;
                    }}
                />
            </Sidebar>
        </Layout>
    );
}
