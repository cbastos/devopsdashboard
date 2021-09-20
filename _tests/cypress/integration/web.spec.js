const { REVERSE_PROXY_URL } = require('./config');

context('The web', () => {

  xit('should serve the login on base path', () => {
    cy.visit(`${REVERSE_PROXY_URL}/`);
    cy.get('.MuiButton-label').contains('Sign In');
  });

  xit('should load employeees', () => {
    cy.visit(`${REVERSE_PROXY_URL}/digital-tribe/people`);
    cy.get('.MuiChip-root').then((elements) => { expect(elements.length).to.be.greaterThan(5) });
  });

  xit('should load projects', () => {
    cy.visit(`${REVERSE_PROXY_URL}/digital-tribe/devops`);
    cy.get('.pipeline').then((elements) => { expect(elements.length).to.be.greaterThan(5) });
  });

})
