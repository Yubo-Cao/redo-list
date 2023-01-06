import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { NodeNextRequest } from "next/dist/server/base-http/node";

export type Todo = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createDate: string;
    dueDate?: string;
    importance: number;
    important: boolean;
    tags: string[];
    estimatedDuration?: number;
    parentTaskId?: number;
    resources?: string[];
    subtasks: number[];
};

export const DefaultTodo: Todo = {
    id: 0,
    title: "",
    description: "",
    completed: false,
    createDate: "",
    dueDate: "",
    importance: 1,
    important: false,
    tags: [],
    estimatedDuration: null,
    parentTaskId: null,
    resources: [],
    subtasks: []
};

export type TodosState = {
    status: "idle" | "loading" | "failed";
    entities: { [id: number]: Todo };
    editTodoId: number | null;
};

const initialState: TodosState = {
    status: "idle",
    entities: {},
    editTodoId: null
};

const todosAdapter = createEntityAdapter<Todo>();

const nextId = (state: TodosState) => {
    return Object.keys(state.entities).length + 1;
};

const todosSlice = createSlice({
    name: "todos",
    initialState: todosAdapter.getInitialState(initialState),
    reducers: {
        todoAdded: (state, action) => {
            const {
                title,
                createDate,
                dueDate,
                completed = false,
                description = "",
                importance = 0,
                important = false,
                tags = [],
                subtasks = [],
                estimatedDuration,
                parentTaskId,
                resources
            } = action.payload;
            if (!title) throw new Error("Title is required");
            if (!createDate) throw new Error("Create date is required");
            todosAdapter.addOne(state, {
                id: nextId(state),
                title,
                description,
                completed,
                createDate: createDate,
                dueDate,
                importance,
                important,
                tags,
                subtasks,
                estimatedDuration,
                parentTaskId,
                resources
            });
        },
        todoToggled: (state, action) => {
            const todo = state.entities[action.payload];
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        todoDeleted: (state, action) => {
            todosAdapter.removeOne(state, action.payload);
        },
        todoEdited: (state, action) => {
            const { id, ...todo } = action.payload;
            const todoToEdit = state.entities[id];
            if (!todoToEdit) throw new Error("Todo not found");
            Object.assign(todoToEdit, todo);
        },
        todoStartEdit: (state, action) => {
            state.editTodoId = action.payload;
        },
        todoStopEdit: (state) => {
            state.editTodoId = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            console.log(action);
            todosAdapter.setAll(state, JSON.parse(action.payload));
            state.status = "idle";
        });
    }
});

export const {
    todoAdded,
    todoToggled,
    todoDeleted,
    todoEdited,
    todoStartEdit,
    todoStopEdit
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
export default todosReducer;

export const {
    selectAll: selectAllTodos,
    selectById: selectTodoById,
    selectTotal: selectTodoTotal
} = todosAdapter.getSelectors((state: any) => state.todos);

export const selectTodoIds = createSelector(selectAllTodos, (todos: Todo[]) =>
    todos.map((todo) => todo.id)
);

export const selectEditTodoId = createSelector(
    (state: any) => state.todos,
    (todos) => todos.editTodoId
);

export const selectEditTodo = createSelector(
    selectEditTodoId,
    (state: any) => state.todos.entities,
    (editTodoId, entities) => entities[editTodoId]
);

export const selectTodoStatus = createSelector(
    (state: any) => state.todos.status,
    (status) => status
);

export const selectTodoSubtasks = (todoId: number) =>
    createSelector(
        (state) => selectTodoById(state, todoId),
        (todo: Todo) => todo.subtasks
    );

export const selectTodoSubtaskTotal = (todoId: number) =>
    createSelector(
        selectTodoSubtasks(todoId),
        (subtasks: number[]) => subtasks.length
    );

export const selectTodoSubtaskCompleteTotal = (todoId: number) =>
    createSelector(
        selectTodoSubtasks(todoId),
        (state: any) => state.todos.entities,
        (subtasks: number[], entities: { [id: number]: Todo }) =>
            subtasks.filter((subtaskId) => entities[subtaskId].completed).length
    );

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    const response = await fetch("/api/todos");
    return await response.json();
});
