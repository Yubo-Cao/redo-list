import {
    Todo,
    addTodo,
    selectRootTodoIds,
    selectTodoById,
    updateTodo
} from "@features/todos/todosSlice";

import TodoBreadcrumb from "./TodoBreadcrumb";
import TodoCompleted from "./TodoCompleted";
import TodoDate from "./TodoDate";
import TodoDuration from "./TodoDuration";
import TodoImportant from "./TodoImportant";
import TodoList from "./TodoList";
import TodoMultiselect from "./TodoMultiselect";
import TodoTags from "./TodoTags";
import TodoTitle from "./TodoTitle";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import NoSsr from "@/components/NoSsr";
import { useAppDispatch, useAppSelector } from "@/store";
import TodoDescription from "./TodoDescription";

export type EditorProps = {
    id: Todo["id"];
};

export default function Editor({ id }: EditorProps) {
    const todo: Todo = useAppSelector((state) => selectTodoById(state, id)),
        dispatch = useAppDispatch(),
        subtasks = todo?.subtasks || [],
        dependencies = todo?.dependencies || [],
        dependencyOptions = useAppSelector((state) =>
            selectRootTodoIds(state).filter((i) => i !== id)
        );

    if (!todo) return null;

    return (
        <NoSsr>
            <div className="h-full space-y-3 root text-light-text dark:text-dark-text">
                <TodoBreadcrumb id={id} />
                <div className="flex justify-between items-center gap-2 outlined-card">
                    <div className="flex gap-2 items-center">
                        <TodoCompleted id={id} />
                        <TodoTitle
                            id={id}
                            className="text-2xl text-pri-500 font-bold"
                        />
                    </div>
                    <TodoImportant id={id} />
                </div>
                <div className="outlined-card py-2">
                    <TodoDescription id={id} />
                </div>
                <div className="outlined-card tiles">
                    <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                        <Icon name="schedule" size={24} wrap={true} />
                        <span>Create date</span>
                        <TodoDate id={id} field="createDate" />
                    </div>
                    <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                        <Icon name="pending_actions" size={24} wrap={true} />
                        <span>Due date</span>
                        <TodoDate id={id} field="dueDate" />
                    </div>
                    <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                        <Icon name="timer" size={24} wrap={true} />
                        <span className="text">Duration</span>
                        <TodoDuration id={id} className="text-xl" />
                    </div>
                    <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                        <Icon name="label" size={24} wrap={true} />
                        <span className="text">Tags</span>
                        <TodoTags id={id} className="mt-1" />
                    </div>
                </div>
                <div className="outlined-card space-y-3">
                    <h2 className="text-lg flex justify-between items-center font-bold text-light-text dark:text-dark-text">
                        <p>Subtasks</p>
                        <Button
                            className="flex items-center gap-2 text-base"
                            onClick={async () => {
                                const newTodo = (await dispatch(
                                    addTodo({
                                        title: "New Subtask",
                                        parentTaskId: id
                                    })
                                )) as {
                                    payload: Todo;
                                };
                                dispatch(
                                    updateTodo({
                                        id,
                                        update: {
                                            subtasks: [
                                                ...new Set([
                                                    ...subtasks,
                                                    newTodo.payload.id
                                                ])
                                            ]
                                        }
                                    })
                                );
                            }}
                            content="both"
                            variant="outline"
                        >
                            <Icon name="add" size={24} />
                            <span>New Subtask</span>
                        </Button>
                    </h2>
                    <TodoList
                        ids={subtasks}
                        variant="subtask"
                        metas={[]}
                    ></TodoList>
                </div>
                <div className="outlined-card space-y-3">
                    <h2 className="text-lg flex justify-between items-center font-bold text-light-text dark:text-dark-text">
                        <p>Dependencies</p>
                    </h2>

                    <TodoMultiselect
                        ids={dependencyOptions}
                        value={dependencies}
                        onChange={(deps) => {
                            dispatch(
                                updateTodo({
                                    id,
                                    update: {
                                        dependencies: [
                                            ...new Set([
                                                ...todo.dependencies,
                                                ...deps
                                            ])
                                        ]
                                    }
                                })
                            );
                        }}
                    />
                </div>
                <style jsx>{`
                    .outlined-card {
                        @apply border border-uim-300 dark:border-uim-700 rounded-lg px-4 py-4;
                    }

                    .tiles {
                        @apply grid gap-2 justify-items-stretch;
                        grid-template-columns: repeat(
                            auto-fill,
                            minmax(15rem, 1fr)
                        );
                    }

                    .tiles div {
                        @apply rounded-lg p-4;

                        span {
                            @apply text-sm;
                        }
                    }

                    .root {
                        max-height: 100%;
                        overflow-y: auto;
                        scrollbar-width: none;
                        -ms-overflow-style: none;

                        &::-webkit-scrollbar {
                            display: none;
                        }
                    }
                `}</style>
            </div>
        </NoSsr>
    );
}
