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
var truck = require('./bl/Truck');
var drive = require('./bl/Drive');
var company = require('./bl/Company');
var city = require('./bl/City');
var brand = require('./bl/Brand');
var storage = require('./bl/Storage');
var storageParking = require('./bl/StorageParking');
var car = require('./bl/Car');
var carStorageRel = require('./bl/CarStorageRel');
var carMake = require('./bl/CarMake');
var carModel = require('./bl/CarModel');
var app = require('./bl/App');

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
    server.post({path:'/api/admin/do/login',contentType: 'application/json'},adminUser.adminUserLogin);
    server.get('/api/admin/:adminId' ,adminUser.getAdminUserInfo);
    server.put({path:'/api/admin/:adminId',contentType: 'application/json'} ,adminUser.updateAdminInfo);
    server.put({path:'/api/admin/:adminId/password',contentType: 'application/json'} ,adminUser.changeAdminPassword);

    /**
     * User Module
     */
    server.post({path:'/api/admin/:adminId/user',contentType: 'application/json'} , user.createUser);
    server.get('/api/admin/:adminId/user' ,user.queryUser);
    server.put({path:'/api/admin/:adminId/user/:userId',contentType: 'application/json'} ,user.updateUserInfo);
    server.put({path:'/api/admin/:adminId/user/:userId/status/:status',contentType: 'application/json'} ,user.updateUserStatus);
    server.post({path:'/api/userLogin' ,contentType: 'application/json'}, user.userLogin);
    server.get('/api/user/:userId' , user.queryUser);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.changeUserPassword);

    /**
     * Truck Module
     */
    server.post({path:'/api/user/:userId/truck',contentType: 'application/json'},truck.createTruck);
    server.get('/api/user/:userId/truck' , truck.queryTruck);
    server.get('/api/user/:userId/company/:companyId/firstCount' , truck.queryFirstCount);
    server.get('/api/user/:userId/company/:companyId/trailerCount' , truck.queryTrailerCount);
    server.put({path:'/api/user/:userId/truck/:truckId',contentType: 'application/json'} ,truck.updateTruck);

    /**
     * Drive Module
     */
    server.post({path:'/api/user/:userId/drive',contentType: 'application/json'},drive.createDrive);
    server.get('/api/user/:userId/drive' , drive.queryDrive);
    server.get('/api/user/:userId/company/:companyId/driveCount' , drive.queryDriveCount);
    server.put({path:'/api/user/:userId/drive/:driveId',contentType: 'application/json'} ,drive.updateDrive);

    /**
     * Company Module
     */
    server.post({path:'/api/user/:userId/company',contentType: 'application/json'},company.createCompany);
    server.get('/api/user/:userId/company',company.queryCompany);
    server.put({path:'/api/user/:userId/company/:companyId',contentType: 'application/json'} ,company.updateCompany);

    /**
     * City Module
     */
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.createCity);
    server.get('/api/user/:userId/city',city.queryCity);
    server.put({path:'/api/user/:userId/city/:cityId',contentType: 'application/json'} ,city.updateCity);

    /**
     * Brand Module
     */
    server.post({path:'/api/user/:userId/brand',contentType: 'application/json'},brand.createBrand);
    server.get('/api/user/:userId/brand',brand.queryBrand);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);

    /**
     * Storage Module
     */
    server.post({path:'/api/admin/:adminId/storage',contentType: 'application/json'},storage.createStorage);
    server.get('/api/storage',storage.queryStorage);
    server.put({path:'/api/admin/:adminId/storage/:storageId',contentType: 'application/json'} ,storage.updateStorage);
    server.put({path:'/api/admin/:adminId/storage/:storageId/storageStatus/:storageStatus',contentType: 'application/json'} ,storage.updateStorageStatus);

    /**
     * storageParking Module
     */
    server.get('/api/storage/:storageId/storageParking',storageParking.queryStorageParking);
    server.put({path:'/api/user/:userId/storageParking/:parkingId',contentType: 'application/json'} ,storageParking.updateStorageParking);

    /**
     * Car Module
     */
    server.post({path:'/api/user/:userId/car',contentType: 'application/json'},car.createCar);
    server.get('/api/user/:userId/car',car.queryCar);
    server.put({path:'/api/user/:userId/car/:carId',contentType: 'application/json'} ,car.updateCar);

    /**
     * CarStorageRel Module
     */
    server.post({path:'/api/user/:userId/carStorageRel',contentType: 'application/json'},carStorageRel.createCarStorageRel);
    server.get('/api/carStorageRel',carStorageRel.queryCarStorageRel);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/relStatus/:relStatus',contentType: 'application/json'} ,carStorageRel.updateRelStatus);

    /**
     * CarMake Module
     */
    server.post({path:'/api/admin/:adminId/carMake',contentType: 'application/json'},carMake.createCarMake);
    server.get('/api/carMake',carMake.queryCarMake);
    server.put({path:'/api/admin/:adminId/carMake/:makeId',contentType: 'application/json'} ,carMake.updateCarMake);

    /**
     * CarModel Module
     */
    server.post({path:'/api/admin/:adminId/carMake/:makeId/carModel',contentType: 'application/json'},carModel.createCarModel);
    server.get('/api/carMake/:makeId/carModel',carModel.queryCarModel);
    server.put({path:'/api/admin/:adminId/carModel/:modelId',contentType: 'application/json'} ,carModel.updateCarModel);
    server.put({path:'/api/admin/:adminId/carModel/:modelId/modelStatus/:modelStatus',contentType: 'application/json'} ,carModel.updateModelStatus);

    /**
     * App Module
     */
    server.get('/api/app',app.queryApp);

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