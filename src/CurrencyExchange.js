import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Autocomplete, Card, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from './Components/CustomDatePicker';
import CurrencyRow from './Components/ViewCurrencyRows';
import { isToday } from './Components/helper';
import "./CurrencyExchange.css";
import { useToast } from './ToastContext';
import { CURRENCIES_API, getCurrencyApiUrl } from './Components/EndPoints';


function CurrencyExchange() {
    const [currencies, setCurrencies] = useState([]);
    const [baseCurrency, setBaseCurrency] = useState('gbp');
    const [comparisonCurrencies, setComparisonCurrencies] = useState(['usd', 'eur', 'jpy', 'chf', 'cad', 'aud', 'zar']);
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);


    const { toast } = useToast();

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (comparisonCurrencies.length) {
            fetchRatesForWeek();
        }
    }, [baseCurrency, selectedDate, comparisonCurrencies]);

    const fetchCurrencies = async () => {
        const response = await fetch(CURRENCIES_API);
        const data = await response.json();
        setCurrencies(data);
    };

    const fetchRatesForWeek = async () => {
        setIsLoading(true);
        let isSuccess = false;
        let tempExchangeRates = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            isSuccess = false
            try {
                const response = await fetch(getCurrencyApiUrl(dateString, baseCurrency.toLocaleLowerCase()));
                if (response.status === 404) {

                    tempExchangeRates[dateString] = {}
                }
                const data = await response.json();
                tempExchangeRates[dateString] = data[baseCurrency]
                isSuccess = true
            } catch (error) {
                console.log(error);
                toast(` Data not avaliable for${dateString}`, "error")
                // break;
            }
        }
        setExchangeRates(tempExchangeRates);
        setIsLoading(false);
    };

    const handleBaseCurrencyChange = (value) => {
        if (!value) return;
        setBaseCurrency(value["key"]);
    };

    const handleRemoveCurrency = (currency) => {
        setComparisonCurrencies(comparisonCurrencies.filter(c => c !== currency));
        toast(`${currency.toUpperCase()} Removed`, "success")
    };

    const handleAddCurrency = (newValue) => {

        const value = newValue?.key
        if (!value || comparisonCurrencies.includes(value) || comparisonCurrencies.length >= 7) return;
        setComparisonCurrencies([...comparisonCurrencies, value.toLowerCase()]);
    };


    const incrementDate = () => {
        setSelectedDate((currentDate) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    const decrementDate = () => {
        setSelectedDate((currentDate) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    return (
        <Card className="currency-exchange-container">
            {isLoading && (
                <div className="loader-container">
                    <CircularProgress />
                </div>
            )}

            <Grid className="currency-exchange-heading">
                Currency Exchange
            </Grid>

            <Grid className='baseBar'>
                <Grid className="base-currency">
                    <Typography variant='h5'>From: </Typography>
                    <Autocomplete
                        options={Object.entries(currencies).map(([key, value]) => ({ key, value }))}
                        getOptionLabel={(option) => `${option.key.toUpperCase()} - ${option.value}`}
                        renderInput={(params) => <TextField {...params} label="Base Currency" />}
                        value={currencies.hasOwnProperty(baseCurrency) ? { key: baseCurrency, value: currencies[baseCurrency] } : null}

                        onChange={(event, newValue) => handleBaseCurrencyChange(newValue)}

                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        fullWidth
                        sx={{
                            "& .MuiAutocomplete-inputRoot": {
                                color: "info.main",
                            }
                        }}
                    />
                </Grid>
                <Grid className="base-currency">
                    <Typography variant='h5'>To: </Typography>
                    <Tooltip placement="top" title={comparisonCurrencies.length >= 7 ? "Maximum 7 currencies can be added" : ""}>
                        <div style={{ width: "25rem" }}>
                            <Autocomplete
                                id="add-currency"
                                options={Object.entries(currencies)
                                    .map(([key, value]) => ({ key, value }))
                                    .filter(({ key }) => !comparisonCurrencies.includes(key))}
                                getOptionLabel={(option) => `${option.key.toUpperCase()} - ${option.value}`}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Add Currency"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                                onChange={(event, newValue) => {
                                    handleAddCurrency(newValue);
                                }}
                                isOptionEqualToValue={(option, value) => option.key === value.key}
                                disabled={comparisonCurrencies.length >= 7}
                                fullWidth
                                sx={{
                                    "& .MuiAutocomplete-inputRoot": {
                                        color: "info.main",
                                    }
                                }}
                            />
                        </div>
                    </Tooltip>
                </Grid>
                <Grid className='date'>
                    <Typography variant='h5'> Date: </Typography>

                    <Tooltip placement="top" title={"Previous Day"}>

                        <IconButton onClick={decrementDate}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </Tooltip>
                    <Grid item >
                        <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                    </Grid>
                    <Tooltip placement="top" title={"Next Day"}>

                        <IconButton disabled={isToday(selectedDate)} onClick={incrementDate} className='forwardArrow'>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>

            </Grid>
            <Grid xs={12} sm={6} className="currency-exchange-container">
                <div className="currency-header-row">
                    <span className="currency-label">Date</span>
                    {Object.keys(exchangeRates).reverse().map((date) => {
                        const shortDate = date.slice(5).replace('-', '/');
                        return (
                            <div key={date} id="currency-date-first-line" className="currency-date">
                                <span>{shortDate}</span>
                            </div>
                        );
                    })}
                </div>
                {comparisonCurrencies.map((currency) => (
                    <CurrencyRow
                        key={currency}
                        currency={currency}
                        exchangeRates={exchangeRates}
                        handleRemoveCurrency={handleRemoveCurrency}
                        comparisonCurrencies={comparisonCurrencies}
                    />
                ))}

            </Grid>
        </Card>
    );
}

export default CurrencyExchange;
