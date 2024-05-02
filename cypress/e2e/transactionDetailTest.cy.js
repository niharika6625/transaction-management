// Custom unit test

const apiUrl = `${Cypress.env("apiUrl")}`

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

describe('Transaction Management Backend - Unit test', () => {

  it('The app can submit new transactions and navigate to transaction-detail page', () => {
    cy.visit('/')

    const accountId = uuid()
    const amount = 13
    const balance = 13
    cy.get('[data-type=account-id]').type(accountId)
    cy.get('[data-type=amount]').type(amount)
    cy.get('[data-type=transaction-submit]').click()
    cy.get(`[data-type=transaction][data-account-id=${accountId}][data-amount=${amount}][data-balance=${balance}]`).should('exist')

    cy.get('[data-type=transaction]').first().then(($transactionCard) => {
      const transactionId = $transactionCard.attr('data-transaction-id')
      // Break up the command chain and add an explicit wait
      cy.wrap(null).should(() => {
        $transactionCard.find('[data-type=transaction-detail]').click()
      })
      cy.url().should('include', `/transaction/${transactionId}`)
      cy.get('h1').should('exist').contains('Transaction Details')
    })
  })
})
