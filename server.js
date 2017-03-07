// Copyright (c) 2012 Mark Cavage. All rights reserved.

var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert-plus');
var restify = require('restify');

var sysConfig = require('./config/SystemConfig.js');
var serverLogger = require('./util/ServerLogger.js');
var logger = serverLogger.createLogger('Server.js');
var adminUser = require('./bl/AdminUser.js');
var user = require('./bl/User.js');

///--- API

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({

        name: 'LOG-API',
        version: '0.0.1'
    });


    // Ensure we don't drop data on uploads
    //server.pre(restify.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());




    
    // Set a per request bunyan logger (with requestid filled in)
    //server.use(restify.requestLogger());

    // Allow 5 requests/second by IP, and burst to 10
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","x-requested-with,content-type");
    server.use(restify.CORS());

    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());



   

    // Now our own handlers for authentication/authorization
    // Here we only use basic auth, but really you should look
    // at https://github.com/joyent/node-http-signature

    //server.use(authenticate);

    //server.use(apiUtil.save);



    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    /**
     * Admin User Module
     */
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);

    /**
     * User Module
     */
    server.post({path:'/api/user',contentType: 'application/json'} , user.userRegister);

    server.on('NotFound', function (req, res, next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });

    return (server);

}



///--- Exports

module.exports = {
    createServer: createServer
};