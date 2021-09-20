/// <reference types="cypress" />

const { REVERSE_PROXY_URL } = require('./config');

context('The API', () => {
  beforeEach(() => {
    cy.visit(`${REVERSE_PROXY_URL}/api`);
  });

  describe('when accessing the Swagger UI', () => {

    it('should be served on base path', () => {
      cy.get('h2').contains('@devopsdashboard/api');
    });

    it('should load available operations', () => {
      cy.get('.opblock-get').then((elements) => {  expect(elements.length).to.be.greaterThan(1) });
    });

  });

})
