const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const moment = require('moment');

// Mock historical data (replace with actual data source)
const historicalData = [
  { timestamp: 1672508225000, value: '0.00049' },
  { timestamp: 1672508325000, value: '0.00052' },
  { timestamp: 1672508425000, value: '0.00050' },
  // ... more data
];

app.get('/historical-rates', (req, res) => {
  try {
    const baseCurrency = req.query.base_currency;
    const targetCurrency = req.query.target_currency;
    const startTimestamp = parseInt(req.query.start);
    const endTimestamp = req.query.end ? parseInt(req.query.end) : moment().valueOf();

    // Filter historical data based on parameters
    const filteredData = historicalData.filter((entry) => {
      return entry.timestamp >= startTimestamp && entry.timestamp <= endTimestamp;
    });

    res.json({ results: filteredData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
