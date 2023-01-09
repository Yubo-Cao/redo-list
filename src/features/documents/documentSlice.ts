import { Status } from "@lib/common";
import { invoke } from "@lib/tauri";

import { RootState } from "@/store";
import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { Queue } from "queue-typescript";

export type Document = {
    id: number;
    content: string;
    resources: string[];
    fieldsStatus: {
        id: "updated" | "needsUpdate";
        content: "updated" | "needsUpdate";
        resources: "updated" | "needsUpdate";
    };
};

export const DEFAULT_DOCUMENT: Document = {
    id: 0,
    content: "",
    resources: [],
    fieldsStatus: {
        id: "needsUpdate",
        content: "needsUpdate",
        resources: "needsUpdate"
    }
};

function allStatus(
    status: "updated" | "needsUpdate"
): Document["fieldsStatus"] {
    return {
        id: status,
        content: status,
        resources: status
    };
}

// States in document will only serve as cache
export type DocumentState = {
    status: Status;
    entities: { [key: Document["id"]]: Document };
};

const initialState: DocumentState = {
    status: "needsUpdate",
    entities: {}
};

const documentAdapter = createEntityAdapter<Document>();

const documentSlice = createSlice({
    name: "documents",
    initialState: documentAdapter.getInitialState(initialState),
    reducers: {
        documentAdded: (state, { payload }: { payload: Document }) => {
            documentAdapter.addOne(state, payload);
        },
        documentDeleted: (
            state,
            { payload: id }: { payload: Document["id"] }
        ) => {
            documentAdapter.removeOne(state, id);
        },
        documentUpdated: (
            state,
            { payload }: { payload: Partial<Document> }
        ) => {
            documentAdapter.updateOne(state, {
                changes: payload,
                id: payload.id
            });
            const { id, ...fields } = payload;
            Object.keys(fields).forEach((field) => {
                state.entities[id].fieldsStatus[field] = "updated";
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDocumentIds.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(fetchDocumentIds.fulfilled, (state, { payload }) => {
            if (!payload) return;

            payload.forEach((id) => {
                if (!state.entities[id]) {
                    documentAdapter.addOne(state, { ...DEFAULT_DOCUMENT, id });
                }
            });
            state.status = "idle";
        });
        builder.addCase(fetchDocumentIds.rejected, (state) => {
            state.status = "failed";
        });
        builder.addCase(fetchDocument.fulfilled, (state, { payload }) => {
            documentAdapter.upsertOne(state, payload);
            state.entities[payload.id].fieldsStatus = allStatus("updated");
        });
        builder.addCase(
            fetchDocumentResources.fulfilled,
            (state, { payload }) => {
                state.entities[payload.id].resources = payload.resources;
                state.entities[payload.id].fieldsStatus.resources = "updated";
            }
        );
        builder.addCase(addDocument.fulfilled, (state, { payload }) => {
            documentAdapter.addOne(state, payload);
            state.entities[payload.id].fieldsStatus = allStatus("updated");
        });
        builder.addCase(updateDocument.fulfilled, (state, { payload }) => {
            documentAdapter.updateOne(state, payload);
            state.entities[payload.id].fieldsStatus = allStatus("updated");
        });
        builder.addCase(deleteDocument.fulfilled, (state, { payload }) => {
            documentAdapter.removeOne(state, payload.id);
        });
        builder.addCase(
            addResourcesToDocument.fulfilled,
            (state, { payload }) => {
                state.entities[payload.id].resources = payload.resources;
            }
        );
    }
});

export const documentsReducer = documentSlice.reducer;
export default documentsReducer;

export const { documentAdded, documentDeleted, documentUpdated } =
    documentSlice.actions;

// thunks
const fetchDocument = createAsyncThunk(
    "documents/fetchDocument",
    async (id: Document["id"]) => {
        const doc: Document = await invoke("get_document", { id });
        return doc;
    }
);

const fetchDocumentResources = createAsyncThunk(
    "documents/fetchDocumentResources",
    async (id: Document["id"]) => {
        const resources: Document["resources"] = await invoke(
            "get_document_resources",
            { id }
        );
        return { id, resources };
    }
);

const fetchDocumentIds = createAsyncThunk(
    "documents/getDocumentIds",
    async () => {
        const ids: Document["id"][] = await invoke("get_document_ids");
        return ids;
    }
);

const addDocument = createAsyncThunk(
    "documents/addDocument",
    async (content: Document["content"]) => {
        const doc = { ...DEFAULT_DOCUMENT, content };
        const id: Document["id"] = await invoke("add_document", {
            document: doc
        });
        return { ...doc, id };
    }
);

const updateQueue = new Queue<[Document["id"], Partial<Document>]>();
const updateDocument = createAsyncThunk(
    "documents/updateDocument",
    async ({
        id,
        update
    }: {
        id: Document["id"];
        update: Partial<Document>;
    }) => {
        updateQueue.enqueue([id, update]);
        return { id, changes: update };
    }
);
const updateWorker = async () => {
    if (!updateQueue.length) return;
    const updates: Map<number, Partial<Document>> = new Map();
    while (updateQueue.length) {
        const [id, update] = updateQueue.dequeue();
        if (updates.has(id)) {
            const prev = updates.get(id);
            updates.set(id, { ...prev, ...update });
        }
        updates.set(id, update);
    }
    updates.forEach(async (update, id) => {
        const original: Document = await invoke("get_document", { id });
        const doc = { ...original, ...update };
        await invoke("update_document", { id, document: doc });
    });
};
setInterval(updateWorker, 15000);

const deleteDocument = createAsyncThunk(
    "documents/deleteDocument",
    async (id: Document["id"]) => {
        await invoke("delete_document", { id });
        return { id };
    }
);

const documentExists = createAsyncThunk(
    "documents/documentExists",
    async (id: Document["id"]) => {
        const exists = await invoke("document_exists", { id });
        return exists;
    }
);

const cleanDocumentResourcesById = createAsyncThunk(
    "documents/cleanDocumentResourcesById",
    async (id: Document["id"]) => {
        await invoke("clean_document_resources", { id });
    }
);

const addResourcesToDocument = createAsyncThunk(
    "documents/addImagesToDocument",
    async (payload: { id: Document["id"]; images: File[] }) => {
        const { id, images } = payload;

        if (!images.length) return;
        const bytes = await Promise.all(
            images.map(async (img) => {
                const bytes = await img.arrayBuffer();
                return Array.from(new Uint8Array(bytes));
            })
        );
        const resources: string[] = await invoke("add_images_to_document", {
            id,
            imagesData: bytes
        });
        return { id, resources };
    }
);

export {
    fetchDocument,
    fetchDocumentIds,
    addDocument,
    updateDocument,
    deleteDocument,
    documentExists,
    cleanDocumentResourcesById,
    addResourcesToDocument
};

// selectors
const selectDocumentById = (id: Document["id"]) =>
    createSelector(
        (state: RootState) => state.documents.entities[id],
        (doc) => doc
    );

const isDocumentLoadedById = (id: Document["id"]) =>
    createSelector(
        (state: RootState) => state.documents.entities[id],
        (doc) => {
            let flag = true;
            Object.values(doc?.fieldsStatus).forEach((status) => {
                if (status === "needsUpdate") flag = false;
            });
            return flag;
        }
    );

const selectDocumentsStatus = createSelector(
    (state: RootState) => state.documents.status,
    (status) => status
);

const selectDocumentStatusById = (id: Document["id"]) =>
    createSelector(
        (state: RootState) => state.documents.entities[id],
        (doc) => doc?.fieldsStatus
    );

const selectDocumentIds = createSelector(
    (state: RootState) => state.documents.ids,
    (ids) => ids
);

const selectDocuments = createSelector(
    (state: RootState) => state.documents.ids,
    (state: RootState) => state.documents.entities,
    (ids, entities) => {
        return ids.map((id) => entities[id]);
    }
);

const selectDocumentResourcesById = (id: Document["id"]) =>
    createSelector(selectDocumentById(id), (doc) => doc?.resources);

const selectDocumentSummaryById = (id: Document["id"]) =>
    createSelector(selectDocumentById(id), (doc) => {
        if (!doc) return "";
        const { content } = doc;
        let headers_re = /#+\s(.*)/g,
            images_re = /!\[.*\]\(.*\)/g,
            uls_re = /^\s*[*-]\s(.*)(?:$)?/gm,
            ols_re = /^\s*\d+\.s(.*)(?:$)?/gm;
        let summary = content
            .replace(uls_re, "$1")
            .replace(ols_re, "$1")
            .replace(headers_re, "$1")
            .replace(images_re, "")
            .replace("\r", "")
            .replace("\t", "")
            .replace("\n", " ");
        return summary;
    });

const selectDocumentContentById = (id: Document["id"]) =>
    createSelector(selectDocumentById(id), (doc) => doc?.content);

export {
    selectDocumentById,
    selectDocumentStatusById,
    selectDocumentIds,
    selectDocuments,
    selectDocumentsStatus,
    selectDocumentResourcesById,
    selectDocumentSummaryById,
    selectDocumentContentById,
    isDocumentLoadedById
};
