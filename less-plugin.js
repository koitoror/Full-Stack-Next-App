const { webpack } = require('next-compose-plugin');
const less = require('less');

module.exports = webpack(({ config }) => {
  config.module.rules.push({
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

  return config;
});
