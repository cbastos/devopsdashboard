import { useState, useEffect } from 'react';
import { fetchApiJson } from './fetchJson';

export function useWorkProjects() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        fetchApiJson('/jira/projects').then(workProjects => setProjects(workProjects));
    }, [])
    return [projects];
}

export function useIssuesTypes() {
    const [issuesTypes, setIssuesTypes] = useState([]);
    useEffect(() => {
        fetchApiJson('/jira/issues/types').then(workIssuesTypes => setIssuesTypes(workIssuesTypes));
    }, [])
    return [issuesTypes];
}

export default {
    useWorkProjects,
};