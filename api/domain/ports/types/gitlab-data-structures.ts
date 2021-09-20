export type Commit = {
    id: string,
    short_id: string,
    title: string,
    author_name: string,
    author_email: string,
    committer_name: string,
    committer_email: string,
    created_at: Date,
    message: string,
    parent_ids: string[],
    web_url: string
}

export type Branch = {
    name: string,
    merged: boolean,
    protected: boolean,
    default: boolean,
    developers_can_push: boolean,
    developers_can_merge: boolean,
    can_push: boolean,
    web_url: string,
    commit: {
        author_email: string,
        author_name: string,
        authored_date: Date,
        committed_date: Date,
        committer_email: string,
        committer_name: string,
        id: string,
        short_id: string,
        title: string,
        message: string,
        parent_ids: string[]
    }
}

export type Pipeline = {
    id: number,
    project_id: number,
    status: string,
    ref: string,
    sha: string,
    before_sha: string,
    tag: boolean,
    yaml_errors: any,
    user: {
        name: string,
        username: string,
        id: number,
        state: string,
        avatar_url: string,
        web_url: string
    },
    created_at: Date,
    updated_at: Date,
    started_at: null,
    finished_at: Date,
    committed_at: null,
    duration: null,
    coverage: string,
    web_url: string
}
