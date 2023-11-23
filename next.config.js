const nextComposePlugin = require('next-compose-plugins');

const lessPlugin = require('./less-plugin');

module.exports = nextComposePlugin([lessPlugin]);