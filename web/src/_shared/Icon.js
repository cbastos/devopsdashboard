import React from 'react';

export default function Icon({ src, alt, width = '30px', height = '30px' }) {
    return <img src={src} style={{ width, height, padding: 2 }} alt={alt || `icon from ${src}`} />
}
