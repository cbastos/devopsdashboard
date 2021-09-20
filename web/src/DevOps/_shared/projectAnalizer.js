
export default class ProjectAnalizer {
    constructor(analyzers = HEALTH_ANALYCERS) {
        this.analyzers = analyzers
    }

    getErrorsOf(project, executions) {
        const errors = [];
        this.analyzers.forEach(({ id, rules }) => {
            rules.forEach(({ name, analyze }) => {
                const ruleErrors = analyze(project, executions);
                if (ruleErrors.length > 0) {
                    errors.push({ type: id, name, errors: ruleErrors })
                }
            })
        });
        return errors;
    }
}

const HEALTH_ANALYCERS = [
    {
        id: 'jenkins',
        rules: [
            {
                name: 'has-jenkins-info',
                analyze: (project) => !project.jenkins || !project.jenkins.group || !project.jenkins.name ? ['Does not has jenkins info'] : []
            },
            {
                name: 'last-build-failed',
                analyze: (project, executions) => executions.length && executions[0].status === 'failed' ? ['Last build failed'] : []
            }
        ]
    },
    {
        id: 'sonarqube',
        rules: [
            {
                name: 'has-sonarqube-info',
                analyze: (project) => {
                    return !project.codeanalyzerprojectid ? ['Does not has sonarqube info'] : []
                }
            },
            {
                name: 'has-sonarqube-gate-passed',
                analyze: (project) => {
                    if (project.sonarqubeStatus && project.sonarqubeStatus.metric === 'alert_status' && (project.sonarqubeStatus.value === 'WARN' || project.sonarqubeStatus.value === 'ERROR')) {
                        return ['Sonarqube gate warning'];
                    }
                    return [];
                }
            }
        ]
    },
    {
        id: 'confluence',
        rules: [
            /* {
                 name: 'has-confluence-documentation',
                 analyze: (project) => !project.confluence.page ? ['Does not has confluence documentation'] : []
             }*/
        ]
    },
    {
        id: 'artifactory',
        rules: [
            /*{
                name: 'has-artifactory-info',
                analyze: (project) => !project.repositorypackageid ? ['Does not has artifactory info'] : []
            }*/
        ]
    }
];
