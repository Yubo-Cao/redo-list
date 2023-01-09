import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import Checkbox from "@/components/Checkbox";
import { AppDispatch } from "@/store";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function todoCompleted({ id }: { id: Todo["id"] }, ref) {
    const todo = useSelector((state) => selectTodoById(state, id)),
        dispatch = useDispatch<AppDispatch>();
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

export default forwardRef(todoCompleted);
