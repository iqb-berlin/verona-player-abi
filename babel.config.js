const presets = [
    [
      "@babel/env",
      {
        targets: {
          firefox: "1",
          chrome: "1",
          safari: "1",
          ie: "6"
        },
        useBuiltIns: "usage",
        corejs: '3'
      },
    ],
  ];
  
  module.exports = { presets };