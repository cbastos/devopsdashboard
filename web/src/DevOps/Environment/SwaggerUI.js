import React, { useEffect } from 'react';
import SwaggerUi, { presets } from 'swagger-ui';
import { GITLAB_URL, GITLAB_TOKEN } from '../../_shared/config';

const FACADE_PROJECT_TYPE = 5;
const XPL_PROJECT_TYPE = 3;
const SWAGGER_PATHS = { [FACADE_PROJECT_TYPE]: 'src%2Fmain%2Fresources%2Fswagger.json', [XPL_PROJECT_TYPE]: 'spec%2Fswagger.json' };

export default function SwaggerUI({ projectId, branch, type }) {
    const swaggerRoute = SWAGGER_PATHS[type];
    const isApi = type === FACADE_PROJECT_TYPE || type === XPL_PROJECT_TYPE;

    useEffect(() => {
        if (isApi) {
            SwaggerUi({
                dom_id: `#swagger-ui`,
                url: `${GITLAB_URL}/api/v4/projects/${projectId}/repository/files/${swaggerRoute}/raw?ref=${branch}`,
                presets: [presets.apis],
                requestInterceptor(request) {
                    request.headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
                    return request;
                }
            });
        }
    }, [swaggerRoute, projectId, branch, isApi]);

    return <> {isApi ? <div id="swagger-ui" /> : ''} </>;
}
