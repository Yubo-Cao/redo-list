import { Todo } from "../todos/todosSlice";
import { Status } from "@/lib/common";
import { invoke } from "@/lib/tauri";
import { RootState } from "@/store";
import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";

export type MyDay = {
    status: Status;
    mydays: Todo["id"][];
};

export const initialState: MyDay = {
    status: "needsUpdate",
    mydays: []
};

const myDaySlice = createSlice({
    name: "myday",
    initialState: initialState,
    reducers: {
        myDayAdded: (state, { payload: id }: { payload: Todo["id"] }) => {
            state.mydays.push(id);
        },
        myDayDeleted: (state, { payload: id }: { payload: Todo["id"] }) => {
            state.mydays = state.mydays.filter((myday) => myday !== id);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyDays.fulfilled, (state, { payload }) => {
            state.mydays = payload as any as Todo["id"][];
            state.status = "idle";
        });
        builder.addCase(addMyDay.fulfilled, (state, { payload }) => {
            state.mydays.push(payload);
        });
        builder.addCase(deleteMyDay.fulfilled, (state, { payload }) => {
            state.mydays = state.mydays.filter((myday) => myday !== payload);
        });
        builder.addCase(setMyDay.fulfilled, (state, { payload }) => {
            state.mydays = payload;
        });
    }
});

export const myDayReducer = myDaySlice.reducer;
export default myDayReducer;

export const { myDayAdded, myDayDeleted } = myDaySlice.actions;

// selectors
export const selectMyDays = createSelector(
    (state: RootState) => state.myday,
    (myday) => myday.mydays
);

export const selectMyDayStatus = createSelector(
    (state: RootState) => state.myday,
    (myday) => myday.status
);

// thunks
export const fetchMyDays = createAsyncThunk("myday/fetchMyDays", async () => {
    return invoke("get_my_day_todos");
});

export const addMyDay = createAsyncThunk(
    "myday/addMyDay",
    async (id: Todo["id"]) => {
        invoke("add_todo_my_day", { id });
        return id;
    }
);

export const deleteMyDay = createAsyncThunk(
    "myday/deleteMyDay",
    async (id: Todo["id"]) => {
        invoke("remove_todo_my_day", { id });
        return id;
    }
);

export const setMyDay = createAsyncThunk(
    "myday/setMyDay",
    async (ids: Todo["id"][]) => {
        invoke("set_my_days", { ids });
        return ids;
    }
);

export const clearMyDay = createAsyncThunk("myday/clearMyDays", async () => {
    invoke("clear_my_days");
});
