import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CurrencyRow from './ViewCurrencyRows';

describe('CurrencyRow', () => {
  it('calls handleRemoveCurrency on delete button click if comparisonCurrencies length is more than 3', () => {
    const mockHandleRemoveCurrency = jest.fn();
    render(
      <CurrencyRow
        currency="usd"
        exchangeRates={{ '2021-01-01': { usd: 1.1 }, '2021-01-02': { usd: 1.2 } }}
        handleRemoveCurrency={mockHandleRemoveCurrency}
        comparisonCurrencies={['usd', 'eur', 'jpy', 'chf', 'cad',]}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockHandleRemoveCurrency).toHaveBeenCalledWith('usd');
  });

  it('does not call handleRemoveCurrency if comparisonCurrencies length is 3 or less', () => {
    const mockHandleRemoveCurrency = jest.fn();
    render(
      <CurrencyRow
        currency="usd"
        exchangeRates={{ '2021-01-01': { usd: 1.1 }, '2021-01-02': { usd: 1.2 } }}
        handleRemoveCurrency={mockHandleRemoveCurrency}
        comparisonCurrencies={['usd', 'eur', 'jpy']}
      />
    );

    // Query the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Expect the mock function not to be called since the button is disabled
    expect(mockHandleRemoveCurrency).not.toHaveBeenCalled();
  });
});
