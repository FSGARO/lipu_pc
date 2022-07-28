/*
 * @Description:
 * @Author:
 * El Psy Congroo
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
	plugins: [
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: true, // console
					drop_console: true,
					pure_funcs: ['console.log'] // 移除console
				}
			}
		})
	]
}
