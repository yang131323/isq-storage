const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const envConfig = {
    mode: 'development'
}

module.exports = merge(baseConfig, envConfig);