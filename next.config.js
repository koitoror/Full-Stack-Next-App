const nextComposePlugin = require('next-compose-plugin');

const lessPlugin = require('./less-plugin');

module.exports = nextComposePlugin([lessPlugin]);