import React from 'react';

export default function ExternalLink({ href, children }) {
    return <a target="_blank" href={href} rel="noopener noreferrer">{children}</a>;
}