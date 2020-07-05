/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // dependencies: {
  //   '<dependency>': {
  //     platforms: {
  //       android: null, // disable Android platform, other platforms will still autolink
  //     },
  //   },
  // },
};
