import { Todo, selectTodoById, updateTodo } from "./todosSlice";
import { fromDuration, toDuration } from "@/components/Date";
import { cls } from "@/lib/utils";
import { AppDispatch } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TodoDuration({
    id,
    className,
    style
}: {
    id: Todo["id"];
    className?: string;
    style?: React.CSSProperties;
}) {
    const { estimatedDuration } = useSelector((state) =>
            selectTodoById(state, id)
        ),
        [duration, setDuration] = useState(toDuration(estimatedDuration)),
        dispatch = useDispatch<AppDispatch>();
    return (
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
            className={cls(
                "text",
                "font-bold",
                "placeholder:text-uim-200",
                "dark:placeholder:text-uim-700",
                "invalid:text-red-500",
                "dark:invalid:text-red-400",
                "block",
                className
            )}
            size={7}
            style={style}
        />
    );
}
