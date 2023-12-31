const withLess = require('next-with-less');
const path = require('path');

const pathToLessFileWithVariables = path.resolve('./styles/variables.less');

module.exports = withLess({
  // Optional: customize Less loader options
  lessLoaderOptions: {
    // javascriptEnabled: true,
    lessOptions: {
      modifyVars: {
        //   "primary-color": "#9900FF",
        '@primary-color': '#0050b3',
        'border-radius-base': '2px',
      },
    },
    additionalData: content =>
      `${content}\n\n@import '${pathToLessFileWithVariables}';`,
  },
  transpilePackages: [
    "antd",
    "rc-util",
    "@babel/runtime",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
});


// const nextConfig = {
//   transpilePackages: [
//     "antd",
//     "@babel/runtime",
//     "@ant-design/icons",
//     "@ant-design/icons-svg",
//   ],
// };

// module.exports = nextConfig;