import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function TodoImportant({ id }: { id: Todo["id"] }, ref) {
    const { important } = useSelector((state) => selectTodoById(state, id)),
        dispatch = useDispatch<AppDispatch>();

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
