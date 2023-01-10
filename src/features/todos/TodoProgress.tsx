import {
    Todo,
    selectTodoCompletedSubtasksCount,
    selectTodoSubtasksCount
} from "./todosSlice";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function TodoProgress({ id }: { id: Todo["id"] }) {
    const completed = useSelector((state: RootState) =>
            selectTodoCompletedSubtasksCount(state, id)
        ),
        total = useSelector((state: RootState) =>
            selectTodoSubtasksCount(state, id)
        );
}
