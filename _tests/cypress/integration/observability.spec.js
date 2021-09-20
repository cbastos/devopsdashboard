const { REVERSE_PROXY_URL } = require('./config');

context('The observability', () => {

  describe('when accesing the traces collector (Jaeger)', () => {

    it('should be served at /traces path', () => {
      cy.visit(`${REVERSE_PROXY_URL}/traces`);
      cy.get('.ant-layout-header').contains('JAEGER UI');
    });

  });

  describe('when accesing the metrics collector (Prometheus)', () => {

    it('should be served at /metrics path', () => {
      cy.visit(`${REVERSE_PROXY_URL}/metrics`);
      cy.get('.navbar-brand').contains('Prometheus');
    });

    it('should have the redis exporter connected', () => {
      it_should_load_metric('redis_allocator_frag_bytes');
    });

    it('should have the mysql exporter connected', () => {
      it_should_load_metric('mysql_exporter_scrapes_total');
    });

    it('should have the web api exporter connected', () => {
      it_should_load_metric('nodejs_version_info');
    });

    function it_should_load_metric(metric_name) {
      cy.visit(`${REVERSE_PROXY_URL}/metrics`);
      cy.get('textarea').type(metric_name);
      cy.get('.execute-btn').click();
      cy.get('.legend-metric-name').contains(metric_name);
    }

  });

  describe('when accessing the metrics dashboards (grafana)', () => {

    it('should be served at /metrics/dashboards path', () => {
      cy.visit(`${REVERSE_PROXY_URL}/metrics/dashboards`);
      cy.get('h1').contains('Welcome to Grafana');
    });

    it('should have a node.js overview dashboard', () => {
      it_should_load_dashboard('node', 'Node.js Dashboard')
    });

    it('should have a mysql overview dashboard', () => {
      it_should_load_dashboard('mysql', 'MySQL Overview')
    });

    it('should have a redis overview dashboard', () => {
      it_should_load_dashboard('redis', 'Redis Dashboard')
    });


    function it_should_load_dashboard(keyword, dashboard_name) {
      cy.visit(`${REVERSE_PROXY_URL}/metrics/dashboards`);
      //TODO: get user and password from environment variables
      cy.get('input[name=user]').type('root');
      cy.get('input[name=password]').type('12345');
      cy.get('button').click();
      cy.visit(`http://localhost:85/metrics/dashboards/?query=${keyword}&search=open&orgId=1`);
      cy.get('search-wrapper').contains(dashboard_name);
    }

  });

});
