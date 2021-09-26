/*
 * @Description: 
 * @Version: 2.0
 * @Autor: zhangyi
 * @Date: 2021-06-10 20:56:40
 * @LastEditors: zhangyi
 * @LastEditTime: 2021-06-25 11:30:17
 */
module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
	parserOptions: {
		parser: 'babel-eslint',
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		"max-len": [0, 120, 4],
	},
}
