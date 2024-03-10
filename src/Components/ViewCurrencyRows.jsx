// CurrencyRow.js
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CurrencyRow = ({ currency, exchangeRates, handleRemoveCurrency, comparisonCurrencies }) => {
    return (
        <div className="currency-row">
            <span className="currency-label">{currency.toUpperCase()}</span>
            <div className="currency-value">
                {Object.keys(exchangeRates).reverse().map((date, index, dates) => {
                    const roundedValue = Math.round(exchangeRates[date][currency] * 100) / 100;
                    let percentageChange = null;
                    if (index > 0 && exchangeRates[date][currency]) {
                        const previousDate = dates[index - 1];
                        const previousValue = Math.round(exchangeRates[previousDate][currency] * 100) / 100;
                        percentageChange = previousValue ? ((roundedValue - previousValue) / previousValue * 100).toFixed(2) : null;
                    }
                    return (
                        <div key={date} className="currency-data">
                            <span>{roundedValue ? roundedValue : "-"}</span>
                            {percentageChange && roundedValue && (
                                <span className="percentage-change" style={{ color: percentageChange >= 0 ? 'green' : 'red' }}>
                                    {percentageChange > 0 ? `+${percentageChange}` : percentageChange}%
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="icon-container">
            <Tooltip placement="top" title={comparisonCurrencies.length <= 3 ? "Minimum 3 currencies must be maintained" : ""}>
                <div>
                <IconButton disabled={comparisonCurrencies.length <= 3} aria-label="delete" onClick={() => handleRemoveCurrency(currency)}>
                    <DeleteIcon className={comparisonCurrencies.length <= 3 ? "DeleteIconDisable" : "DeleteIcon"} />
                </IconButton>
                </div>
                </Tooltip>
            </div>
        </div>
    );
};

export default CurrencyRow;
