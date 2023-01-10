import {
    Todo,
    selectParentTodosById,
    selectTodoById,
    todoStartEdit
} from "./todosSlice";
import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TodoBreadcrumb({ id }: { id: Todo["id"] }) {
    const dispatch = useDispatch<AppDispatch>();
    const todo = useSelector((state) => selectTodoById(state, id)),
        parentTodos = useSelector(selectParentTodosById(id));

    const todos = [...parentTodos, todo];

    return (
        <>
            <ol className="m-0 p-0 list-none flex">
                {[...Array(todos.length).keys()].map((i) => {
                    const todo = todos[i],
                        last = i === todos.length - 1;

                    return (
                        <Fragment>
                            <li
                                onClick={() => {
                                    dispatch(todoStartEdit(todo.id));
                                }}
                                key={`${todo.id}`}
                                className={
                                    last
                                        ? "flex-1 whitespace-nowrap text-pri-500"
                                        : "shrink-1 grow-0 basis-auto cursor-pointer overflow-hidden text-ellipsis text-uim-500 whitespace-nowrap"
                                }
                            >
                                {todo.title}
                            </li>
                            {!last && (
                                <li
                                    className="flex-none text-uim-500"
                                    key={`${todo.id}-sep`}
                                >
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
