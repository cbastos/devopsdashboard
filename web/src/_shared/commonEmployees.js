import { Roles } from './config';

export default function getBadgesRoles() {
    return {
	    [Roles.SE_I]: { tag: 'DEV', theme: 'secondary' },
	    [Roles.SE_II]: { tag: 'DEV', theme: 'secondary' },
	    [Roles.S_SE_I]: { tag: 'SDEV', theme: 'secondary' },
	    [Roles.S_SE_II]: { tag: 'SDEV', theme: 'secondary' },
	    [Roles.TECHNICAL_LEAD]: { tag: 'TL', theme: 'primary' },
	};
}