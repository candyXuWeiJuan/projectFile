var express = require('express')
var path = require('path')

var app = express()

var server = app.listen('9009', function () {
	var host = server.address().address
	var port = server.address().port

	var listenAdress = 'http://' + host + ':' + port
	console.log('Example app listening at ' + listenAdress)
})

app.use(express.static('./dist'))
app.get('./', (req, res) => {
	res.sendFile('./index.html')
})
const createProxyMiddleware = require('http-proxy-middleware')
var options = {
	target: 'http://iwater-pc.hw-qa.eslink.net.cn',
	//target: 'http://10.101.1.232:8080/',
	//pathRewrite: {'^/api':''},
	changeOrigin: true,
}
var exampleProxy = createProxyMiddleware(options)

app.use('/', exampleProxy)
