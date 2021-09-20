import { useState, useEffect } from 'react';
import { fetchApiJson } from './fetchJson';

export default function useProjects(organizationId, branch, limit, selectedProductIdFilter, setLoadingScroll, loadingScroll) {
    const [projects, setProjects] = useState([]);
    const [prevBranch, setPrevBranch] = useState([]);
    const [prevOrganization, setPrevOrganization] = useState([]);
    if(branch !== prevBranch){
        setPrevBranch(branch);
        setProjects([]);
    }
    if(organizationId !== prevOrganization){
        setPrevOrganization(organizationId);
        setProjects([]);
    }
    useEffect(() => {
        if (organizationId && branch && (selectedProductIdFilter !== 'none' || !selectedProductIdFilter)) {
        	setLoadingScroll(true);
            if(!projects) setProjects([]);
            fetchApiJson(`/projects?organizationId=${organizationId}&branch=${branch}&limit=${limit}&selectedProductIdFilter=${selectedProductIdFilter}`).then((newProjects) => {
            	setLoadingScroll(false);
                let uniqueProjects = [];
                let found = false;
                for(let proj of newProjects) {
                    found = false;
                    for(let uniqueProj of uniqueProjects) {
                        if(uniqueProj.coderepositoryid === proj.coderepositoryid)
                            found = true;
                    }
                    if(!found && ((projects.length > 0 && proj.coderepositoryid !== projects[projects.length - 1]['coderepositoryid']) || projects.length === 0)) 
                        uniqueProjects.push(proj);
                }
            	setProjects([...new Set(projects.concat(...new Set(uniqueProjects)))]);
            });
        }
    }, [organizationId, branch, selectedProductIdFilter, limit]);
    return [projects, setProjects];
}