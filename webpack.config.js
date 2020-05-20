const path = require('path');
module.exports = {
    entry: './src/index.ts',
    target: 'node',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'] //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: [/\.ts?$/]
            },
            {
                test: /\.js?$/,
                include: path.resolve(__dirname, 'node_modules/inquirer'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ]
    },
}
