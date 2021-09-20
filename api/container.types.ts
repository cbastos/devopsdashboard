const TYPES = {
    Cache: Symbol('Cache'),
    EndPointsConfigurator: Symbol('EndPointsConfigurator'),
    Repository: Symbol('DataBase'),
    Api: Symbol('Api'),
    Employees: Symbol('Employees'),
    Projects: Symbol('Projects'),
    Work: Symbol('Work'),
    EmployeeEventsRetriever: Symbol('CodeProjectsAgent'),
    ProjectsRetriever: Symbol('ProjectsRetriever'),
    CommitsRetriever: Symbol('CommitsRetriever'),
    CodeQualityAgent: Symbol('CodeQualityAgent'),
    PipelinesRetriever: Symbol('PipelinesRetriever'),
    BacklogRetriever: Symbol('BacklogRetriever'),
    HttpClient: Symbol('HttpClient'),
    Express: Symbol('Express'),
    PromBundle: Symbol('PromBundle'),
    DeploymentsAgent: Symbol('DeploymentsAgent')
};

export default TYPES;