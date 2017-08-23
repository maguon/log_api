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
var truck = require('./bl/Truck.js');
var truckInsureRel = require('./bl/TruckInsureRel.js');
var truckInsure = require('./bl/TruckInsure.js');
var truckRepairRel = require('./bl/TruckRepairRel.js');
var truckDispatch = require('./bl/TruckDispatch.js');
var brand = require('./bl/Brand.js');
var drive = require('./bl/Drive.js');
var company = require('./bl/Company.js');
var city = require('./bl/City.js');
var cityRoute = require('./bl/CityRoute.js');
var baseAddr = require('./bl/BaseAddr.js');
var receive = require('./bl/Receive.js');
var receiveContacts = require('./bl/ReceiveContacts.js');
var entrust = require('./bl/Entrust.js');
var entrustContacts = require('./bl/EntrustContacts.js');
var storage = require('./bl/Storage.js');
var storageArea = require('./bl/StorageArea.js');
var storageParking = require('./bl/StorageParking.js');
var car = require('./bl/Car.js');
var carStorageRel = require('./bl/CarStorageRel.js');
var carMake = require('./bl/CarMake.js');
var carModel = require('./bl/CarModel.js');
var dpTaskSatat = require('./bl/DpTaskSatat.js');
var dpRouteTask = require('./bl/DpRouteTask.js');
var dpRouteLoadTask = require('./bl/DpRouteLoadTask.js');
var app = require('./bl/App.js');
var sysRecord = require('./bl/SysRecord.js');
var oauth = require('./bl/OAuth.js');

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

    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
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
    server.use(oauth.transferToken());



   

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

    /**
     * User Module
     */
    server.get('/api/user' ,user.queryUser);
    server.post({path:'/api/user',contentType: 'application/json'} , user.createUser);
    server.put({path:'/api/user/:userId',contentType: 'application/json'} ,user.updateUserInfo);
    server.put({path:'/api/user/:userId/status/:status',contentType: 'application/json'} ,user.updateUserStatus);
    server.get('/api/user/:userId' , user.queryUser);
    server.post({path:'/api/userLogin' ,contentType: 'application/json'}, user.userLogin);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.changeUserPassword);
    server.get('/api/user/:userId/token/:token' , user.changeUserToken);


    /**
     * Truck Module
     */
    server.get('/api/truckFirst' , truck.queryTruckFirst);
    server.get('/api/truckTrailer' , truck.queryTruckTrailer);
    server.get('/api/operateTypeCount' , truck.queryOperateTypeCount);
    server.get('/api/truckCount' , truck.queryTruckCount);
    server.get('/api/drivingCount' , truck.queryDrivingCount);
    server.get('/api/company/:companyId/firstCount' , truck.queryFirstCount);
    server.get('/api/company/:companyId/trailerCount' , truck.queryTrailerCount);
    server.get('/api/truckTypeCountTotal',truck.queryTruckTypeCountTotal);
    server.get('/api/truckOperateTypeCountTotal',truck.queryTruckOperateTypeCountTotal);
    server.post({path:'/api/user/:userId/truckFirst',contentType: 'application/json'},truck.createTruckFirst,sysRecord.saveTruckRecord);
    server.post({path:'/api/user/:userId/truckTrailer',contentType: 'application/json'},truck.createTruckTrailer,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId',contentType: 'application/json'} ,truck.updateTruck);
    server.put({path:'/api/user/:userId/truck/:truckId/image',contentType: 'application/json'} ,truck.updateTruckImage);
    server.put({path:'/api/user/:userId/truck/:truckId/trail/:trailId/bind',contentType: 'application/json'} ,truck.updateTruckRelBind,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/trail/:trailId/unbind',contentType: 'application/json'} ,truck.updateTruckRelUnBind,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/drive/:driveId/bind',contentType: 'application/json'} ,truck.updateTruckDriveRelBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/drive/:driveId/unbind',contentType: 'application/json'} ,truck.updateTruckDriveRelUnBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/truckStatus/:truckStatus/first',contentType: 'application/json'} ,truck.updateTruckStatusFirst);
    server.put({path:'/api/user/:userId/truck/:truckId/truckStatus/:truckStatus/trailer',contentType: 'application/json'} ,truck.updateTruckStatusTrailer);
    server.put({path:'/api/user/:userId/truck/:truckId/repairStatus/:repairStatus',contentType: 'application/json'} ,truck.updateRepairStatus);

    /**
     * TruckInsureRel Module
     */
    server.get('/api/truckInsureRel' , truckInsureRel.queryTruckInsureRel);
    server.get('/api/truckInsureTypeTotal',truckInsureRel.queryTruckInsureTypeTotal);
    server.get('/api/truckInsureMoneyTotal',truckInsureRel.queryTruckInsureMoneyTotal);
    server.get('/api/truckInsureCountTotal',truckInsureRel.queryTruckInsureCountTotal);
    server.post({path:'/api/user/:userId/truckInsureRel',contentType: 'application/json'},truckInsureRel.createTruckInsureRel);
    server.put({path:'/api/user/:userId/truckInsureRel/:relId',contentType: 'application/json'} ,truckInsureRel.updateTruckInsureRel);

    /**
     * TruckInsure Module
     */
    server.get('/api/truckInsure' , truckInsure.queryTruckInsure);
    server.post({path:'/api/user/:userId/truckInsure',contentType: 'application/json'},truckInsure.createTruckInsure);
    server.put({path:'/api/user/:userId/truckInsure/:insureId',contentType: 'application/json'} ,truckInsure.updateTruckInsure);

    /**
     * TruckRepairRel Module
     */
    server.get('/api/truckRepairRel' , truckRepairRel.queryTruckRepairRel);
    server.get('/api/truckRepairRelCount' , truckRepairRel.queryTruckRepairRelCount);
    server.get('/api/truckRepairCountTotal' , truckRepairRel.queryTruckRepairCountTotal);
    server.get('/api/truckRepairMoneyTotal' , truckRepairRel.queryTruckRepairMoneyTotal);
    server.post({path:'/api/user/:userId/truck/:truckId/truckRepairRel',contentType: 'application/json'},truckRepairRel.createTruckRepairRel);
    server.put({path:'/api/user/:userId/truckRepairRel/:relId',contentType: 'application/json'} ,truckRepairRel.updateTruckRepairRel);

    /**
     * TruckDispatch Module
     */
    server.get('/api/truckDispatch' , truckDispatch.queryTruckDispatch);

    /**
     * Brand Module
     */
    server.get('/api/brand',brand.queryBrand);
    server.post({path:'/api/user/:userId/brand',contentType: 'application/json'},brand.createBrand);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);

    /**
     * Drive Module
     */
    server.get('/api/drive' , drive.queryDrive);
    server.get('/api/licenseCount' , drive.queryLicenseCount);
    server.get('/api/company/:companyId/driveCount' , drive.queryDriveCount);
    server.get('/api/driveOperateTypeCount' , drive.queryDriveOperateTypeCount);
    server.post({path:'/api/user/:userId/drive',contentType: 'application/json'},drive.createDrive,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/drive/:driveId',contentType: 'application/json'} ,drive.updateDrive);
    server.put({path:'/api/user/:userId/drive/:driveId/image',contentType: 'application/json'} ,drive.updateDriveImage);
    server.put({path:'/api/user/:userId/drive/:driveId/driveStatus/:driveStatus',contentType: 'application/json'} ,drive.updateDriveStatus);

    /**
     * Company Module
     */
    server.get('/api/company',company.queryCompany);
    server.get('/api/companyOperateTypeTotal',company.queryCompanyOperateTypeTotal);
    server.get('/api/companyTruckCountTotal',company.queryCompanyTruckCountTotal);
    server.post({path:'/api/user/:userId/company',contentType: 'application/json'},company.createCompany);
    server.put({path:'/api/user/:userId/company/:companyId',contentType: 'application/json'} ,company.updateCompany);

    /**
     * City Module
     */
    server.get('/api/city',city.queryCity);
    server.post({path:'/api/user/:userId/city',contentType: 'application/json'},city.createCity);
    server.put({path:'/api/user/:userId/city/:cityId',contentType: 'application/json'} ,city.updateCity);
    server.put({path:'/api/user/:userId/city/:cityId/cityStatus/:cityStatus',contentType: 'application/json'} ,city.updateCityStatus);

    /**
     * CityRoute Module
     */
    server.get('/api/cityRoute',cityRoute.queryCityRoute);
    server.get('/api/cityRouteBase',cityRoute.queryCityRouteBase);
    server.get('/api/cityRouteDispatch',cityRoute.queryCityRouteDispatch);
    server.post({path:'/api/user/:userId/cityRoute',contentType: 'application/json'},cityRoute.createCityRoute);
    server.put({path:'/api/user/:userId/cityRoute/:routeId',contentType: 'application/json'} ,cityRoute.updateCityRoute);

    /**
     * BaseAddr Module
     */
    server.get('/api/baseAddr',baseAddr.queryBaseAddr);
    server.post({path:'/api/user/:userId/baseAddr',contentType: 'application/json'},baseAddr.createBaseAddr);
    server.put({path:'/api/user/:userId/baseAddr/:baseAddrId',contentType: 'application/json'} ,baseAddr.updateBaseAddr);

    /**
     * Receive Module
     */
    server.get('/api/receive',receive.queryReceive);
    server.post({path:'/api/user/:userId/receive',contentType: 'application/json'},receive.createReceive);
    server.put({path:'/api/user/:userId/receive/:receiveId',contentType: 'application/json'} ,receive.updateReceive);

    /**
     * ReceiveContacts Module
     */
    server.get('/api/receive/:receiveId/contacts',receiveContacts.queryReceiveContacts);
    server.post({path:'/api/user/:userId/receive/:receiveId/contacts',contentType: 'application/json'},receiveContacts.createReceiveContacts);
    server.put({path:'/api/user/:userId/receiveContacts/:receiveContactsId',contentType: 'application/json'} ,receiveContacts.updateReceiveContacts);
    server.del('/api/user/:userId/receiveContacts/:receiveContactsId' , receiveContacts.removeContacts);

    /**
     * Entrust Module
     */
    server.get('/api/entrust',entrust.queryEntrust);
    server.post({path:'/api/user/:userId/entrust',contentType: 'application/json'},entrust.createEntrust);
    server.put({path:'/api/user/:userId/entrust/:entrustId',contentType: 'application/json'} ,entrust.updateEntrust);

    /**
     * EntrustContacts Module
     */
    server.get('/api/entrust/:entrustId/contacts',entrustContacts.queryEntrustContacts);
    server.post({path:'/api/user/:userId/entrust/:entrustId/contacts',contentType: 'application/json'},entrustContacts.createEntrustContacts);
    server.put({path:'/api/user/:userId/entrustContacts/:entrustContactsId',contentType: 'application/json'} ,entrustContacts.updateEntrustContacts);
    server.del('/api/user/:userId/entrustContacts/:entrustContactsId' , entrustContacts.removeContacts);

    /**
     * Storage Module
     */
    server.get('/api/storage',storage.queryStorage);
    server.get('/api/storageDate',storage.queryStorageDate);
    server.get('/api/storageCount',storage.queryStorageCount);
    server.get('/api/storageTotalMonth',storage.queryStorageTotalMonth);
    server.get('/api/storageTotalDay',storage.queryStorageTotalDay);
    server.get('/api/storageCar.csv', storage.getStorageCarCsv);
    server.post({path:'/api/user/:userId/storage',contentType: 'application/json'},storage.createStorage);
    server.put({path:'/api/user/:userId/storage/:storageId',contentType: 'application/json'} ,storage.updateStorage);
    server.put({path:'/api/user/:userId/storage/:storageId/storageStatus/:storageStatus',contentType: 'application/json'} ,storage.updateStorageStatus);

    /**
     * StorageArea Module
     */
    server.get('/api/storageArea',storageArea.queryStorageArea);
    server.post({path:'/api/user/:userId/storage/:storageId/storageArea',contentType: 'application/json'},storageArea.createStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:areaId',contentType: 'application/json'} ,storageArea.updateStorageArea);
    server.put({path:'/api/user/:userId/storageArea/:areaId/areaStatus/:areaStatus',contentType: 'application/json'} ,storageArea.updateStorageAreaStatus);

    /**
     * StorageParking Module
     */
    server.get('/api/storageParking',storageParking.queryStorageParking);
    server.put({path:'/api/user/:userId/storageParking/:parkingId',contentType: 'application/json'} ,storageParking.updateStorageParking,sysRecord.saveCarRecord);

    /**
     * Car Module
     */
    server.get('/api/carList',car.queryCarList);
    server.get('/api/car',car.queryCar);
    server.get('/api/carRouteEndCount',car.queryCarRouteEndCount);
    server.get('/api/carOrderDateCount',car.queryCarOrderDateCount);
    server.get('/api/carReceiveCount',car.queryCarReceiveCount);
    server.post({path:'/api/user/:userId/uploadCar',contentType: 'application/json'},car.createUploadCar);
    server.post({path:'/api/user/:userId/car',contentType: 'application/json'},car.createCar,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId',contentType: 'application/json'} ,car.updateCar);
    server.put({path:'/api/user/:userId/car/:carId/vin',contentType: 'application/json'} ,car.updateCarVin);
    server.put({path:'/api/user/:userId/car/:carId/carStatus/:carStatus',contentType: 'application/json'} ,car.updateCarStatus,sysRecord.saveCarRecord);

    /**
     * CarStorageRel Module
     */
    server.post({path:'/api/user/:userId/carStorageRel',contentType: 'application/json'},carStorageRel.createCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId/carStorageRel',contentType: 'application/json'},carStorageRel.createAgainCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/relStatus/:relStatus',contentType: 'application/json'} ,carStorageRel.updateRelStatus,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/planOutTime',contentType: 'application/json'} ,carStorageRel.updateRelPlanOutTime);

    /**
     * CarMake Module
     */
    server.get('/api/carMake',carMake.queryCarMake);
    server.post({path:'/api/user/:userId/carMake',contentType: 'application/json'},carMake.createCarMake);
    server.put({path:'/api/user/:userId/carMake/:makeId',contentType: 'application/json'} ,carMake.updateCarMake);

    /**
     * CarModel Module
     */
    server.get('/api/carMake/:makeId/carModel',carModel.queryCarModel);
    server.post({path:'/api/user/:userId/carMake/:makeId/carModel',contentType: 'application/json'},carModel.createCarModel);
    server.put({path:'/api/user/:userId/carModel/:modelId',contentType: 'application/json'} ,carModel.updateCarModel);
    server.put({path:'/api/user/:userId/carModel/:modelId/modelStatus/:modelStatus',contentType: 'application/json'} ,carModel.updateModelStatus);

    /**
     * DpTaskSatat Module
     */
    server.get('/api/dpTaskSatat' , dpTaskSatat.queryDpTaskSatat);
    server.get('/api/dpTaskSatatBase' , dpTaskSatat.queryDpTaskSatatBase);
    server.post({path:'/api/user/:userId/dpTaskSatat',contentType: 'application/json'},dpTaskSatat.createDpTaskSatat);

    /**
     * DpRouteTask Module
     */
    server.get('/api/dpRouteTask' , dpRouteTask.queryDpRouteTask);
    server.post({path:'/api/user/:userId/dpRouteTask',contentType: 'application/json'},dpRouteTask.createDpRouteTask);

    /**
     * DpRouteLoadTask Module
     */
    server.get('/api/dpRouteTask/:dpRouteTaskId/dpRouteLoadTask',dpRouteLoadTask.queryDpRouteLoadTask);
    server.post({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteLoadTask',contentType: 'application/json'},dpRouteLoadTask.createDpRouteLoadTask);

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