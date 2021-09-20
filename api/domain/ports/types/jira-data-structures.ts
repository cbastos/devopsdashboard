export type IssueTypes = {
    "self": string,
    "id": string,
    "description": string,
    "iconUrl": string,
    "name": string,
    "subtask": boolean,
    "avatarId": number,
    "hierarchyLevel": number
}

type Status = {
    initial?: string;
    final: string;
    changelog?: {date: Date, to: string}[];
}

export type Issue = {
    type: string,
    key: string,
    created: Date,
    summary: string,
    description: string,
    status: Status,
    cycleTime?: number,
    devTime?: number,
    testTime?: number,
    todoTime?: number,
    resolveTime?: number,
    deviation: number,
    pingpongAssignee?: number
}

export type Project = {
    id: number,
    name: string,
    executions: any,
    codeanalyzerprojectid: string,
    coderepositoryid: number,
    projecttypeid: number,
    config: any,
    documentationspacename: string,
    documentationpagename: string,
    repositorypackageid: string,
    jenkinsgroup: string,
    jenkinsprojectname: string,
    commits: any
}