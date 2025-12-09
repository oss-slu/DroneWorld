module.exports = {
    plugins: [
        {
            plugin: require("craco-cesium")()
        }
    ],
    webpack: {
        configure: (webpackConfig) => {
            // Enable polling for file changes in Docker
            webpackConfig.watchOptions = {
                poll: 1000, // Check for changes every second
                aggregateTimeout: 300, // Delay before rebuilding
                ignored: /node_modules/,
            };
            return webpackConfig;
        },
    },
};