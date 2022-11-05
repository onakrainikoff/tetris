const path = require('path')

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/ts/index.ts'),
    },
    output: {
        path: path.resolve(__dirname, './dist/js'),
        filename: '[name].bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    }
}