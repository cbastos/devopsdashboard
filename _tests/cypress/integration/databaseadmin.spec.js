const DATABASE_ADMIN_URL = 'http://localhost:8082';

context('The database admin (phpmyadmin)', () => {

  it('should be served on base path', () => {
    cy.visit(`${DATABASE_ADMIN_URL}/`);
    cy.get('h1').contains('phpMyAdmin');
  });

  it('can admin the database', () => {
    cy.visit(`${DATABASE_ADMIN_URL}/`);
    //TODO: get user and password from environment variables
    cy.get('input[name=pma_username]').type('root');
    cy.get('input[name=pma_password]').type('12345');
    cy.get('input[value=Go]').click();
    cy.get('#page_content').contains('General settings');
  });

})
