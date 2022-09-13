const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
						{test: /\.css$/i, use: ["style-loader", "css-loader"]},
						{test: /\.svg$/, use: 'file-loader'}],
	},
	devtool: "source-map",
	devServer: {
		static: path.join(__dirname, 'dist'),
		compress: false,
		port: 3000,
	},
	watch: true,
	plugins: [
		new HtmlWebpackPlugin({
			title: 'MyApp',
			template: 'src/index.tpl.html',
		}),
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	}
};
