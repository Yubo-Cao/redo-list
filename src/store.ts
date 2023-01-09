import documentsReducer, {
    fetchDocumentIds
} from "./features/documents/documentSlice";
import todosReducer from "./features/todos/todosSlice";
import myDayReducer from "./features/myday/mydaySlice";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        todos: todosReducer,
        documents: documentsReducer,
        myday: myDayReducer
    }
});

store.dispatch(fetchDocumentIds());

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
