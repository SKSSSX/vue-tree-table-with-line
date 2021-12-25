const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: ['@babel/polyfill', './index.js'],
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: 'index.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new CleanWebpackPlugin()],
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	devServer: {
		port: 8080,
	},
};
