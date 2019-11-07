#!/usr/bin/env node

const http = require('http'),
      url = require('url'),
      fs = require('fs'),
      path = require('path'),
      port = process.argv[2] || 1944;

const root = path.join(__dirname, 'public');

const mime = {
	html: 'text/html',
	txt: 'text/plain',
	css: 'text/css',
	vbs: 'text/vbscript',
	gif: 'image/gif',
	bmp: 'image/bmp',
	jpg: 'image/jpg',
	png: 'image/png',
	svg: 'image/svg+xml',
	json: 'application/json',
	js: 'application/javascript',
	hta: 'application/hta'
};


const server = http.createServer((req, res) => {
    //  console.log(`${req.method} ${req.url}`);
	
    var reqpath =req.url.toString().split('?')[0];
	if(req.method !== 'GET') {
		res.satusCode = 501;
		res.setHeader('Content-Type', 'text/plain');
		return res.end('Method not implemented');
	}
	var file = path.join(root, reqpath.replace(/\/$/, '/index.html'));
	if(file.indexOf(root + path.sep) !==0) {
		res.satusCode = 403;
		res.setHeader('Content-Type', 'text/plain');
		return res.end('Forbidden');
	}
 
	var type = mime[path.extname(file).slice(1)] || 'text/plain';
	var s = fs.createReadStream(file);
	s.on('open', () => {
		res.setHeader('Content-Type', type);
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		console.log(ip);
		s.pipe(res);
	});
	s.on('error', () => {
		res.setHeader('Content-Type', 'text/plain');
		res.statusCode = 404;
		res.end('Root Not Found');
	});

});

server.listen(port, "0.0.0.0");
