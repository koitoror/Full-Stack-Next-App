const lessPlugin = require('./less-plugin');
const nextComposePlugin = require('next-compose-plugin');

module.exports = nextComposePlugin([lessPlugin]);