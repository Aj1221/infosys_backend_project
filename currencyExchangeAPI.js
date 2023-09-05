const express = require('express');
const axios = require('axios');
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 3000;
const { saveExchangeRates, getExchangeRates } = require('./persistentStore');


// Replace with your Coinbase API endpoint
const COINBASE_API_URL = 'https://api.coinbase.com/v2/exchange-rates';

app.get('/rates', async (req, res) => {
    try {
      const base = req.query.base;
  
      // Try to fetch rates from the persistent store
      let rates = await getExchangeRates();
  
      if (!rates) {
        // If data is not available, fetch from Coinbase API
        const response = await axios.get(`${COINBASE_API_URL}?currency=${base}`);
        rates = response.data.data.rates;
  
        // Save the fetched rates to the persistent store
        await saveExchangeRates(rates);
      }
  
      // Extract relevant currencies
      const currencies = ['USD', 'SGD', 'EUR'];
      const result = {};
  
      currencies.forEach((currency) => {
        result[currency] = rates[currency];
      });
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
