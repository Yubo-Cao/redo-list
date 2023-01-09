import { Todo, selectTodoById, updateTodo } from "@features/todos/todosSlice";

import Chip from "@/components/Chip";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TodoTags({ id }: { id: Todo["id"] }) {
    const { tags } = useSelector((state) => selectTodoById(state, id)),
        [tag, setTag] = useState(""),
        [editingTag, setEditingTag] = useState(false),
        dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
                <Chip
                    key={tag}
                    deleteable={true}
                    onDelete={() => {
                        dispatch(
                            updateTodo({
                                id,
                                update: {
                                    tags: tags.filter((t) => t !== tag)
                                }
                            })
                        );
                    }}
                >
                    {tag}
                </Chip>
            ))}
            {editingTag && (
                <Chip>
                    <input
                        autoFocus
                        type="text"
                        value={tag}
                        onChange={(e) => {
                            setTag(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                dispatch(
                                    updateTodo({
                                        id,
                                        update: {
                                            tags: [
                                                ...new Set([
                                                    ...tags,
                                                    tag.trim()
                                                ])
                                            ]
                                        }
                                    })
                                );
                                setTag("");
                                setEditingTag(false);
                            }
                        }}
                        size={5}
                    />
                </Chip>
            )}
            <Chip
                style={{ padding: 2 }}
                className="h-6 w-6 hover:bg-pri-500 cursor-pointer"
                onClick={() => setEditingTag(true)}
            >
                <Icon name="add" size={18} />
            </Chip>
        </div>
    );
}
