import {
    TransparentInput,
    TransparentInputProps
} from "@/components/TransparentInput";
import { useAppDispatch, useAppSelector } from "@/store";
import { forwardRef } from "react";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";

function TodoTitle(
    { id, ...rest }: { id: Todo["id"] } & TransparentInputProps,
    ref?: React.RefObject<HTMLInputElement>
) {
    const todo = useAppSelector((state) => selectTodoById(state, id)),
        { title } = todo,
        dispatch = useAppDispatch();

    return (
        <TransparentInput
            value={title}
            onChange={(value) =>
                dispatch(updateTodo({ id, update: { title: value } }))
            }
            {...rest}
        />
    );
}

const ForwardedTodoTitle = forwardRef(TodoTitle);
export default ForwardedTodoTitle;
export { TodoTitle, ForwardedTodoTitle };
