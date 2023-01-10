import TodoItem, { TodoItemProps } from "@features/todos/TodoItem";
import { Todo } from "@features/todos/todosSlice";

import { cls } from "@lib/utils";

export type TodoListProps = Omit<TodoItemProps, "id"> & {
    ids: Todo["id"][];
    className?: string;
    style?: React.CSSProperties;
};

export default function TodoList({
    ids,
    className,
    style,
    ...rest
}: TodoListProps) {
    return (
        <ul className={cls("flex gap-2 flex-col", className)}>
            {ids.map((id) => (
                <TodoItem key={id} id={id} {...rest} />
            ))}
        </ul>
    );
}
