/* eslint-disable cypress/no-unnecessary-waiting */
describe('Transition', () => {
  const origin = 'http://localhost:8111';
  const prefix = 'packages/core/__web__';
  const page = 'page.html';
  const query = '?query=string';
  const hash = '#hash';

  it('default URL', () => {
    cy.prepare('/href.html', 'href', 'href');
    cy.get('[data-test=link]').click();

    cy.location().should(loc => {
      expect(loc.href).to.eq(`${origin}/${prefix}/${page}`);
      expect(loc.toString()).to.eq(`${origin}/${prefix}/${page}`);
      expect(loc.pathname).to.eq(`/${prefix}/${page}`);
    });
    cy.final('/page.html', 'page', 'page');
  });

  it('query string URL', () => {
    cy.prepare('/href.html', 'href', 'href');
    cy.get('[data-test=query]').click();

    cy.location().should(loc => {
      expect(loc.href).to.eq(`${origin}/${prefix}/${page}${query}`);
      expect(loc.toString()).to.eq(`${origin}/${prefix}/${page}${query}`);
      expect(loc.pathname).to.eq(`/${prefix}/${page}`);
      expect(loc.search).to.eq(query);
    });
    cy.final('/page.html', 'page', 'page');
  });

  it('hash URL', () => {
    cy.prepare('/href.html', 'href', 'href');
    cy.get('[data-test=hash]').click();

    cy.location().should(loc => {
      expect(loc.href).to.eq(`${origin}/${prefix}/${page}${hash}`);
      expect(loc.toString()).to.eq(`${origin}/${prefix}/${page}${hash}`);
      expect(loc.pathname).to.eq(`/${prefix}/${page}`);
      expect(loc.hash).to.eq(hash);
    });
    cy.final('/page.html', 'page', 'page');
  });

  it('hash + query URL', () => {
    cy.prepare('/href.html', 'href', 'href');
    cy.get('[data-test=complex]').click();

    cy.location().should(loc => {
      expect(loc.href).to.eq(`${origin}/${prefix}/${page}${query}${hash}`);
      expect(loc.toString()).to.eq(
        `${origin}/${prefix}/${page}${query}${hash}`
      );
      expect(loc.pathname).to.eq(`/${prefix}/${page}`);
      expect(loc.search).to.eq(query);
      expect(loc.hash).to.eq(hash);
    });
    cy.final('/page.html', 'page', 'page');
  });
});
