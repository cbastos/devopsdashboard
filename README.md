# Product

This web product gives an integral vision of a development team, both in terms of organizational structure and about the main DevOps processes.

## Disclaimer

This project has begun as, and up to this day is, an experimental tool and it's been created with explorative purposes, in spare times and adding metrics as well as ad-hoc funtionality under the given needs.

The focus has been set on the personal data consumption more than the code cleaning, testing or general mantainability (totally needed in any professional app), for which **no effort has been made**.

## Architecture

It has the following parts:

- **Web (SPA)** (Single Page Application): web with the app's user interface.
- **Web API**: web api para to access the tools APIs with activated CORS and the BBDD.
- **Cache**: redis cache for the heavy to recover data storage.
- **Data Base**: using MySQL and phpMyAdmin for the data base administration.
- **Observability**: using prometheus, prometheus exporters and grafana, this layer adds the functionality of monitorizing the performance of the api, data base and cache.
- **Proxy inverso**: using nginx, routes under the same url the different cache microservices, observability, web api, etc, adding anonymity, encryption, compression, etc. The architecture diagram also works.

## Technologies

The most relevant technologies used on each layer are:

- **SPA**:
  - **Libraries**: React
  - **Languages**: JSX, JavaScript, CSS
- **WebApi**:
  - **Relevant dependencies**:
    - _swagger-autogen_: (generates a swagger.json file based on express endpoints and comments inside each api endpoint method describing params, return posibilities, etc). See [documentation](https://www.npmjs.com/package/swagger-autogen) to learn more about comments nomenclature.
    - _swagger-ui-express_: creates a web interface with a playground to launch requests to the own web api. You can see the generated swagger ui at the root ("/") of the api after starting the api project.
  - **Framework**: nodejs, express
  - **Languages**: JavaScript
- **Cache**:
  - **Product**: Redis
- **Data Base**:
  - **Languages**: SQL
  - **SGBD**: MySQL
- **Interface for data base management**:
  - **Product**: PhpMyAdmin
- **Observability**:
  - **Products**: Prometheus, exporters de prometheus y Grafana.
- **Reverse Proxy**:
  - **Products**: Nginx
- **Authentication Server**:
  - **Products**: Keycloak

## Execution requirements

In orther to execute this tool, the consumer can do it in local and he needs to:

- Have Docker installed

## Instalation and usage

1. Download the repository

   ```bash
   git clone https://github.com/cbastos/devopsdashboard.git
   cd devopsdashboard
   ```

2. Run docker-compose: by executing:

   ```bash
       run.cmd
   ```

3. Access:

- The architecture diagram of this application is here: http://localhost:85/architecture.html. Here you will be able to access each architecture part, as well as to visit the technologies and products sites used by clicking on the icons.

## Data

The data is loaded directly as a data seed in the api startup through the SQL sentences which are in the file ./api/database/scripts/loadSeedEntitiesData.sql.
The data base structure (tables and relations) are loaded through the instructions in the file ./api/database/scripts/createTables.sql.

On init api will recovery most data about projects, requesting info from sonar, gitlab, jenkins... It will happens in start, and data will recovery in chunk of 5. Also will be a daemon which refresh data every day at 12:30 PM.

This info is configurable in config.json inside api (/api/config/config.json), time, chunk, data to cache its configurable.

## Keycloak configuration

The keycloak authentication server automatically loads the default configuration and two dummy users to test management by role:

- USER: administrator / PASS: 12345 / REALM_ROLE: app-admin / CLIENT_ROLE: DashboardsAdmin
- USER: baseuser / PASS: 12345 / REALM_ROLE: app-user / CLIENT_ROLE: DashboardsUser

In the event that you want to modify the initial configuration with which the keycloak container is started, the following command must be executed from the container's console:

```bash
  ./bin/standalone.sh -Dkeycloak.profile.feature.upload_scripts=enabled -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=dir -Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.dir=/opt/jboss/keycloak/imports -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Dkeycloak.migration.usersPerFile=1000
```

How to protect an api endpoint with role?
In order to protect an API endpoint, you must indicate the keycloak.protect as the example showed below:

```bash
  api.get('/api/jira/issues/types', keycloak.protect("dashboards:DashboardsAdmin"), async (req, res) => {
    res.json(await this.backlogRetriever.getIssueTypes());
  });
```

The parameter which is indicated in the function protect, depends on the role's configuration. If you want to allow access users which have REALM_ROLE permission you have to indicate 'realm:<role_name>'. However, if you want to allow access to users which have CLIENT_ROLE, you have to indicate '<client_name>:<role_name>'. It is not necesary to indicate the client_name if keycloak has been already configurated for this client.
