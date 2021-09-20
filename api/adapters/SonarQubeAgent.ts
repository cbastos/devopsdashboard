import Tokens from './tokens';
import btoa from 'btoa';
import { inject, injectable } from 'inversify';
import TYPES from '../container.types';
import HttpClient from './httpClient';

const SONAR_METRICS = ['alert_status', 'security_rating', 'reliability_rating', 'sqale_rating', 'coverage',
    'duplicated_lines_density', 'code_smells', 'sqale_index', 'ncloc', 'bugs', 'vulnerabilities'];

@injectable()
export default class SonarQubeAgent {

    @inject(TYPES.HttpClient) private httpClient: HttpClient;

    getMetricsOf(id: string) {
        // TODO: extract to configuration constant
        const SONARQUBE_URL = '';
        const token = btoa(`${Tokens.SONARQUBE_TOKEN}:`);
        return this.httpClient.getJson(`${SONARQUBE_URL}/api/measures/component?metricKeys=${SONAR_METRICS.join()}&component=${id}`, {
            headers: { Authorization: `Basic ${token}` }
        });
    }
}
