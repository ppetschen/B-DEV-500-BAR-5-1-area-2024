const { default: plugin } = require("tailwindcss");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};

// const { default: plugin } = require("tailwindcss");

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ["nativewind/babel"],
//   };
// };