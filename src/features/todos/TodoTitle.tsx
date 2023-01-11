import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import {
    TransparentInput,
    TransparentInputProps
} from "@/components/TransparentInput";
import { useAppDispatch, useAppSelector } from "@/store";

export default function TodoTitle({
    id,
    ...rest
}: { id: Todo["id"] } & Omit<TransparentInputProps, "value" | "onChange">) {
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
