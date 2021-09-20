import React, { useState, useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import Icon from '../../_shared/Icon';
import { DEVOPS_PATH } from '../../_shared/config';

export default function ToggleRouteLinkIcon({ to, src }) {
    const [opened, setOpened] = useState(window.location.pathname === to);
    const { organizationid: organizationId } = useParams();
    const history = useHistory();
    useEffect(() => {
        const unlisten = history.listen(({ pathname }) => setOpened(pathname === to));
        return () => unlisten();
    }, []);
    const finalPath = opened ? `/organizations/${organizationId}/${DEVOPS_PATH}/` : to;
    return <div className={opened ? 'is-active' : ''}>
        <NavLink to={finalPath}>
            <Icon src={src}></Icon>
        </NavLink>
    </div>;
}