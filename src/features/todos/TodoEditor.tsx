import {
    Todo,
    selectEditTodoId,
    selectTodoById
} from "@features/todos/todosSlice";

import "bytemd/dist/index.css";

import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import TodoCompleted from "./TodoCompleted";
import TodoDescription from "./TodoDescription";
import TodoTitle from "./TodoTitle";

import { useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import TodoDate from "./TodoDate";

export default function EditorSidebar() {
    const editTodoId = useSelector(selectEditTodoId),
        todo: Todo = useSelector((state) => selectTodoById(state, editTodoId)),
        dispatch = useDispatch<AppDispatch>();

    const menu_id = "todo-editor-menu",
        { show } = useContextMenu({ id: menu_id }),
        handleMenu = (e) => show({ event: e });

    if (!todo) return null;

    const id = editTodoId;

    let {
        title,
        description,
        important,
        completed,
        tags,
        createDate,
        dueDate,
        importance
    } = todo;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 outlined-card">
                <TodoCompleted id={id} />
                <TodoTitle id={id} />
            </div>
            <div className="outlined-card py-2">
                <TodoDescription id={id} />
            </div>
            <div className="outlined-card space-y-2">
                <TodoDate
                    id={id}
                    field="createDate"
                    label={
                        <>
                            <Icon
                                name="schedule"
                                className="flex-0 text"
                                size={24}
                                wrap={true}
                            />
                            <span className="flex-0 text">Create date:</span>
                        </>
                    }
                />
                <TodoDate
                    id={id}
                    field="dueDate"
                    label={
                        <>
                            <Icon
                                name="pending_actions"
                                className="flex-0 text"
                                size={24}
                                wrap={true}
                            />
                            <span className="flex-0 text">Due date:</span>
                        </>
                    }
                />
            </div>

            <style jsx>{`
                .outlined-card {
                    @apply border border-uim-300 dark:border-uim-700 rounded-lg px-3 py-4;
                }
            `}</style>
        </div>
    );
}
