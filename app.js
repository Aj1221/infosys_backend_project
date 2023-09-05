// Import required libraries
const express = require('express');
const axios = require('axios');
const Datastore = require('nedb');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the NeDB database for the persistent store
const db = new Datastore({ filename: 'exchange_data.db', autoload: true });

// Replace with your Coinbase API endpoint
const COINBASE_API_URL = 'https://api.coinbase.com/v2/exchange-rates';

// Middleware to fetch and update exchange rates
app.use(async (req, res, next) => {
  try {
    // Fetch rates from the Coinbase API
    const base = req.query.base || 'fiat'; // Default to fiat
    const response = await axios.get(`${COINBASE_API_URL}?currency=${base}`);
    const rates = response.data.data.rates;

    // Save the rates to the persistent store
    db.update({ _id: 'exchange_data' }, { $set: { rates } }, { upsert: true }, (err, numReplaced) => {
      if (err) {
        console.error('Error updating persistent store:', err);
      }
    });

    next();
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    next();
  }
});

// Endpoint to get exchange rates
app.get('/exchange-rates', (req, res) => {
  // Retrieve rates from the persistent store
  db.findOne({ _id: 'exchange_data' }, (err, data) => {
    if (err) {
      console.error('Error fetching exchange rates from persistent store:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const base = req.query.base || 'fiat'; // Default to fiat
      const currencies = ['USD', 'SGD', 'EUR', 'BTC', 'DOGE', 'ETH'];
      const result = {};

      currencies.forEach((currency) => {
        result[currency] = data.rates[currency];
      });

      res.json(result);
    }
  });
});

// Endpoint to get historical rates
app.get('/historical-rates', (req, res) => {
  // Mock historical data (replace with actual data source)
  const historicalData = [
    { timestamp: 1672508225000, value: '0.00049' },
    { timestamp: 1672508325000, value: '0.00052' },
    { timestamp: 1672508425000, value: '0.00050' },
    // ... more data
  ];

  const baseCurrency = req.query.base_currency || 'USD'; // Default to USD
  const targetCurrency = req.query.target_currency || 'ETH'; // Default to ETH
  const startTimestamp = parseInt(req.query.start) || 1672508225000; // Default start time
  const endTimestamp = parseInt(req.query.end) || moment().valueOf(); // Default end time (current time)

  // Filter historical data based on parameters
  const filteredData = historicalData.filter((entry) => {
    return entry.timestamp >= startTimestamp && entry.timestamp <= endTimestamp;
  });

  res.json({ results: filteredData });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
