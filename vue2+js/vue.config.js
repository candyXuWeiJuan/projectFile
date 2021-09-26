/*
 * @Description:
 * @Version: 2.0
 * @Autor: zhangyi
 * @Date: 2021-06-10 20:56:45
 * @LastEditors: zhangyi
 * @LastEditTime: 2021-06-23 10:52:35
 */
const debug = process.env.NODE_ENV !== 'production'
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	outputDir: 'dist',
	assetsDir: 'assets',
	productionSourceMap: false,
	filenameHashing: false,
	lintOnSave: false,
	runtimeCompiler: true,
	configureWebpack: config => {
		if (debug) {
			// 开发环境配置
			config.devtool = 'source-map'
		}
	},
	chainWebpack: config => {
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap(args => {
				args.compilerOptions.whitespace = 'preserve'
			})
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@page', resolve('src/view/page'))
			.set('@common', resolve('src/view/common'))
			.set('@components', resolve('src/view/components'))
			.set('@utils', resolve('src/utils'))
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true,
				},
			},
		},
	},
	devServer: {
		watchOptions: {
			ignored: ['node_modules'],
			aggregateTimeout: 300,
			poll: 1500,
		},
		open: true,
		host: '0.0.0.0',
		port: 9099,
		https: false,
		hotOnly: true,
		// overlay: {
		//     warnings: false,
		//     errors: false
		// },
		/* 使用代理 */
		proxy: {
			'/api/iwater': {
				target: 'http://iwater-pc.hw-qa.eslink.net.cn',
				// target: 'http://iwater-screen-server.hw-qa.eslink.net.cn',
				// target: 'http://jinkawebdev.vaiwan.com',
				// pathRewrite: { '^/api': '' },
				changeOrigin: true,
				// headers: {
				//     Cookie: 'SESSION=90ffc25b-cf48-402d-9019-50d30e0d81cc'
				// }
			},
			'/mock': {
				target: 'http://yapi.eslink.com/mock/11/iwater', // mock地址
				changeOrigin: true,
				pathRewrite: { '^/mock': '' },
			},
		},
	},
}
