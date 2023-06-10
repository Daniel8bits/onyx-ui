import React from 'react';
import Table from './Table';
import TableDocument from './TableDocument';

interface Person {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
}

const data: Person[] = [
  {
    id: 0,
    name: 'Fulano A',
    age: 20,
    gender: 'Male',
  },
  {
    id: 1,
    name: 'Ciclana B',
    age: 21,
    gender: 'Female',
  },
  {
    id: 2,
    name: 'Beltrano C',
    age: 22,
    gender: 'Male',
  },
  {
    id: 3,
    name: 'Fulano D',
    age: 23,
    gender: 'Male',
  },
  {
    id: 4,
    name: 'Ciclana E',
    age: 24,
    gender: 'Female',
  },
  {
    id: 5,
    name: 'Beltrano F',
    age: 25,
    gender: 'Male',
  },
  {
    id: 6,
    name: 'Fulano G',
    age: 26,
    gender: 'Male',
  },
  {
    id: 7,
    name: 'Ciclana H',
    age: 27,
    gender: 'Female',
  },
  {
    id: 8,
    name: 'Beltrano I',
    age: 28,
    gender: 'Male',
  },
  {
    id: 9,
    name: 'Ciclana J',
    age: 29,
    gender: 'Female',
  },
];

const config = {
  data,
  columns: ['nome', 'idade', 'sexo'],
  description(data: Person) {
    return {
      id: data.id.toString(),
      display: {
        nome: data.name,
        idade: data.age,
        sexo: data.gender,
      },
    };
  },
};

const document = new TableDocument<Person>(config);
const documentButPaged = new TableDocument<Person>({...config, maxRows: 3});

describe('Table Component', () => {
  const maxRows = documentButPaged.getMaxRows();

  const testPage = (page: number) => {
    cy.get('@row-amount').should('eq', maxRows);
    const i = page * maxRows;
    [i, i + 1, i + 2].forEach(v => {
      if (v >= data.length) return;
      cy.get(`td:contains("${data[v].name}")`).should('exist');
    });
  };

	it('should render content', () => {
		cy.mount(<Table document={document} />);

		cy.get('table').should('exist');
	});

  it('should render header', () => {
		cy.mount(<Table document={document} />);

    const columns = document.getColumns();
    
		cy.get(`th:contains("${columns[0]}")`).should('exist');
    cy.get(`th:contains("${columns[1]}")`).should('exist');
    cy.get(`th:contains("${columns[2]}")`).should('exist');
	});

  it('should render body', () => {
    cy.mount(<Table document={document} />);
    
    cy.get('tbody > tr').its('length').should('eq', data.length);
    for (const row of data) {
      cy.get(`td:contains("${row.name}")`).should('exist');
      cy.get(`td:contains("${row.age}")`).should('exist');
    }

    cy.get('td:contains("Male")').its('length').should('eq', 6);
    cy.get('td:contains("Female")').its('length').should('eq', 4);
  });

  it('should render controls when paged', () => {
    cy.mount(<Table document={documentButPaged} />);

		cy.get('tfoot').should('exist');
  });

  it('should change page when clicking the buttons', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('l%previous page').as('previous');
    cy.get('l%next page').as('next');
    cy.get('tbody > tr').its('length').as('row-amount');

    // Testing by next button
    testPage(0);
    cy.get('@next').realClick();
    testPage(1);
    cy.get('@next').realClick();
    testPage(2);
    cy.get('@next').realClick();
    testPage(3);

    // Testing by previous button
    cy.get('@previous').realClick();
    testPage(2);
    cy.get('@previous').realClick();
    testPage(1);
    cy.get('@previous').realClick();
    testPage(0);
  });

  it('should change paging input when clicking the buttons', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');
    cy.get('l%previous page').as('previous');
    cy.get('l%next page').as('next');

    // Testing by next button
    cy.get('@paging').should('have.value', 1);
    cy.get('@next').realClick();
    cy.get('@paging').should('have.value', 2);
    cy.get('@next').realClick();
    cy.get('@paging').should('have.value', 3);
    cy.get('@next').realClick();
    cy.get('@paging').should('have.value', 4);

    // Testing by previous button
    cy.get('@previous').realClick();
    cy.get('@paging').should('have.value', 3);
    cy.get('@previous').realClick();
    cy.get('@paging').should('have.value', 2);
    cy.get('@previous').realClick();
    cy.get('@paging').should('have.value', 1);
  });

  it('should change page when typing in the input', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');
    cy.get('tbody > tr').its('length').as('row-amount');

    cy.get('@paging').realClick({position: 'right'});

    testPage(0);
    cy.get('@paging').realType('{backspace}4');
    testPage(3);
    cy.get('@paging').realType('{backspace}2');
    testPage(1);
    cy.get('@paging').realType('{backspace}3');
    testPage(2);
    cy.get('@paging').realType('{backspace}1');
    testPage(0);
  });

  it('should not change page to lesser than 1 by previous button', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('l%previous page').as('previous');
    cy.get('tbody > tr').its('length').as('row-amount');

    testPage(0);
    cy.get('@previous').realClick();
    testPage(0);
  });

  it('should not change page to greather than the max by next button', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');
    cy.get('l%next page').as('next');
    cy.get('tbody > tr').its('length').as('row-amount');

    cy.get('@paging').realClick({position: 'right'});
    cy.get('@paging').realType('{backspace}4');

    testPage(3);
    cy.get('@next').realClick();
    testPage(3);
  });

  it('should not change page to lesser than 1 by typing in the paging input', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');
    cy.get('tbody > tr').its('length').as('row-amount');

    cy.get('@paging').realClick({position: 'right'});

    testPage(0);
    cy.get('@paging').realType('{backspace}0');
    testPage(0);
  });

  it('should not change page to greather than the max by typing in the paging input', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');
    cy.get('tbody > tr').its('length').as('row-amount');

    cy.get('@paging').realClick({position: 'right'});

    testPage(0);
    cy.get('@paging').realType('{backspace}5');
    testPage(0);
  });

  it('should not let type page to lesser than 1', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');

    cy.get('@paging').realClick({position: 'right'});

    cy.get('@paging').should('have.value', 1);
    cy.get('@paging').realType('{backspace}0');
    cy.get('@paging').should('have.value', '');
  });

  it('should not let type page to greather than the max', () => {
    cy.mount(<Table document={documentButPaged} />);
    cy.get('tfoot input').as('paging');

    cy.get('@paging').realClick({position: 'right'});

    cy.get('@paging').should('have.value', 1);
    cy.get('@paging').realType('{backspace}5');
    cy.get('@paging').should('have.value', '');
  });
});
