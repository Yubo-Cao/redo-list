import {
    Todo,
    selectEditTodoId,
    selectTodoById,
    addTodo,
    selectTodoSubtasks,
    updateTodo
} from "@features/todos/todosSlice";

import Icon from "@/components/Icon";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import TodoCompleted from "./TodoCompleted";
import TodoDescription from "./TodoDescription";
import TodoTitle from "./TodoTitle";

import TodoDate from "./TodoDate";
import Button from "@/components/Button";
import TodoTags from "./TodoTags";
import TodoImportant from "./TodoImportant";
import TodoDuration from "./TodoDuration";
import TodoList from "./TodoList";

export default function EditorSidebar() {
    const editTodoId = useSelector(selectEditTodoId),
        todo: Todo = useSelector((state) => selectTodoById(state, editTodoId)),
        dispatch = useDispatch<AppDispatch>(),
        subtasks = todo?.subtasks || [];

    if (!todo) return null;

    const id = editTodoId;

    let {
        title,
        description,
        important,
        completed,
        tags,
        createDate,
        dueDate,
        importance
    } = todo;

    return (
        <div className="space-y-3 root text-light-text dark:text-dark-text">
            <div className="flex justify-between items-center gap-2 outlined-card">
                <div className="flex gap-2 items-center">
                    <TodoCompleted id={id} />
                    <TodoTitle id={id} />
                </div>
                <TodoImportant id={id} />
            </div>
            <div className="outlined-card py-2">
                <TodoDescription id={id} />
            </div>
            <div className="outlined-card tiles">
                <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                    <Icon name="schedule" size={28} wrap={true} />
                    <span>Create date</span>
                    <TodoDate id={id} field="createDate" />
                </div>
                <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                    <Icon name="pending_actions" size={28} wrap={true} />
                    <span>Due date</span>
                    <TodoDate id={id} field="dueDate" />
                </div>
                <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                    <Icon name="timer" size={28} wrap={true} />
                    <span className="text">Duration</span>
                    <TodoDuration id={id} />
                </div>
                <div className="bg-uim-100/50 dark:bg-uim-800/50 hover:bg-uim-100 hover:dark:bg-uim-800">
                    <TodoTags id={id} />
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
                                            ...subtasks,
                                            newTodo.payload.id
                                        ]
                                    }
                                })
                            );
                        }}
                        content="both"
                        variant="outline"
                    >
                        <Icon name="add" size={24} />
                        <span>New Task</span>
                    </Button>
                </h2>
                <TodoList ids={subtasks}></TodoList>
            </div>

            <style jsx>{`
                .outlined-card {
                    @apply border border-uim-300 dark:border-uim-700 rounded-lg px-3 py-4;
                }

                .tiles {
                    @apply grid grid-cols-2 gap-2 p-4 justify-items-stretch;
                }

                .tiles div {
                    aspect-ratio: 3/2;
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
    );
}
