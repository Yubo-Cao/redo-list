import { Status } from "@lib/common";
import { invoke } from "@lib/tauri";

import { addDocument } from "../documents/documentSlice";
import { RootState } from "@/store";
import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Queue } from "queue-typescript";

export type Todo = {
    id: number;
    title: string;
    description: number; // id of the document
    completed: boolean;
    createDate: string;
    dueDate?: string;
    importance: number;
    important: boolean;
    tags: string[];
    estimatedDuration?: number;
    parentTaskId?: number;
    subtasks: number[];
    dependencies: number[];
};

export const DEFAULT_TODO: Todo = {
    id: 0, // placeholder ID for rust serialzer
    title: "",
    description: 0, // placeholder document ID for rust serializer
    completed: false,
    createDate: "",
    dueDate: "",
    importance: 1,
    important: false,
    tags: [],
    estimatedDuration: undefined,
    parentTaskId: undefined,
    subtasks: [],
    dependencies: []
};

export type TodosState = {
    status: Status;
    entities: { [id: number]: Todo };
    editTodoId: number | null;
    extendedEditTodoId: number | null;
    extendedEditing: boolean;
    selectedTodoIds: number[];
};

const initialState: TodosState = {
    status: "needsUpdate",
    entities: {},
    editTodoId: null,
    extendedEditTodoId: null,
    extendedEditing: false,
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
        todoExtendedEditorIdChanged: (
            state,
            action: { payload: Todo["id"] }
        ) => {
            state.extendedEditTodoId = action.payload;
        },
        todoExtendedEditingChanged: (state, action: { payload: boolean }) => {
            state.extendedEditing = action.payload;
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
    todoExtendedEditorIdChanged,
    todoExtendedEditingChanged
} = todosSlice.actions;

export const {
    selectAll: selectAllTodos,
    selectById: selectTodoById,
    selectTotal: selectTodoTotal
} = todosAdapter.getSelectors((state: any) => state.todos);

export const selectTodoIds = createSelector(selectAllTodos, (todos: Todo[]) =>
    todos.map((todo) => todo.id)
);

export const selectRootTodoIds = createSelector(
    selectAllTodos,
    (todos: Todo[]) =>
        todos.filter((todo) => todo.parentTaskId == null).map((todo) => todo.id)
);

export const selectEditTodoId = createSelector(
    (state: any) => state.todos,
    (todos) => todos.editTodoId as Todo["id"]
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

export const selectTodoSubtaskIds = (state: RootState, todoId: number) =>
    state.todos.entities[todoId]?.subtasks;

export const selectTodoCompletedSubtasksCount = (
    state: RootState,
    todoId: number
) =>
    selectTodoSubtaskIds(state, todoId).filter(
        (id) => selectTodoById(state, id).completed
    ).length;

export const selectTodoSubtasksCount = (state: RootState, todoId: number) =>
    selectTodoSubtaskIds(state, todoId).length;

export const selectTodoSubtaskIdsRecursively = (id: Todo["id"]) =>
    createSelector(
        (state: RootState) => state,
        (state: RootState) => {
            let todo = selectTodoById(state, id),
                result = [],
                stack = [todo];
            while (stack.length) {
                let current = stack.pop();
                result = [...result, current.id, ...current.subtasks];
                stack = [
                    ...stack,
                    ...current.subtasks.map((id) => selectTodoById(state, id))
                ];
            }
            return result;
        }
    );

export const selectTodoSubtaskDepth = (state, id: Todo["id"]) => {
    let todo = selectTodoById(state, id),
        depth = 0;
    while (todo.parentTaskId != null) {
        todo = selectTodoById(state, todo.parentTaskId);
    }
    return depth;
};

// thunks
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
    const todos: Todo[] = await invoke("get_todos");
    return todos;
});

export const addTodo = createAsyncThunk(
    "todos/addTodo",
    async (todo: Partial<Todo>, { dispatch }): Promise<Todo> => {
        const final: Todo = { ...DEFAULT_TODO, ...todo };
        const descriptionId: number = (
            (await dispatch(addDocument(""))).payload as any
        ).id;
        final.description = descriptionId;
        const createDate = new Date();
        final.createDate = createDate.toISOString().split("T")[0];
        const todoId: number = await invoke("add_todo", { todo: final });
        const result = { ...final, id: todoId };
        return result;
    }
);

const updateQueue: Queue<[number, Partial<Todo>]> = new Queue();
export const updateTodo = createAsyncThunk(
    "todos/updateTodo",
    async ({ id, update }: { id: number; update: Partial<Todo> }) => {
        updateQueue.enqueue([id, update]);
        return { id, update };
    }
);
const updateWorker = async () => {
    if (!updateQueue.length) return;
    const updates = new Map<number, Partial<Todo>>();
    while (updateQueue.length) {
        const [id, update] = updateQueue.dequeue();
        if (updates.has(id)) updates.set(id, { ...updates.get(id), ...update });
        else updates.set(id, update);
    }
    updates.forEach(async (update, id) => {
        const old: Todo = await invoke("get_todo", { id });
        const todo = { ...old, ...update };
        await invoke("update_todo", { id, todo });
    });
};
setInterval(updateWorker, 15000);

export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async (id: Todo["id"], { dispatch, getState }) => {
        let state = getState() as RootState,
            subtasks: Todo["subtasks"] = [id],
            parentId = selectTodoById(state, id)?.parentTaskId;
        if (parentId) {
            const parent = selectTodoById(state, parentId);
            if (parent) {
                dispatch(
                    updateTodo({
                        id: parentId,
                        update: {
                            subtasks: parent.subtasks.filter(
                                (subtaskId) => subtaskId !== id
                            )
                        }
                    })
                );
            }
        }
        while (!subtasks.length) {
            const currentId = subtasks.pop();
            subtasks = [...subtasks, ...selectTodoSubtaskIds(state, id)];
            dispatch(deleteTodo(currentId));
        }
        try {
            await invoke("delete_todo", { id });
        } catch (e) {
            console.error(e);
        }
        return id;
    }
);

export const selectExtendedEditTodoId = createSelector(
    (state) => state.todos,
    (todos) => todos.extendedEditTodoId as Todo["id"] | null
);

export const selectExtendedEditing = createSelector(
    (state) => state.todos,
    (todos) => todos.extendedEditing as boolean
);

export const selectParentTodosById = (id: Todo["id"]) =>
    createSelector(
        (state) => state,
        (state: RootState) => {
            const reversed: Todo[] = [];
            let current: Todo = selectTodoById(state, id);
            while (current.parentTaskId != null) {
                current = selectTodoById(state, current.parentTaskId);
                reversed.push(current);
            }
            const result = [];
            for (let i = reversed.length - 1; i >= 0; i--) {
                result.push(reversed[i]);
            }
            return result;
        }
    );
