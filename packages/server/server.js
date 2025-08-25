const app = require('./src/app');
const { initializeStockData } = require('./src/services/stock.service');

const port = process.env.PORT || 3000;

// Initialize data on startup
/* * * * initializeStockData(); * * * disabled temporarily * */

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});