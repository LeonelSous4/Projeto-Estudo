import "knex/types/tables";

declare module "knex/types/tables" {
    export interface Collection {
        id: number | string;
        name: string;
        created_at: string;
        updated_at: string;
    }

    export interface Notebook {
        id: number | string;
        name: string;
        collection_id: number | string;
        created_at: string;
        updated_at: string;
    }

    export interface Topic {
        id: number | string;
        name: string;
        content: string | null;
        is_completed: boolean;
        notebook_id: number | string;
        created_at: string;
        updated_at: string;
    }

    export interface StudySession {
        id: number | string;
        notebook_id: number | string;
        type: "teoria" | "questoes" | "revisao";
        status: "active" | "paused" | "finished";
        duration_seconds: number;
        active_since: string | null;
        finished_at: string | null;
        created_at: string;
        updated_at: string;
    }

    interface Tables {
        collections: Collection;
        notebooks: Notebook;
        topics: Topic;
        study_sessions: StudySession;
    }
}
