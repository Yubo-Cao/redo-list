import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Queue } from "queue-typescript";

import { invoke } from "@lib/tauri";

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
    dependencies: number[];
};

export const DEFAULT_TODO: Todo = {
    id: 0, // placeholder ID for rust serialzer
    title: "",
    description: "",
    completed: false,
    createDate: "",
    dueDate: "",
    importance: 1,
    important: false,
    tags: [],
    estimatedDuration: undefined,
    parentTaskId: undefined,
    resources: [],
    subtasks: [],
    dependencies: []
};

export type TodosState = {
    status: "idle" | "loading" | "failed" | "needsUpdate";
    entities: { [id: number]: Todo };
    editTodoId: number | null;
    extendedEditor: boolean;
    selectedTodoIds: number[];
};

const initialState: TodosState = {
    status: "needsUpdate",
    entities: {},
    editTodoId: null,
    extendedEditor: false,
    selectedTodoIds: []
};

const todosAdapter = createEntityAdapter<Todo>();

const todosSlice = createSlice({
    name: "todos",
    initialState: todosAdapter.getInitialState(initialState),
    reducers: {
        todoAdded: (state, action: { payload: Todo }) => {
            todosAdapter.addOne(state, action.payload);
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
        todoUpdated: (state, action) => {
            const { id, ...todo } = action.payload;
            const old = state.entities[id];
            if (!old) throw new Error("Todo not found");
            Object.assign(old, todo);
        },
        todoStartEdit: (state, action: { payload: Todo["id"] | null }) => {
            state.editTodoId = action.payload;
        },
        todoStopEdit: (state) => {
            state.editTodoId = null;
        },
        todoSelected: (state, action: { payload: Todo["id"] }) => {
            state.selectedTodoIds.push(action.payload);
        },
        todoDeselected: (state, action: { payload: Todo["id"] }) => {
            state.selectedTodoIds = state.selectedTodoIds.filter(
                (id) => id !== action.payload
            );
        },
        todoSetExtendedEditor: (state, action: { payload: boolean }) => {
            state.extendedEditor = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.pending, (state, action) => {
            state.status = "loading";
        });
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            todosAdapter.setAll(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(fetchTodos.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(updateTodo.fulfilled, (state, action) => {
            const { id, update } = action.payload;
            if (!Object.hasOwn(state.entities, id))
                throw new Error("Todo not found");
            state.entities[id] = { ...state.entities[id], ...update };
        });
        builder.addCase(addTodo.fulfilled, (state, action) => {
            todosAdapter.addOne(state, action.payload);
        });
        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            todosAdapter.removeOne(state, action.payload);
        });
    }
});

export const todosReducer = todosSlice.reducer;
export default todosReducer;

// selectors
export const {
    todoAdded,
    todoToggled,
    todoDeleted,
    todoUpdated,
    todoStartEdit,
    todoStopEdit,
    todoSelected,
    todoDeselected,
    todoSetExtendedEditor
} = todosSlice.actions;

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
        (state: any) => state.todos.entities,
        (entities: { [id: number]: Todo }) => entities[todoId].subtasks
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

// thunks
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    const todos: Todo[] = await invoke("get_root_todos");
    console.log("fetching todos");
    return todos;
});

export const addTodo = createAsyncThunk(
    "todos/addTodo",
    async (todo: Partial<Todo>): Promise<Todo> => {
        const final: Todo = { ...DEFAULT_TODO, ...todo };
        const id: number = await invoke("add_todo", { todo: final });
        const result = { ...final, id };
        return result;
    }
);

const updateQueue: Queue<[number, { [key: string]: any }]> = new Queue();
export const updateTodo = createAsyncThunk(
    "todos/updateTodo",
    async ({ id, update }: { id: number; update: Partial<Todo> }) => {
        updateQueue.enqueue([id, update]);
        return { id, update };
    }
);
const updateTodoWorker = async () => {
    if (updateQueue.length === 0) return;
    const updates = new Map<number, { [key: string]: Partial<Todo> }>();
    while (updateQueue.length > 0) {
        const [id, update] = updateQueue.dequeue();
        if (updates.has(id)) updates.set(id, { ...updates.get(id), ...update });
        else updates.set(id, update);
    }
    updates.forEach(async (update, id) => {
        const old: Todo = await invoke("get_todo", { id });
        console.debug(`updating todo ${id}`);
        await invoke("update_todo", {
            id,
            todo: { ...old, ...update }
        });
    });
};
setInterval(updateTodoWorker, 15000);

export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async (todoId: number) => {
        await invoke("delete_todo", { id: todoId });
        return todoId;
    }
);
