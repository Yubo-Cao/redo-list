import { TransparentEditor } from "../documents/TransparentEditor";
import { Todo, selectTodoById } from "./todosSlice";
import { useAppSelector } from "@/store";

export default function TodoDescription({ id }: { id: Todo["id"] }) {
    const todo = useAppSelector((state) => selectTodoById(state, id)),
        { description } = todo;

    return (
        <TransparentEditor id={description} placeholder="Add description..." />
    );
}
