import { fromDuration, toDuration } from "@/components/Date";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Todo, selectTodoById, updateTodo } from "./todosSlice";

export default function TodoDuration({ id }: { id: Todo["id"] }) {
    const { estimatedDuration } = useSelector((state) =>
            selectTodoById(state, id)
        ),
        [duration, setDuration] = useState(toDuration(estimatedDuration)),
        dispatch = useDispatch<AppDispatch>();
    return (
        <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
                <Icon name="timer" size={24} />
                <span className="text">Duration:</span>
            </div>
            <input
                type="text"
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                placeholder="00:00:00"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (!e.currentTarget.checkValidity()) return;
                        dispatch(
                            updateTodo({
                                id,
                                update: {
                                    estimatedDuration: fromDuration(duration)
                                }
                            })
                        );
                    }
                }}
                className="text font-bold placeholder:text-uim-200 dark:placeholder:text-uim-700 invalid:text-red-500 dark:invalid:text-red-400"
            />
        </div>
    );
}
