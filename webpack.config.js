const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const path = require('path');
const config = require('ramber/config/webpack.js');
const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const alias = { hamber: path.resolve('node_modules', 'hamber') };
const extensions = ['.mjs', '.js', '.json', '.hamber', '.html'];
const mainFields = ['hamber', 'module', 'browser', 'main'];

module.exports = {
	client: {
		entry: config.client.entry(),
		output: config.client.output(),
		resolve: { alias, extensions, mainFields },
		module: {
			rules: [
				{
					test: /\.(hamber|html)$/,
					use: {
						loader: 'hamber-loader',
						options: {
							dev,
							hydratable: true,
							hotReload: false
						}
					}
				}
			]
		},
		mode,
		plugins: [
			// dev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
		].filter(Boolean),
		devtool: dev && 'inline-source-map'
	},

	server: {
		entry: config.server.entry(),
		output: config.server.output(),
		target: 'node',
		resolve: { alias, extensions, mainFields },
		externals: Object.keys(pkg.dependencies).concat('encoding'),
		module: {
			rules: [
				{
					test: /\.(hamber|html)$/,
					use: {
						loader: 'hamber-loader',
						options: {
							css: false,
							generate: 'ssr',
							hydratable: true,
							dev
						}
					}
				}
			]
		},
		mode,
		plugins: [
			new WebpackModules()
		],
		performance: {
			hints: false // it doesn't matter if server.js is large
		}
	},

	serviceworker: {
		entry: config.serviceworker.entry(),
		output: config.serviceworker.output(),
		mode
	}
};
