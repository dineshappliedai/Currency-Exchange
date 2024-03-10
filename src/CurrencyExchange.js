import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, IconButton, Grid, Card, Typography, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CurrencyExchange.css";
import { useToast } from './ToastContext';
import Divider from '@mui/material/Divider';
import RemoveIcon from '@mui/icons-material/Remove';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CurrencyRow from './Components/ViewCurrencyRows';


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
        const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
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
                const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateString}/v1/currencies/${baseCurrency.toLocaleLowerCase()}.json`);
                // if (!response.ok) throw new Error('Failed to fetch');
                if (response.status === 404) {

                    tempExchangeRates[dateString] = {}
                }
                const data = await response.json();
                tempExchangeRates[dateString] = data[baseCurrency]
                isSuccess = true
            } catch (error) {
                console.log(error);
                isSuccess = false
                console.log(`Data not available for ${dateString}`);
                toast(` Data not avaliable for${dateString}`, "error")
                // break;
            }
        }
        setExchangeRates(tempExchangeRates);
        setIsLoading(false);
        console.log(tempExchangeRates);
        // if (Object.keys(tempExchangeRates).length > 0 && isSuccess) {

        //     toast(` Data Updated Successfully`, "success")
        // }
    };

    const handleBaseCurrencyChange = (value) => {
        console.log(value);
        if (!value) return;
        setBaseCurrency(value["key"]);
    };

    const handleRemoveCurrency = (currency) => {
        setComparisonCurrencies(comparisonCurrencies.filter(c => c !== currency));
        toast(`${currency.toUpperCase()} Removed`, "success")
    };

    const handleAddCurrency = (newValue) => {
        console.log(newValue);

        const value = newValue?.key
        if (!value || comparisonCurrencies.includes(value) || comparisonCurrencies.length >= 7) return;
        setComparisonCurrencies([...comparisonCurrencies, value.toLowerCase()]);
        // toast(`${newValue.toUpperCase()} Added`, "success")
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
        // Trigger any additional actions like fetching API data here
    };

    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear();
    };



    return (
        <Card className="currency-exchange-container">
            {isLoading && (
                <div className="loader-container">
                    <CircularProgress />
                </div>
            )}

            {/* <Grid container  className='container'> */}
            <Grid className="currency-exchange-heading">
                Currency Exchange
            </Grid>

            <Grid className='baseBar'>
                <Grid className="base-currency">
                    <Typography variant='h5'>From: </Typography>
                    <Autocomplete
                        options={Object.entries(currencies).map(([key, value]) => ({ key, value }))}
                        getOptionLabel={(option) => `${option.key} - ${option.value}`}
                        renderInput={(params) => <TextField {...params} label="Base Currency" />}
                        value={currencies.hasOwnProperty(baseCurrency) ? { key: baseCurrency, value: currencies[baseCurrency] } : null}

                        onChange={(event, newValue) => handleBaseCurrencyChange(newValue)}

                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        fullWidth
                        sx={{
                            "& .MuiAutocomplete-inputRoot": {
                                color: "info.main", // Example to style the input color
                            }
                        }}
                    />
                </Grid>
                <Grid className="base-currency">
                    <Typography variant='h5'>To: </Typography>
                    <Tooltip placement="right-start" title={comparisonCurrencies.length >= 7 ? "Maximum 7 currencies can be added" : ""}>
                        <div style={{width:"25rem"}}>
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
                    <Typography variant='h6'> Date: </Typography>

                    <IconButton onClick={decrementDate}>
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <Grid item >
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="date-picker-custom"
                            maxDate={new Date()}
                            minDate={new Date(new Date().setDate(new Date().getDate() - 90))}
                        />
                    </Grid>
                    <IconButton disabled={isToday(selectedDate)} onClick={incrementDate} className='forwardArrow'>
                        <ArrowForwardIosIcon />
                    </IconButton>
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


            {/* </Grid> */}
        </Card>
    );
}

export default CurrencyExchange;
