import { describe, expect, test } from "@jest/globals";
import { configureStore } from "@reduxjs/toolkit";

import {
    selectAllTodos,
    selectTodoById,
    selectTodoIds,
    selectTodoStatus,
    selectTodoTotal,
    todoAdded,
    todoDeleted,
    todoToggled,
    todoUpdated,
    todosReducer
} from "../../../features/todos/todosSlice";

const store = configureStore({
    reducer: {
        todos: todosReducer
    }
});

describe("todosSlice", () => {
    test("Initial state", () => {
        expect(store.getState().todos).toEqual({
            entities: {},
            ids: [],
            status: "idle",
            editTodoId: null
        });
        expect(selectAllTodos(store.getState())).toEqual([]);
        expect(selectTodoIds(store.getState())).toEqual([]);
        expect(selectTodoTotal(store.getState())).toEqual(0);
        expect(selectTodoStatus(store.getState())).toEqual("idle");
    });
    test("Add todos", () => {
        store.dispatch(
            todoAdded({
                title: "Todo 1",
                createDate: "2021-01-01"
            })
        );
        expect(selectAllTodos(store.getState())).toEqual([
            {
                id: 1,
                title: "Todo 1",
                description: "",
                completed: false,
                createDate: "2021-01-01",
                dueDate: undefined,
                important: false,
                importance: 0,
                tags: [],
                subtasks: []
            }
        ]);
        store.dispatch(
            todoAdded({
                title: "Todo 2",
                createDate: "2021-01-01",
                dueDate: undefined,
                description: "Description",
                completed: true,
                important: true,
                importance: 1,
                tags: ["tag1", "tag2"]
            })
        );
        expect(selectAllTodos(store.getState())).toEqual([
            {
                id: 1,
                title: "Todo 1",
                description: "",
                completed: false,
                createDate: "2021-01-01",
                dueDate: undefined,
                important: false,
                importance: 0,
                tags: [],
                subtasks: []
            },
            {
                id: 2,
                title: "Todo 2",
                description: "Description",
                completed: true,
                createDate: "2021-01-01",
                dueDate: undefined,
                important: true,
                importance: 1,
                tags: ["tag1", "tag2"],
                subtasks: []
            }
        ]);
    });
    test("Add todos with incomplete data", () => {
        expect(() => {
            store.dispatch(
                todoAdded({
                    title: "Todo 1"
                })
            );
        }).toThrow();
        expect(() => {
            store.dispatch(
                todoAdded({
                    createDate: "2021-01-01"
                })
            );
        }).toThrow();
    });
    test("Check todos", () => {
        expect(selectTodoIds(store.getState())).toEqual([1, 2]);
        expect(selectTodoTotal(store.getState())).toEqual(2);
        expect(selectTodoStatus(store.getState())).toEqual("idle");
    });
    test("Delete todos", () => {
        store.dispatch(todoDeleted(1));
        expect(selectAllTodos(store.getState())).toEqual([
            {
                id: 2,
                title: "Todo 2",
                description: "Description",
                completed: true,
                createDate: "2021-01-01",
                important: true,
                importance: 1,
                tags: ["tag1", "tag2"],
                subtasks: []
            }
        ]);
    });
    test("Toggle todos", () => {
        store.dispatch(todoToggled(2));
        expect(selectTodoById(store.getState(), 2).completed).toEqual(false);
    });
    test("Edit todos", () => {
        const edit = {
            id: 2,
            title: "Todo 2",
            description: "Anish YYDS",
            completed: false,
            createDate: "2021-01-02",
            dueDate: undefined,
            important: false,
            importance: 0,
            tags: ["tag1", "tag2"],
            subtasks: []
        };
        store.dispatch(todoUpdated(edit));
        expect(selectTodoById(store.getState(), 2)).toEqual(edit);
    });
    test("Invalid Edit", () => {
        expect(() => {
            store.dispatch(
                todoUpdated({
                    title: "Todo 2",
                    description: "Anish YYDS",
                    completed: false,
                    createDate: "2021-01-02",
                    important: false,
                    importance: 0,
                    tags: ["tag1", "tag2"]
                })
            );
        }).toThrow();
    });
    test("Check status", () => {
        expect(selectTodoStatus(store.getState())).toEqual("idle");
    });
});
