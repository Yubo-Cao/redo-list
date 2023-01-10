import Icon from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/store";
import { Fragment } from "react";
import {
    Todo,
    selectParentTodosById,
    selectTodoById,
    todoStartEdit
} from "./todosSlice";

export default function TodoBreadcrumb({ id }: { id: Todo["id"] }) {
    const dispatch = useAppDispatch();
    const todo = useAppSelector((state) => selectTodoById(state, id)),
        parentTodos = useAppSelector(selectParentTodosById(id));

    const todos = [...parentTodos, todo];

    return (
        <>
            <ol className="m-0 p-0 list-none flex">
                {[...Array(todos.length).keys()].map((i) => {
                    const todo = todos[i],
                        last = i === todos.length - 1;

                    return (
                        <Fragment key={`${todo.id}`}>
                            <li
                                onClick={() => {
                                    dispatch(todoStartEdit(todo.id));
                                }}
                                className={
                                    last
                                        ? "flex-1 whitespace-nowrap font-semibold"
                                        : "shrink-1 grow-0 basis-auto cursor-pointer overflow-hidden text-ellipsis text-uim-500 whitespace-nowrap"
                                }
                            >
                                {todo.title}
                            </li>
                            {!last && (
                                <li className="flex-none text-uim-500">
                                    <Icon
                                        name="chevron_right"
                                        size={24}
                                        wrap={true}
                                    />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </>
    );
}
