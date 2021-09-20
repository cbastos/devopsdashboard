export default interface PipelinesRetriever {
    getPipelines(projectId: number, branch: string);
    getPipeline(projectId: number, executionId: number);
}
