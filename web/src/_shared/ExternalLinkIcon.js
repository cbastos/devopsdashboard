import React from 'react';
import Icon from './Icon';
import ExternalLink from './ExternalLink';

export default function ExternalLinkIcon({ src, href }) {
    return <ExternalLink href={href}>
        <Icon src={src}></Icon>
    </ExternalLink>;
}
