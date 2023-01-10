import documentsReducer, {
    fetchDocumentIds
} from "./features/documents/documentSlice";
import kanbansReducer from "./features/kanbans/kanbansSlice";
import myDayReducer from "./features/myday/mydaySlice";
import todosReducer from "./features/todos/todosSlice";

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        todos: todosReducer,
        documents: documentsReducer,
        myday: myDayReducer,
        kanbans: kanbansReducer
    }
    /*
        // For state debug
        middleware: (getDefaultMiddleware) => {
            function log_state(store) {
                return function (next) {
                    return function (action) {
                        console.log("dispatching", action);
                        let result = next(action);
                        console.log("next state", store.getState());
                        return result;
                    };
                };
            }
            return getDefaultMiddleware().concat([log_state]);
        }
    */
});

store.dispatch(fetchDocumentIds());

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
