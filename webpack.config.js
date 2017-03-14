var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: ['./index.ts'],
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true,
    },
    target: 'node',
    output: {
        filename: "./build/service.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    plugins: [
        new webpack.DefinePlugin({
            $dirname: '++dirname',
        }),
    ],

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};

