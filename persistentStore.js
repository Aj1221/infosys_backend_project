const Datastore = require('nedb');

// Initialize the NeDB database
const db = new Datastore({ filename: 'exchange_data.db', autoload: true });

// Function to insert or update exchange rates
const saveExchangeRates = (data) => {
  return new Promise((resolve, reject) => {
    db.update({ _id: 'exchange_data' }, data, { upsert: true }, (err, numReplaced) => {
      if (err) {
        reject(err);
      } else {
        resolve(numReplaced);
      }
    });
  });
};

// Function to fetch exchange rates
const getExchangeRates = () => {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: 'exchange_data' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { saveExchangeRates, getExchangeRates };
