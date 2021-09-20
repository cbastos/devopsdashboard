import Keycloak from 'keycloak-js'
import { kc_server_url, kc_client_name, kc_realm_name } from '../_shared/config';

export default new Keycloak({ "url": kc_server_url, "realm": kc_realm_name, "clientId": kc_client_name });
