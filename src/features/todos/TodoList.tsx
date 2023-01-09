import TodoItem from "@features/todos/TodoItem";

import { cls } from "@lib/utils";

import { Todo } from "@features/todos/todosSlice";

export default function TodoList({
    ids,
    className
}: {
    ids: Todo["id"][];
    className?: string;
}) {
    return (
        <ul className={cls("flex gap-2 flex-col", className)}>
            {ids.map((id) => (
                <TodoItem key={id} id={id} />
            ))}
        </ul>
    );
}
