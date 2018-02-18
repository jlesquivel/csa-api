const http = require('http');
const https = require('https');
const redirectHttps = require('redirect-https');
var app = require('express')();

app.get('/', (req, res) => {
    res.send("Test Server")
})

var lex = require('greenlock-express').create({
    server: 'staging',
    configDir: 'certs/etc',
    debug: true,
    approveDomains: (opts, certs, cb) => {
        if (certs) {
            opts.domains = ['csalib.ddns.net']
        } else {
            opts.email = 'test@gmail.com',
                opts.agreeTos = true;
        }
        cb(null, {
            options: opts,
            certs: certs
        });
    },
});


http.createServer(lex.middleware(redirectHttps())).listen(80, '0.0.0.0', function () {
    console.log("Server Running On http:" + 80);
})

https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443, '0.0.0.0', function () {
    console.log("Server Running On https:" + 443);
})