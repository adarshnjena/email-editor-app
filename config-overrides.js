const webpack = require('webpack');

module.exports = function override(config) {
    // Add fallbacks for Node.js core modules
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "fs": false,
        "buffer": require.resolve("buffer"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "zlib": require.resolve("browserify-zlib"),
        "process": require.resolve("process/browser.js")
    };

    // Provide global variables
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ]);

    // Configure module rules to handle ESM properly
    config.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    });

    return config;
};
