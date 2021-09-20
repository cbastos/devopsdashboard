export default interface DeploymentsAgent {
    getStatisticsFrom(applicationId: string, begin: string, end: string): Promise<any>;
}