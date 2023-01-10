import { Todo, selectTodoById, updateTodo } from "@features/todos/todosSlice";

import Chip from "@/components/Chip";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cls } from "@/lib/utils";
import { ChipProps } from "@/components/Chip";

export type TodoTagsProps = {
    id: Todo["id"];
    className?: string;
    styles?: {
        chipButton?: Omit<ChipProps, "children"> & { size?: number };
        chipTag?: Omit<ChipProps, "children">;
    };
};

export default function TodoTags({ id, className, styles }: TodoTagsProps) {
    const { tags } = useSelector((state) => selectTodoById(state, id)),
        [editingTag, setEditingTag] = useState(""),
        [addingTag, setAddingTag] = useState(false),
        [editingTags, setEditingTags] = useState<{ [key: string]: boolean }>(
            Object.fromEntries(tags.map((tag) => [tag, false]))
        ),
        dispatch = useDispatch<AppDispatch>();

    const deleteTag = (tag: string) => {
        dispatch(
            updateTodo({
                id,
                update: {
                    tags: tags.filter((t) => t !== tag)
                }
            })
        );
    };

    const startEditTag = (tag: string) => {
        setEditingTag(tag);
        setEditingTags({
            ...editingTags,
            [tag]: true
        });
    };

    const stopEditingTag = (oldTag: string) => {
        dispatch(
            updateTodo({
                id,
                update: {
                    tags: [
                        ...new Set(
                            [...tags, editingTag.trim()].filter(
                                (i) => i != oldTag
                            )
                        )
                    ]
                }
            })
        );
        setEditingTag("");
        setEditingTags({
            ...editingTags,
            [oldTag]: undefined
        });
    };

    return (
        <div className={cls("flex flex-wrap gap-1", className)}>
            {[...Array(tags.length).keys()].map((i) => (
                <Chip
                    key={tags[i]}
                    deleteable={true}
                    onDelete={() => deleteTag(tags[i])}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (editingTags[tags[i]]) return;
                        if (e.key === "Enter" || e.key === " ")
                            startEditTag(tags[i]);
                        else if (e.key === "Backspace" || e.key === "Delete")
                            deleteTag(tags[i]);
                    }}
                    onClick={() => startEditTag(tags[i])}
                    {...styles?.chipTag}
                >
                    {editingTags[tags[i]] ? (
                        <input
                            autoFocus
                            type="text"
                            value={editingTag}
                            onChange={(e) => setEditingTag(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && stopEditingTag(tags[i])
                            }
                            size={5}
                        />
                    ) : (
                        <span>{tags[i]}</span>
                    )}
                </Chip>
            ))}
            {addingTag && (
                <Chip {...styles?.chipTag}>
                    <input
                        autoFocus
                        type="text"
                        value={editingTag}
                        onChange={(e) => {
                            setEditingTag(e.target.value);
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
                                                    editingTag.trim()
                                                ])
                                            ]
                                        }
                                    })
                                );
                                setEditingTag("");
                                setAddingTag(false);
                            }
                        }}
                        size={5}
                    />
                </Chip>
            )}
            <Chip
                style={{ padding: 2 }}
                className="h-8 w-8 cursor-pointer"
                onClick={() => setAddingTag(true)}
                tabIndex={0}
                onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setAddingTag(true)
                }
                {...styles?.chipButton}
            >
                <Icon name="add" size={styles?.chipButton?.size || 24} />
            </Chip>
        </div>
    );
}
