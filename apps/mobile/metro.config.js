const { withUniwindConfig } = require("uniwind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname, {
  includeWebReplay: false,
  includeWebFeedback: false,
});
const { transformer, resolver } = config;

// Normalize Windows backslashes in context.originModulePath for Sentry's Metro resolver
const originalResolveRequest = resolver.resolveRequest;
const customResolveRequest = (context, moduleName, platform, ...rest) => {
  const normalizedContext =
    context && context.originModulePath
      ? {
          ...context,
          originModulePath: context.originModulePath.replace(/\\/g, "/"),
        }
      : context;
  return originalResolveRequest
    ? originalResolveRequest(normalizedContext, moduleName, platform, ...rest)
    : context.resolveRequest(normalizedContext, moduleName, platform, ...rest);
};

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver = {
  ...resolver,
  resolveRequest: customResolveRequest,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  themes: ["light", "dark"],
  polyfills: {
    rem: 14,
  },
});
