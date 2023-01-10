import Checkbox from "@/components/Checkbox";
import { useAppDispatch, useAppSelector } from "@/store";
import { forwardRef } from "react";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";

function TodoCompleted({ id }: { id: Todo["id"] }, ref) {
    const todo = useAppSelector((state) => selectTodoById(state, id)),
        dispatch = useAppDispatch();
    const { completed } = todo;
    return (
        <Checkbox
            checked={completed}
            onChange={() =>
                dispatch(updateTodo({ id, update: { completed: !completed } }))
            }
            onClick={(e) => e.stopPropagation()}
            ref={ref}
            className="flex-shrink-0"
        />
    );
}

const ForwardedTodoCompleted = forwardRef(TodoCompleted);
export default ForwardedTodoCompleted;
export { TodoCompleted, ForwardedTodoCompleted };
