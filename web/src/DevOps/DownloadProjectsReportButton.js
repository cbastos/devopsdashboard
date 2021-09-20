import { GITLAB_URL, JENKINS_URL, SONARQUBE_URL, JENKINS_LEGACY_URL } from '../_shared/config';
import Icon from '../_shared/Icon';

export default function DownloadProjectsReportButton({ projects }) {
    const projectsCsv = 'Project;Gitlab url;Sonarqube status;Sonarqube url;Jenkins status;Jenkins url;\n' +
        projects.map(p => {
            const SONAR_URL = `${SONARQUBE_URL}/dashboard?id=${p.project.codeanalyzerprojectid}`;
            const JENKINS_HOST = p.project.jenkins.group === "componenteslegacy" ? JENKINS_LEGACY_URL : JENKINS_URL;
            const jenkinsUrl = `${JENKINS_HOST}/job/${p.project.jenkins.group}/job/${p.project.jenkins.name}`;
            const gitlabUrl = `${GITLAB_URL}/projects/${p.coderepositoryid}`;
            return `${p.project.name};"${gitlabUrl}";${p.project.sonarqubeStatus?.value};"${SONAR_URL}";${p.executions[0]?.status};"${jenkinsUrl}";`
        }

        ).join('\n');
    return <a href="#" title='Export to excel' onClick={() => download(projectsCsv, 'projects_devops_report.csv')} >
        <Icon height={40} width={40} src="/export-excel.png" />
    </a>;
}

function download(data, fileName) {
    const file = new Blob([data], { type: fileName.split('.')[1] });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}