module.exports = {

	outputDir: 'docs',
	publicPath: '',
	
	pages: {
		index: {
			entry: './src/main.js',
			template: './src/index.pug'
		}
	},

	pwa: {
		name: 'p2p messenger',
		themeColor: '#333333',
		msTileColor: '#333333'
	}
}