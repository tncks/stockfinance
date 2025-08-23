const stockService = require('../services/stock.service');  // manually modified from original path: '../../services/stock.service'

const getStockData = (req, res) => {
  const data = stockService.getCachedData();
  if (data.error) {
    return res.status(503).json({ message: 'Service Unavailable', error: data.error });
  }
  res.status(200).json(data);
};

const echo = (req, res) => {
  res.status(200).json({ you_sent: req.body });
};

module.exports = {
  getStockData,
  echo,
};
