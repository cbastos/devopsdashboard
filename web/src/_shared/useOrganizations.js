import { useState, useEffect } from 'react';
import { fetchApiJson } from './fetchJson';

export default function useOrganizations() {
    const [organizations, setOrganizations] = useState([]);
    useEffect(() => {
        setOrganizations([]);
        fetchApiJson(`/organizations`).then((newOrganizations) => setOrganizations(newOrganizations));
    }, []);
    return [organizations];
}