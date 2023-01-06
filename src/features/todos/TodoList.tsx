import { useSelector } from "react-redux";

import { cls } from "../../lib/utils";
import TodoItem from "./TodoItem";
import { selectTodoIds } from "./todosSlice";

export default function TodoList({ className }: { className?: string }) {
    const todoIds = useSelector(selectTodoIds);

    return (
        <ul className={cls("flex gap-2 flex-col", className)}>
            {todoIds.map((id) => (
                <TodoItem key={id} id={id} />
            ))}
        </ul>
    );
}
