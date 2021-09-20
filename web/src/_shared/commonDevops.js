export default function getMetricAverageFrom(projects, metric) {
    const projectsMetrics = projects.map(p => p.project.sonarqubeMeasures.find(m => m.metric === metric))
        .filter(v => v);
    let metricsTotal = 0;
    projectsMetrics.forEach((pcc) => metricsTotal += parseInt(pcc.value));
    return (Math.round(metricsTotal / projectsMetrics.length) * 10) / 10;
}

export function getMetricSummatoryFrom(projects, metric) {
    const projectsMetrics = projects.map(p => p.project.sonarqubeMeasures.find(m => m.metric === metric))
        .filter(v => v);
    let metricsTotal = 0;
    projectsMetrics.forEach((pcc) => metricsTotal += parseInt(pcc.value));
    return Math.round(metricsTotal);
}