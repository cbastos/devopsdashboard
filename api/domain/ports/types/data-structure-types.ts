export type Execution = {
    id: number,
    created_at: Date,
    started_at: Date,
    finished_at: Date,
    duration_in_minutes: number,
    idle_job_average_in_seconds: number,
    status: any
}

export type History = {
    items: {
        field: string,
        fromString: string
    }[]; 
    author: { 
        displayName: any; 
        emailAddress: any; 
    }; 
    created: string | number | Date; 
}

export type Backlog = {
    changelog: any,
    issues: {fields: any, key: any}[]
}

export type Event = {
    id: number,
    title: string,
    project_id: number,
    action_name: string,
    target_id: number,
    target_type: string,
    author_id: number,
    target_title: string,
    created_at: Date,
    author: {
        name: string,
        username: string,
        id: number,
        state: string,
        avatar_url: string,
        web_url: string,
    },
    author_username: string,
}
