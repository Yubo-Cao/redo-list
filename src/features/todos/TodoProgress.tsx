import {
    Todo,
    selectTodoCompletedSubtasksCount,
    selectTodoSubtasksCount
} from "./todosSlice";
import { RootState, useAppSelector } from "@/store";

export default function TodoProgress({ id }: { id: Todo["id"] }) {
    const completed = useAppSelector((state: RootState) =>
            selectTodoCompletedSubtasksCount(state, id)
        ),
        total = useAppSelector((state: RootState) =>
            selectTodoSubtasksCount(state, id)
        );
}
