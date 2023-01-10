import { Status } from "@/lib/common";
import { invoke } from "@tauri-apps/api";
import { RootState } from "@/store";
import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Todo } from "../todos/todosSlice";
import { Document } from "../documents/documentSlice";

export type Kanban = {
    id: number;
    title: string;
    description: Document["id"];
    tasks: Todo["id"][];
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
    extraReducers: {
        
    }
});
