const withLess = require('next-with-less');
const path = require("path");

const pathToLessFileWithVariables = path.resolve(
  "your-file-with-antd-variables.less"
);

module.exports = withLess({
  // Optional: customize Less loader options
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: {
        // '@primary-color': '#0050b3',
        "primary-color": "#9900FF",
        "border-radius-base": "2px",

        /* ... */
      },
      additionalData: (content) =>
      `${content}\n\n@import '${pathToLessFileWithVariables}';`,
  },
});