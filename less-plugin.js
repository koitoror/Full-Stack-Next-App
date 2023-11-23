const { webpack } = require('next-compose-plugins');
const less = require('less');

module.exports = function (webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.module\.less$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
        },
      },
    ],
  });

  return webpackConfig;
};
