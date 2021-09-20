import './Confluence.css';
import React, { useEffect, useState } from 'react';
import { CONFLUENCE_API_URL } from '../../_shared/config';

export function Confluence() {
    const [docs, setDocs] = useState([]);
    useEffect(() => { getDocumentsCompletion().then(setDocs); }, []);
    return <div className="confluence-docs-percentage"> <div className="progress"></div> </div>;
}

function getDocumentsCompletion() {
    const confluenceDocsQuery = `${CONFLUENCE_API_URL}/content/search?cql=type=page%20AND%20label=PI1%20AND%20label=completed%20AND%20label=doc`;
    return fetch(confluenceDocsQuery).then(d => d.json());
}