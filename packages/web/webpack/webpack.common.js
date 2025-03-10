const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Where webpack looks to start building the bundle
    entry: path.resolve(__dirname, '../src/index.tsx'),

    // Where webpack outputs the assets and bundles
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    // Customize the webpack build process
    plugins: [
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // Copies files from target to destination folder
        // new CopyWebpackPlugin({
        //   patterns: [
        //     {
        //       from: path.resolve(__dirname, '../public'),
        //       to: 'assets',
        //       globOptions: {
        //         ignore: ['*.DS_Store'],
        //       },
        //     },
        //   ],
        // }),

        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501

        new HtmlWebpackPlugin({
            title: 'Flashcards project',
            //   favicon: paths.src + '/images/favicon.png',
            template: path.resolve(__dirname, '../src/index.html'), // template file
            filename: 'index.html', // output file
        }),
    ],

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(css)$/,
                use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } }],
            },

            // Images: Copy image files to build folder
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

            // Fonts and SVGs: Inline files
            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
        ],
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'images': path.resolve(__dirname, '../src/images'),
            'styles': path.resolve(__dirname, '../src/styles'),
            'components': path.resolve(__dirname, '../src/components'),
            'pages': path.resolve(__dirname, '../src/pages'),
            'styles': path.resolve(__dirname, '../src/styles'),
            'types': path.resolve(__dirname, '../src/types'),
        },
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
};
