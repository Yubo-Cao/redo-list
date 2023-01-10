import { Status } from "@/lib/common";
import { invoke } from "@tauri-apps/api";
import { RootState } from "@/store";
import {
    PayloadAction,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Todo } from "../todos/todosSlice";
import { Document, addDocument } from "../documents/documentSlice";

export type Kanban = {
    id: number;
    title: string;
    description: Document["id"];
    tasks: Todo["id"][];
};

const defaultKanban = {
    id: -1,
    title: "",
    description: -1,
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
        kanbanUpdated: (state, action: { payload: Kanban }) => {
            kanbanAdapter.updateOne(state, {
                id: action.payload.id,
                changes: action.payload
            });
        },
        kanbanTodoAdded: (
            state,
            action: { payload: { kanbanId: Kanban["id"]; todoId: Todo["id"] } }
        ) => {
            const { kanbanId, todoId } = action.payload;
            const kanban = state.entities[kanbanId];
            kanban.tasks.push(todoId);
        },
        kanbanTodoRemoved: (
            state,
            action: { payload: { kanbanId: Kanban["id"]; todoId: Todo["id"] } }
        ) => {
            const { kanbanId, todoId } = action.payload;
            const kanban = state.enities[kanbanId];
            kanban.tasks = kanban.tasks.filter((id) => id !== todoId);
        },
        kanbanTodoMoved: (
            state,
            action: {
                payload: {
                    kanbanId: Kanban["id"];
                    todoId: Todo["id"];
                    index: number;
                };
            }
        ) => {
            const { kanbanId, todoId, index } = action.payload;
            const kanban = state.entities[kanbanId];
            kanban.tasks = kanban.tasks.filter((id) => id !== todoId);
            kanban.tasks.splice(index, 0, todoId);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addKanban.fulfilled, (state, action) => {
            kanbanAdapter.addOne(state, action.payload as Kanban);
        });
    }
});

const kanbansReducer = kanbanSlice.reducer;
export default kanbansReducer;

// selector
const selectKanban = (state) => state.kanbans;
export const {
    selectAll: sleectAllKanbans,
    selectById: selectKanbanById,
    selectTotal: selectKanbanTotal
} = kanbanAdapter.getSelectors(selectKanban);

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
        const kanbanId = await invoke("add_kanban", { kanban: kanban });
        const result: Kanban = { ...kanban, id: kanbanId };
        return result;
    }
);

export const deleteKanban = createAsyncThunk(
    "kanbans/deleteKanban",
    async (id: number) => {
        await invoke("delete_kanban", { id });
        return id;
    }
);

export const updateKanban = createAsyncThunk(
    "kanbans/updateKanban",
    async (kanban: Partial<Kanban> & { id: Kanban["id"] }, { getState }) => {
        const old = selectKanbanById(getState() as RootState, kanban.id);
        await invoke("update_kanban", { ...old, ...kanban });
        return kanban;
    }
);

export const addTodoToKanban = createAsyncThunk(
    "kanbans/addTodoToKanban",
    async (payload: { kanbanId: number; todoId: number }) => {
        await invoke("add_todo_to_kanban", payload);
        return payload;
    }
);

export const removeTodoFromKanban = createAsyncThunk(
    "kanbans/removeTodoFromKanban",
    async (payload: { kanbanId: number; todoId: number }) => {
        await invoke("remove_todo_from_kanban", payload);
        return payload;
    }
);

export const moveTodoInKanban = createAsyncThunk(
    "kanbans/moveTodoInKanban",
    async (payload: { kanbanId: number; todoId: number; index: number }) => {
        await invoke("move_todo_in_kanban", payload);
        return payload;
    }
);

export const getAllKanbans = createAsyncThunk(
    "kanbans/getAllKanbans",
    async (_) => {
        return await invoke("get_all_kanbans");
    }
);
