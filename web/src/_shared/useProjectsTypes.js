import { useState, useEffect } from 'react';
import { fetchApiJson } from './fetchJson';

export default function useProjectTypes(callback) {
    const [projectTypes, setProjectTypes] = useState([]);
    useEffect(() => {
        fetchApiJson(`/projects/types`).then((newProjectTypes) => {
            setProjectTypes(newProjectTypes);
            callback(newProjectTypes);
        })
    }, []);
    return [projectTypes];
}