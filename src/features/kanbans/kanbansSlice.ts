import { Document, addDocument } from "../documents/documentSlice";
import { Todo, todoAdded } from "../todos/todosSlice";
import { Status } from "@/lib/common";
import { invoke } from "@/lib/tauri";
import { RootState } from "@/store";
import {
    PayloadAction,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Queue } from "queue-typescript";

export type Kanban = {
    id: number;
    title: string;
    description: Document["id"];
    tasks: Todo["id"][];
};

export const defaultKanban = {
    id: 0,
    title: "",
    description: 0,
    tasks: []
};

export type KanbanState = {
    status: Status;
    error: string | null;
    entities: { [key: Kanban["id"]]: Kanban };
};

const initialState = {
    status: "needsUpdate",
    error: null,
    enities: {}
};

const kanbanAdapter = createEntityAdapter<Kanban>();

const kanbanSlice = createSlice({
    name: "kanbans",
    initialState: kanbanAdapter.getInitialState(initialState),
    reducers: {
        kanbanAdded: (state, action: { payload: Kanban }) => {
            kanbanAdapter.addOne(state, action.payload);
        },
        kanbanDeleted: (state, action: { payload: Kanban["id"] }) => {
            kanbanAdapter.removeOne(state, action.payload);
        },
        kanbanUpdated: (
            state,
            action: PayloadAction<{ id: Kanban["id"]; update: Partial<Kanban> }>
        ) => {
            kanbanAdapter.updateOne(state, {
                id: action.payload.id,
                changes: action.payload.update
            });
        },
        kanbanTodoAdded: (
            state,
            action: PayloadAction<{
                kanbanId: Kanban["id"];
                todoId: Todo["id"];
            }>
        ) => {
            const { kanbanId, todoId } = action.payload;
            const kanban = state.entities[kanbanId];
            kanban.tasks.push(todoId);
        },
        kanbanTodoRemoved: (
            state,
            action: PayloadAction<{
                kanbanId: Kanban["id"];
                todoId: Todo["id"];
            }>
        ) => {
            const { kanbanId, todoId } = action.payload;
            const kanban = state.enities[kanbanId];
            kanban.tasks = kanban.tasks.filter((id) => id !== todoId);
        },
        kanbanTodoMoved: (
            state,
            action: PayloadAction<{
                kanbanId: Kanban["id"];
                todoId: Todo["id"];
                index: number;
            }>
        ) => {
            const { kanbanId, todoId, index } = action.payload;
            const kanban = state.entities[kanbanId];
            kanban.tasks = kanban.tasks.filter((id) => id !== todoId);
            kanban.tasks.splice(index, 0, todoId);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllKanbans.fulfilled, (state, action) => {
            kanbanAdapter.setAll(state, action.payload);
            state.status = "idle";
        });
        builder.addCase(getAllKanbans.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(getAllKanbans.rejected, (state, action) => {
            state.status = "failed";
        });
    }
});

const kanbansReducer = kanbanSlice.reducer;
export default kanbansReducer;

export const {
    kanbanAdded,
    kanbanDeleted,
    kanbanUpdated,
    kanbanTodoAdded,
    kanbanTodoRemoved,
    kanbanTodoMoved
} = kanbanSlice.actions;

// selector
const selectKanban = (state: RootState) => state.kanbans;
export const {
    selectAll: selectAllKanbans,
    selectById: selectKanbanById,
    selectTotal: selectKanbanTotal
} = kanbanAdapter.getSelectors(selectKanban);

export const selectKanbanStatus = createSelector(
    selectKanban,
    (state) => state.status
);

export const selectAllKanbanIds = createSelector(selectAllKanbans, (kanbans) =>
    kanbans.map((kanban) => kanban.id)
);

// thunks
export const addKanban = createAsyncThunk(
    "kanbans/addKanban",
    async (title: string, { dispatch }) => {
        const documentId = ((await dispatch(addDocument(""))).payload as any)
            .id;
        const kanban: Kanban = {
            ...defaultKanban,
            title: title,
            description: documentId
        };
        const kanbanId = (await invoke("add_kanban", {
            kanban: kanban
        })) as Kanban["id"];
        dispatch(kanbanAdded({ ...kanban, id: kanbanId }));
    }
);

export const deleteKanban = createAsyncThunk(
    "kanbans/deleteKanban",
    async (id: number, { dispatch }) => {
        await invoke("delete_kanban", { id });
        dispatch(kanbanDeleted(id));
    }
);

const updateQueue: Queue<[number, Partial<Kanban>]> = new Queue();
export const updateKanban = createAsyncThunk(
    "kanbans/updateKanban",
    async (
        { id, update }: { id: number; update: Partial<Todo> },
        { dispatch }
    ) => {
        updateQueue.enqueue([id, update]);
        dispatch(kanbanUpdated({ id, update }));
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
        const old: Todo = await invoke("get_kanban", { id });
        const kanban = { ...old, ...update };
        await invoke("update_kanban", { kanban });
    });
};
setInterval(updateWorker, 15000);

export const addTodoToKaFnban = createAsyncThunk(
    "kanbans/addTodoToKanban",
    async (payload: { kanbanId: number; todoId: number }, { dispatch }) => {
        await invoke("add_todo_to_kanban", payload);
        dispatch(kanbanTodoAdded(payload));
    }
);

export const removeTodoFromKanban = createAsyncThunk(
    "kanbans/removeTodoFromKanban",
    async (payload: { kanbanId: number; todoId: number }, { dispatch }) => {
        await invoke("remove_todo_from_kanban", payload);
        dispatch(kanbanTodoRemoved(payload));
    }
);

export const moveTodoInKanban = createAsyncThunk(
    "kanbans/moveTodoInKanban",
    async (
        payload: { kanbanId: number; todoId: number; index: number },
        { dispatch }
    ) => {
        await invoke("move_todo_in_kanban", payload);
        dispatch(kanbanTodoMoved(payload));
    }
);

export const getAllKanbans = createAsyncThunk(
    "kanbans/getAllKanbans",
    async (_) => (await invoke("get_all_kanbans")) as Kanban[]
);
