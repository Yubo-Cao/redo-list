import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/store";
import { forwardRef } from "react";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";

export default function TodoImportant({ id }: { id: Todo["id"] }, ref) {
    const { important } = useAppSelector((state) => selectTodoById(state, id)),
        dispatch = useAppDispatch();

    return (
        <Button
            onClick={(e) => {
                dispatch(
                    updateTodo({
                        id,
                        update: { important: !important }
                    })
                );
                e.stopPropagation();
            }}
            content="icon"
            variant="none"
            padding={false}
            accent={important ? "pri" : "uim"}
        >
            <Icon name="star" size={24} fill={true} />
        </Button>
    );
}

const ForwardedTodoImportant = forwardRef(TodoImportant);
export { TodoImportant, ForwardedTodoImportant };
