import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { cls } from "../../lib/utils";

import TodoItem from "./TodoItem";
import { fetchTodos, selectTodoIds, selectTodoStatus } from "./todosSlice";

export default function TodoList({ className }: { className?: string }) {
    const dispatch = useDispatch(),
        todoIds = useSelector(selectTodoIds),
        status = useSelector(selectTodoStatus);

    if (status === "needsUpdate") dispatch(fetchTodos() as any);

    return (
        <ul className={cls("flex gap-2 flex-col", className)}>
            {todoIds.map((id) => (
                <TodoItem key={id} id={id} />
            ))}
        </ul>
    );
}
