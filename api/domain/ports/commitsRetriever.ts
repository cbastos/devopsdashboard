export default interface CommitsRetriever {
    getCommits(projectId: number, branch: string);
    getCommit(projectId: number, commitId);
    getMergeRequests(projectId: number, branch: string);
}
