// TODO: get from env variables
export const GITLAB_URL = '';
export const GITLAB_API_URL = `${GITLAB_URL}/api/v4`;
// TODO: get from env variables
export const GITLAB_TOKEN = '';
export const BUILD_HEALTH_COLORS = { success: 'green', failed: 'red' };

export const SONARQUBE_METRICS_IDS = [
    'alert_status', 'security_rating', 'reliability_rating', 'sqale_rating', 'coverage',
    'duplicated_lines_density', 'code_smells', 'sqale_index', 'ncloc', 'bugs', 'vulnerabilities'
];

// TODO: get from env variables
export const JIRA_URL = '';
export const SONARQUBE_URL = '';
export const CODE_QUALITY_ICON = '/codeanalysis.png';

export const BUILD_ICON = '/build.png';
export const CODEBASE_ICON = '/codebase.png';

export const NPM_PACKAGE_ICON = '/npm.png';
export const PRODUCTION_ICON = '/production.gif';
export const GITLAB_CONFIG = '/config.png';
export const DOCS_ICON = '/books.svg';
export const JIRA_ICON = '/jira.png';
export const NODEJS_ICON = '/nodejs.jpg';
export const REDIS_ICON = '/redis.jpg';
export const MYSQL_ICON = '/mysql.png';

// TODO: get from env variables
export const ARTIFACTORY_PACKAGES_URL = '';

//Colours
export const GREEN = '#3ea23e';
export const GREEN_LOW = '#e5ffe5';
export const RED = '#d03a3a';
export const RED_LOW = '#ffebeb';
export const BLUE = '#1976d2';
export const ORANGE = '#f76300';
export const YELLOW = '#ffe278';
export const WHITE = '#ffffff';
export const BLACK = '#333333';

//Icons
export const RIGHT_ARROW_ICON = '/right_arrow.png';
export const TEAM_ICON = '/team.png';
export const INT_ENV_ICON = '/INT_icon.png';
export const UAT_ENV_ICON = '/UAT_icon.png';
export const PRO_ENV_ICON = '/PRO_icon.png';

// TODO: get from env variables
export const JENKINS_URL = '';
export const JENKINS_LEGACY_URL = '';

export const TILE_THEMES = {
    NEUTRAL: 'neutral',
    SUCCESS: 'success',
    SUCCESS_LOW: 'success-low',
    ERROR: 'error',
    ERROR_LOW: 'error-low',
    WARNING: 'warning'
};

export const TILE_THEMES_COLORS = {
    [TILE_THEMES.NEUTRAL]: { background: WHITE, color: BLACK },
    [TILE_THEMES.SUCCESS]: { background: GREEN, color: WHITE },
    [TILE_THEMES.SUCCESS_LOW]: { background: GREEN_LOW, color: GREEN },
    [TILE_THEMES.ERROR]: { background: RED, color: WHITE },
    [TILE_THEMES.ERROR_LOW]: { background: RED_LOW, color: RED },
    [TILE_THEMES.WARNING]: { background: YELLOW, color: BLACK },
};

// TODO: get from env variables
export const CONFLUENCE_URL = '';
export const DEVOPS_PATH = 'devops';
export const GROUP_PERMISSION_ICON = '/gitlab_permission.png';

export const API_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
export const CONFLUENCE_API_URL = `${CONFLUENCE_URL}/rest/api`;

export const Roles = {
    SE_I: 1,
    SE_II: 2,
    S_SE_I: 3,
    S_SE_II: 4,
    TECHNICAL_LEAD: 5
};

//keycloak
export const kc_realm_name = 'dashboards';
export const kc_client_name = 'dashboards';
export const kc_server_url = 'http://localhost:85/auth';
export const kc_logout_redirect_url = 'http://localhost:85/';

export const SIDEBAR_WITH = 247;