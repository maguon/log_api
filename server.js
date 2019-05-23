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
var userDevice = require('./bl/UserDevice.js');
var truck = require('./bl/Truck.js');
var truckInsureRel = require('./bl/TruckInsureRel.js');
var truckInsure = require('./bl/TruckInsure.js');
var truckRepairRel = require('./bl/TruckRepairRel.js');
var truckDispatch = require('./bl/TruckDispatch.js');
var truckAccident = require('./bl/TruckAccident.js');
var truckAccidentCheck = require('./bl/TruckAccidentCheck.js');
var truckAccidentInsure = require('./bl/TruckAccidentInsure.js');
var truckAccidentInsureRel = require('./bl/TruckAccidentInsureRel.js');
var truckAccidentInsureLoan = require('./bl/TruckAccidentInsureLoan.js');
var truckSecurityCheck = require('./bl/TruckSecurityCheck.js');
var truckEtc = require('./bl/TruckEtc.js');
var truckDepreciation = require('./bl/TruckDepreciation.js');
var brand = require('./bl/Brand.js');
var drive = require('./bl/Drive.js');
var driveRefuel = require('./bl/DriveRefuel.js');
var driveSalary = require('./bl/DriveSalary.js');
var driveSalaryTaskRel = require('./bl/DriveSalaryTaskRel.js');
var driveSalaryDamageRel = require('./bl/DriveSalaryDamageRel.js');
var driveSalaryAccidentRel = require('./bl/DriveSalaryAccidentRel.js');
var driveSalaryPeccancyRel = require('./bl/DriveSalaryPeccancyRel.js');
var driveSalaryExceedOilRel = require('./bl/DriveSalaryExceedOilRel.js');
var drivePeccancy = require('./bl/DrivePeccancy.js');
var driveExceedOil = require('./bl/DriveExceedOil.js');
var driveExceedOilDate = require('./bl/DriveExceedOilDate.js');
var driveExceedOilRel = require('./bl/DriveExceedOilRel.js');
var driveDpRouteTaskOilRel = require('./bl/DriveDpRouteTaskOilRel.js');
var driveWork = require('./bl/DriveWork.js');
var company = require('./bl/Company.js');
var city = require('./bl/City.js');
var cityRoute = require('./bl/CityRoute.js');
var baseAddr = require('./bl/BaseAddr.js');
var receive = require('./bl/Receive.js');
var receiveContacts = require('./bl/ReceiveContacts.js');
var entrust = require('./bl/Entrust.js');
var entrustContacts = require('./bl/EntrustContacts.js');
var entrustCityRouteRel = require('./bl/EntrustCityRouteRel.js');
var entrustMakeRel = require('./bl/EntrustMakeRel.js');
var storage = require('./bl/Storage.js');
var storageArea = require('./bl/StorageArea.js');
var storageParking = require('./bl/StorageParking.js');
var car = require('./bl/Car.js');
var carStorageRel = require('./bl/CarStorageRel.js');
var carMake = require('./bl/CarMake.js');
var carModel = require('./bl/CarModel.js');
var carVinMatch = require('./bl/CarVinMatch.js');
var carExceptionRel = require('./bl/CarExceptionRel.js');
var dpDemand = require('./bl/DpDemand.js');
var dpTaskStat = require('./bl/DpTaskStat.js');
var dpTransferDemand = require('./bl/DpTransferDemand.js');
var dpRouteTask = require('./bl/DpRouteTask.js');
var dpRouteTaskTmp = require('./bl/DpRouteTaskTmp.js');
var dpRouteLoadTask = require('./bl/DpRouteLoadTask.js');
var dpRouteLoadTaskTmp = require('./bl/DpRouteLoadTaskTmp.js');
var dpRouteLoadTaskDetail = require('./bl/DpRouteLoadTaskDetail.js');
var dpRouteLoadTaskCleanRel = require('./bl/DpRouteLoadTaskCleanRel.js');
var dpRouteTaskLoan = require('./bl/DpRouteTaskLoan.js');
var dpRouteTaskLoanRel = require('./bl/DpRouteTaskLoanRel.js');
var dpRouteTaskOilRel = require('./bl/DpRouteTaskOilRel.js');
var dpRouteTaskFee = require('./bl/DpRouteTaskFee.js');
var damage = require('./bl/Damage.js');
var damageCheck = require('./bl/DamageCheck.js');
var damageCheckIndemnity = require('./bl/DamageCheckIndemnity.js');
var damageInsure = require('./bl/DamageInsure.js');
var damageInsureRel = require('./bl/DamageInsureRel.js');
var damageInsureLoan = require('./bl/DamageInsureLoan.js');
var repairStation = require('./bl/RepairStation.js');
var settleHandover = require('./bl/SettleHandover.js');
var settleHandoverCarRel = require('./bl/SettleHandoverCarRel.js');
var settleCar = require('./bl/SettleCar.js');
var app = require('./bl/App.js');
var sysRecord = require('./bl/SysRecord.js');
var oauth = require('./bl/OAuth.js');
var msgPush = require('./bl/MsgPush.js');
var sms = require('./bl/Sms.js');


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
    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));

    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());
    server.use(oauth.transferToken());



   

    // Now our own handlers for authentication/authorization
    // Here we only use basic auth, but really you should look
    // at https://github.com/joyent/node-http-signature

    //server.use(authenticate);

    //server.use(apiUtil.save);



    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.plugins.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.plugins.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.plugins.serveStatic({
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
    server.post({path:'/api/mobileUserLogin' ,contentType: 'application/json'}, user.mobileUserLogin);
    server.put({path:'/api/user/:userId/password',contentType: 'application/json'} ,user.changeUserPassword);
    server.put({path:'/api/phone/:mobile/password',contentType: 'application/json'} ,user.resetPassword);
    server.put({path:'/api/user/:userId/mobile',contentType: 'application/json'} ,user.updateUserMobile);
    server.get('/api/user/:userId/token/:token' , user.changeUserToken);
    server.put({path:'/api/user/:userId/avatarImage',contentType: 'application/json'} ,user.updateUserAvatarImage);
    server.get('/api/userDrive' ,user.queryUserDrive);

    /**
     * UserDevice Module
     */
    server.get('/api/userDevice' ,userDevice.queryUserDevice);
    server.post({path:'/api/user/:userId/userDevice',contentType: 'application/json'} , userDevice.createUserDevice);
    server.del('/api/user/:userId/deviceToken/:deviceToken' , userDevice.removeUserDevice);


    /**
     * Truck Module
     */
    server.get('/api/truckFirst' , truck.queryTruckFirst);
    server.get('/api/truckTrailer' , truck.queryTruckTrailer);
    server.get('/api/truckBase' , truck.queryTruckBase);
    server.get('/api/operateTypeCount' , truck.queryOperateTypeCount);
    server.get('/api/truckCount' , truck.queryTruckCount);
    server.get('/api/drivingCount' , truck.queryDrivingCount);
    server.get('/api/company/:companyId/firstCount' , truck.queryFirstCount);
    server.get('/api/company/:companyId/trailerCount' , truck.queryTrailerCount);
    server.get('/api/truckTypeCountTotal',truck.queryTruckTypeCountTotal);
    server.get('/api/truckOperateTypeCountTotal',truck.queryTruckOperateTypeCountTotal);
    server.get('/api/truckOperate',truck.queryTruckOperate);
    server.get('/api/truckOperate.csv', truck.getTruckOperateCsv);
    server.get('/api/truckFirstCsv.csv', truck.getTruckFirstCsv);
    server.get('/api/truckTrailerCsv.csv', truck.getTruckTrailerCsv);
    server.post({path:'/api/user/:userId/truckFirst',contentType: 'application/json'},truck.createTruckFirst,sysRecord.saveTruckRecord);
    server.post({path:'/api/user/:userId/truckTrailer',contentType: 'application/json'},truck.createTruckTrailer,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId',contentType: 'application/json'} ,truck.updateTruck);
    server.put({path:'/api/user/:userId/truck/:truckId/truckCompany',contentType: 'application/json'} ,truck.updateTruckCompany,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/image',contentType: 'application/json'} ,truck.updateTruckImage);
    server.put({path:'/api/user/:userId/truck/:truckId/trail/:trailId/bind',contentType: 'application/json'} ,truck.updateTruckRelBind,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/trail/:trailId/unbind',contentType: 'application/json'} ,truck.updateTruckRelUnBind,sysRecord.saveTruckRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/drive/:driveId/bind',contentType: 'application/json'} ,truck.updateTruckDriveRelBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/drive/:driveId/unbind',contentType: 'application/json'} ,truck.updateTruckDriveRelUnBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/viceDrive/:viceDriveId/bind',contentType: 'application/json'} ,truck.updateTruckViceDriveRelBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/truck/:truckId/viceDrive/:viceDriveId/unbind',contentType: 'application/json'} ,truck.updateTruckViceDriveRelUnBind,sysRecord.saveTruckRecord,sysRecord.saveDriverRecord);
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
    server.get('/api/truckInsureRel.csv', truckInsureRel.getTruckInsureRelCsv);
    server.post({path:'/api/user/:userId/truckInsureRel',contentType: 'application/json'},truckInsureRel.createTruckInsureRel);
    server.put({path:'/api/user/:userId/truckInsureRel/:relId',contentType: 'application/json'} ,truckInsureRel.updateTruckInsureRel);
    server.del('/api/user/:userId/truckInsureRel/:relId' , truckInsureRel.removeTruckInsureRel);

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
    server.get('/api/truckRepair.csv', truckRepairRel.getTruckRepairCsv);
    server.post({path:'/api/user/:userId/truck/:truckId/truckRepairRel',contentType: 'application/json'},truckRepairRel.createTruckRepairRel);
    server.post({path:'/api/user/:userId/truckRepairRelFile',contentType: 'multipart/form-data'},truckRepairRel.uploadTruckRepairRelFile);
    server.put({path:'/api/user/:userId/truckRepairRel/:relId',contentType: 'application/json'} ,truckRepairRel.updateTruckRepairRel);
    server.put({path:'/api/user/:userId/truckRepairRelBase/:relId',contentType: 'application/json'} ,truckRepairRel.updateTruckRepairRelBase);

    /**
     * TruckDispatch Module
     */
    server.get('/api/truckDispatch' , truckDispatch.queryTruckDispatch);
    server.get('/api/truckDispatchStop' , truckDispatch.queryTruckDispatchStop);
    server.get('/api/truckDispatchLoadTask' , truckDispatch.queryTruckDispatchLoadTask);
    server.get('/api/truckDispatchCount' , truckDispatch.queryTruckDispatchCount);
    server.get('/api/truckNumberType' , truckDispatch.queryTruckNumberType);
    server.get('/api/cityTruckDispatchCount' , truckDispatch.queryCityTruckDispatchCount);
    server.put({path:'/api/user/:userId/truck/:truckId/dispatch',contentType: 'application/json'} , truckDispatch.initTruckDispatchCity);

    /**
     * TruckAccident Module
     */
    server.get('/api/truckAccident' , truckAccident.queryTruckAccident);
    server.get('/api/truckAccidentNotCheckCount' , truckAccident.queryTruckAccidentNotCheckCount);
    server.get('/api/truckAccidentTotalCost' , truckAccident.queryTruckAccidentTotalCost);
    server.get('/api/truckAccidentTypeMonthStat' , truckAccident.queryTruckAccidentTypeMonthStat);
    server.get('/api/truckAccidentCostMonthStat' , truckAccident.queryTruckAccidentCostMonthStat);
    server.get('/api/truckAccident.csv' , truckAccident.getTruckAccidentCsv);
    server.post({path:'/api/user/:userId/truckAccident',contentType: 'application/json'},truckAccident.createTruckAccident);
    server.put({path:'/api/user/:userId/truckAccident/:truckAccidentId',contentType: 'application/json'} ,truckAccident.updateTruckAccident);
    server.put({path:'/api/user/:userId/truckAccident/:truckAccidentId/accidentStatus/:accidentStatus',contentType: 'application/json'} ,truckAccident.updateTruckAccidentStatus);

    /**
     * TruckAccidentCheck Module
     */
    server.get('/api/truckAccidentCheck' , truckAccidentCheck.queryTruckAccidentCheck);
    server.post({path:'/api/user/:userId/truckAccidentCheck',contentType: 'application/json'},truckAccidentCheck.createTruckAccidentCheck);
    server.put({path:'/api/user/:userId/truckAccidentCheck/:truckAccidentCheckId',contentType: 'application/json'} ,truckAccidentCheck.updateTruckAccidentCheck);

    /**
     * TruckAccidentInsure Module
     */
    server.get('/api/truckAccidentInsure' ,truckAccidentInsure.queryTruckAccidentInsure);
    server.get('/api/truckAccidentInsurePlanTotal' ,truckAccidentInsure.queryTruckAccidentInsurePlanTotal);
    server.get('/api/truckAccidentInsureMonthStat' ,truckAccidentInsure.queryTruckAccidentInsureMonthStat);
    server.get('/api/truckAccidentInsure.csv' ,truckAccidentInsure.getTruckAccidentInsureCsv);
    server.post({path:'/api/user/:userId/truckAccidentInsureBase',contentType: 'application/json'},truckAccidentInsure.createTruckAccidentInsureBase);
    server.post({path:'/api/user/:userId/truckAccidentInsure',contentType: 'application/json'},truckAccidentInsure.createTruckAccidentInsure);
    server.put({path:'/api/user/:userId/truckAccidentInsure/:accidentInsureId',contentType: 'application/json'} ,truckAccidentInsure.updateTruckAccidentInsure);
    server.put({path:'/api/user/:userId/truckAccidentInsure/:accidentInsureId/insureStatus/:insureStatus',contentType: 'application/json'} ,truckAccidentInsure.updateTruckAccidentInsureStatus);

    /**
     * TruckAccidentInsureRel Module
     */
    server.post({path:'/api/user/:userId/truckAccidentInsureRel',contentType: 'application/json'},truckAccidentInsureRel.createTruckAccidentInsureRel);
    server.del('/api/user/:userId/accidentInsure/:accidentInsureId/accident/:accidentId' , truckAccidentInsureRel.removeTruckAccidentInsureRel);

    /**
     * TruckAccidentInsureLoan Module
     */
    server.get('/api/truckAccidentInsureLoan' ,truckAccidentInsureLoan.queryTruckAccidentInsureLoan);
    server.get('/api/truckAccidentInsureLoanStatusCount' ,truckAccidentInsureLoan.queryTruckAccidentInsureLoanStatusCount);
    server.get('/api/truckAccidentInsureLoanMonthStat' ,truckAccidentInsureLoan.queryTruckAccidentInsureLoanMonthStat);
    server.put({path:'/api/user/:userId/truckAccidentInsureLoan/:loanId',contentType: 'application/json'} ,truckAccidentInsureLoan.updateTruckAccidentInsureLoan);
    server.put({path:'/api/user/:userId/truckAccidentInsureRepayment/:loanId',contentType: 'application/json'} ,truckAccidentInsureLoan.updateTruckAccidentInsureRepayment);
    server.put({path:'/api/user/:userId/truckAccidentInsureLoan/:loanId/loanStatus/:loanStatus',contentType: 'application/json'} ,truckAccidentInsureLoan.updateTruckAccidentInsureLoanStatus);

    /**
     * TruckSecurityCheck Module
     */
    server.get('/api/truckSecurityCheck' ,truckSecurityCheck.queryTruckSecurityCheck);
    server.post({path:'/api/user/:userId/truckSecurityCheck',contentType: 'application/json'},truckSecurityCheck.createTruckSecurityCheck);
    server.put({path:'/api/user/:userId/truckSecurityCheck/:securityCheckId',contentType: 'application/json'} ,truckSecurityCheck.updateTruckSecurityCheck);
    server.get('/api/truckSecurityCheck.csv', truckSecurityCheck.getTruckSecurityCheckCsv);

    /**
     * TruckEtc Module
     */
    server.get('/api/truckEtc' ,truckEtc.queryTruckEtc);
    server.get('/api/truckEtcFeeCount' ,truckEtc.queryTruckEtcFeeCount);
    server.post({path:'/api/user/:userId/truckEtc',contentType: 'application/json'},truckEtc.createTruckEtc);
    server.post({path:'/api/user/:userId/truckEtcFile',contentType: 'multipart/form-data'},truckEtc.uploadTruckEtcFile);

    /**
     * TruckDepreciation Module
     */
    server.get('/api/truckDepreciation' ,truckDepreciation.queryTruckDepreciation);
    server.post({path:'/api/user/:userId/truckDepreciation',contentType: 'application/json'},truckDepreciation.createTruckDepreciation);
    server.post({path:'/api/user/:userId/truckDepreciationFile',contentType: 'multipart/form-data'},truckDepreciation.uploadTruckDepreciationFile);
    server.put({path:'/api/user/:userId/truckDepreciation/:truckDepreciationId',contentType: 'application/json'} ,truckDepreciation.updateTruckDepreciation);

    /**
     * Brand Module
     */
    server.get('/api/brand',brand.queryBrand);
    server.post({path:'/api/user/:userId/brand',contentType: 'application/json'},brand.createBrand);
    server.put({path:'/api/user/:userId/brand/:brandId',contentType: 'application/json'} ,brand.updateBrand);
    server.put({path:'/api/user/:userId/brand/:brandId/truckLoadDistanceOil',contentType: 'application/json'} ,brand.updateTruckLoadDistanceOil);

    /**
     * Drive Module
     */
    server.get('/api/drive' , drive.queryDrive);
    server.get('/api/licenseCount' , drive.queryLicenseCount);
    server.get('/api/company/:companyId/driveCount' , drive.queryDriveCount);
    server.get('/api/driveOperateTypeCount' , drive.queryDriveOperateTypeCount);
    server.get('/api/driveTruckCount' , drive.queryDriveTruckCount);
    server.get('/api/drive.csv' , drive.getDriveCsv);
    server.post({path:'/api/user/:userId/drive',contentType: 'application/json'},drive.createDrive,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/drive/:driveId',contentType: 'application/json'} ,drive.updateDrive);
    server.put({path:'/api/user/:userId/drive/:driveId/driveCompany',contentType: 'application/json'} ,drive.updateDriveCompany,sysRecord.saveDriverRecord);
    server.put({path:'/api/user/:userId/drive/:driveId/driveBankNumber',contentType: 'application/json'} ,drive.updateDriveBankNumber);
    server.put({path:'/api/user/:userId/drive/:driveId/image',contentType: 'application/json'} ,drive.updateDriveImage);
    server.put({path:'/api/user/:userId/drive/:driveId/driveStatus/:driveStatus',contentType: 'application/json'} ,drive.updateDriveStatus);

    /**
     * DriveRefuel Module
     */
    server.get('/api/driveRefuel' , driveRefuel.queryDriveRefuel);
    server.get('/api/refuelVolumeMoneyTotal' , driveRefuel.queryRefuelVolumeMoneyTotal);
    server.get('/api/refuelWeekStat' , driveRefuel.queryRefuelWeekStat);
    server.get('/api/refuelMonthStat' , driveRefuel.queryRefuelMonthStat);
    server.post({path:'/api/user/:userId/driveRefuel',contentType: 'application/json'},driveRefuel.createDriveRefuel);
    server.put({path:'/api/user/:userId/driveRefuel/:driveRefuelId/checkStatus/:checkStatus',contentType: 'application/json'} ,driveRefuel.updateDriveRefuelStatus);

    /**
     * DriveSalary Module
     */
    server.get('/api/driveSalary' , driveSalary.queryDriveSalary);
    server.post({path:'/api/user/:userId/driveSalary',contentType: 'application/json'},driveSalary.createDriveSalaryTask);
    server.put({path:'/api/user/:userId/driveSalary/:driveSalaryId',contentType: 'application/json'} ,driveSalary.updateDrivePlanSalary);
    server.put({path:'/api/user/:userId/driveSalary/:driveSalaryId/driveActualSalary',contentType: 'application/json'} ,driveSalary.updateDriveActualSalary);
    server.put({path:'/api/user/:userId/driveSalary/:driveSalaryId/grantStatus/:grantStatus',contentType: 'application/json'} ,driveSalary.updateDriveSalaryStatus);

    /**
     * DriveSalaryTaskRel Module
     */
    server.get('/api/driveSalaryTaskRel' , driveSalaryTaskRel.queryDriveSalaryTaskRel);
    server.post({path:'/api/user/:userId/driveSalaryTaskRelAll',contentType: 'application/json'},driveSalaryTaskRel.createDriveSalaryTaskRelAll);
    server.post({path:'/api/user/:userId/driveSalaryTaskRel',contentType: 'application/json'},driveSalaryTaskRel.createDriveSalaryTaskRel);
    server.del('/api/user/:userId/driveSalary/:driveSalaryId/dpRouteTask/:dpRouteTaskId' , driveSalaryTaskRel.removeDriveSalaryTaskRel);

    /**
     * DriveSalaryDamageRel Module
     */
    server.get('/api/driveSalaryDamageRel' , driveSalaryDamageRel.queryDriveSalaryDamageRel);
    server.post({path:'/api/user/:userId/driveSalaryDamageRel',contentType: 'application/json'},driveSalaryDamageRel.createDriveSalaryDamageRel);
    server.del('/api/user/:userId/driveSalary/:driveSalaryId/damage/:damageId' , driveSalaryDamageRel.removeDriveSalaryDamageRel);

    /**
     * DriveSalaryAccidentRel Module
     */
    server.get('/api/driveSalaryAccidentRel' , driveSalaryAccidentRel.queryDriveSalaryAccidentRel);
    server.post({path:'/api/user/:userId/driveSalaryAccidentRel',contentType: 'application/json'},driveSalaryAccidentRel.createDriveSalaryAccidentRel);
    server.del('/api/user/:userId/driveSalary/:driveSalaryId/accident/:accidentId' , driveSalaryAccidentRel.removeDriveSalaryAccidentRel);

    /**
     * DriveSalaryPeccancyRel Module
     */
    server.get('/api/driveSalaryPeccancyRel' , driveSalaryPeccancyRel.queryDriveSalaryPeccancyRel);
    server.post({path:'/api/user/:userId/driveSalaryPeccancyRel',contentType: 'application/json'},driveSalaryPeccancyRel.createDriveSalaryPeccancyRel);
    server.del('/api/user/:userId/driveSalary/:driveSalaryId/peccancy/:peccancyId' , driveSalaryPeccancyRel.removeDriveSalaryPeccancyRel);

    /**
     * DriveSalaryExceedOilRel Module
     */
    server.get('/api/driveSalaryExceedOilRel' , driveSalaryExceedOilRel.queryDriveSalaryExceedOilRel);
    server.post({path:'/api/user/:userId/driveSalaryExceedOilRel',contentType: 'application/json'},driveSalaryExceedOilRel.createDriveSalaryExceedOilRel);
    server.del('/api/user/:userId/driveSalary/:driveSalaryId/exceedOilDate/:exceedOilDateId' , driveSalaryExceedOilRel.removeDriveSalaryExceedOilRel);

    /**
     * DrivePeccancy Module
     */
    server.get('/api/drivePeccancy' , drivePeccancy.queryDrivePeccancy);
    server.get('/api/drivePeccancyCount' , drivePeccancy.queryDrivePeccancyCount);
    server.get('/api/drivePeccancy.csv' , drivePeccancy.getDrivePeccancyCsv);
    server.post({path:'/api/user/:userId/drivePeccancy',contentType: 'application/json'},drivePeccancy.createDrivePeccancy);
    server.put({path:'/api/user/:userId/peccancy/:peccancyId',contentType: 'application/json'} ,drivePeccancy.updateDrivePeccancy);

    /**
     * DriveExceedOil Module
     */
    server.get('/api/driveExceedOil' , driveExceedOil.queryDriveExceedOil);
    server.get('/api/driveExceedOilTotal' , driveExceedOil.queryDriveExceedOilTotal);
    server.get('/api/driveOilMonthStat' , driveExceedOil.queryDriveOilMonthStat);
    server.get('/api/driveUreaMonthStat' , driveExceedOil.queryDriveUreaMonthStat);
    server.get('/api/driveOilMoneyMonthStat' , driveExceedOil.queryDriveOilMoneyMonthStat);
    server.get('/api/driveOilWeekStat' , driveExceedOil.queryDriveOilWeekStat);
    server.get('/api/driveUreaWeekStat' , driveExceedOil.queryDriveUreaWeekStat);
    server.get('/api/driveOilMoneyWeekStat' , driveExceedOil.queryDriveOilMoneyWeekStat);
    server.get('/api/driveExceedOil.csv' , driveExceedOil.getDriveExceedOilCsv);
    server.post({path:'/api/user/:userId/driveExceedOil',contentType: 'application/json'},driveExceedOil.createDriveExceedOil);
    server.put({path:'/api/user/:userId/exceedOil/:exceedOilId',contentType: 'application/json'} ,driveExceedOil.updateDriveExceedOil);
    server.put({path:'/api/user/:userId/exceedOil/:exceedOilId/oilStatus/:oilStatus',contentType: 'application/json'} ,driveExceedOil.updateDriveOilStatus);

    /**
     * driveExceedOilDate Module
     */
    server.get('/api/driveExceedOilDate' , driveExceedOilDate.queryDriveExceedOilDate);
    server.get('/api/driveExceedOilMonth' , driveExceedOilDate.queryDriveExceedOilMonth);
    server.get('/api/driveExceedOilMonth.csv' , driveExceedOilDate.getDriveExceedOilMonthCsv);
    server.post({path:'/api/user/:userId/driveExceedOilDate',contentType: 'application/json'},driveExceedOilDate.createDriveExceedOilDate);
    server.put({path:'/api/user/:userId/exceedOilDateId/:exceedOilDateId',contentType: 'application/json'} ,driveExceedOilDate.updateDriveExceedOilDate);

    /**
     * DriveExceedOilRel Module
     */
    server.get('/api/driveExceedOilRel' , driveExceedOilRel.queryDriveExceedOilRel);
    server.get('/api/driveExceedOilRelCount' , driveExceedOilRel.queryDriveExceedOilRelCount);
    server.post({path:'/api/user/:userId/driveExceedOilRel',contentType: 'application/json'},driveExceedOilRel.createDriveExceedOilRel);
    server.post({path:'/api/user/:userId/driveExceedOilRelFile',contentType: 'multipart/form-data'},driveExceedOilRel.uploadDriveExceedOilRelFile);
    server.put({path:'/api/user/:userId/driveExceedOilRel/:relId',contentType: 'application/json'} ,driveExceedOilRel.updateDriveExceedOilRel);
    server.del('/api/user/:userId/driveExceedOilRel/:relId' , driveExceedOilRel.removeDriveExceedOilRel);

    /**
     * DriveDpRouteTaskOilRel Module
     */
    server.get('/api/driveDpRouteTaskOilRel' , driveDpRouteTaskOilRel.queryDriveDpRouteTaskOilRel);
    server.post({path:'/api/user/:userId/driveDpRouteTaskOilRel',contentType: 'application/json'},driveDpRouteTaskOilRel.createDriveDpRouteTaskOilRel);
    server.del('/api/user/:userId/dpRouteTaskOilRel/:dpRouteTaskOilRelId/driveExceedOil/:driveExceedOilId' , driveDpRouteTaskOilRel.removeDriveDpRouteTaskOilRel);

    /**
     * DriveWork Module
     */
    server.get('/api/driveWork' , driveWork.queryDriveWork);
    server.post({path:'/api/user/:userId/driveWork',contentType: 'application/json'},driveWork.createDriveWork);
    server.put({path:'/api/user/:userId/driveWork/:driveWorkId',contentType: 'application/json'} ,driveWork.updateDriveWork);
    server.post({path:'/api/user/:userId/driveWorkFile',contentType: 'multipart/form-data'},driveWork.uploadDriveWorkFile);

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
    server.put({path:'/api/user/:userId/city/:cityId/cityOilFlag/:cityOilFlag',contentType: 'application/json'} ,city.updateCityOilFlag);
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
    server.get('/api/receiveCount',receive.queryReceiveCount);
    server.post({path:'/api/user/:userId/receive',contentType: 'application/json'},receive.createReceive,sysRecord.saveReceiverRecord);
    server.put({path:'/api/user/:userId/receive/:receiveId',contentType: 'application/json'} ,receive.updateReceive);
    server.put({path:'/api/user/:userId/receive/:receiveId/cleanFee',contentType: 'application/json'} ,receive.updateReceiveCleanFee,sysRecord.saveReceiverRecord);

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
    server.get('/api/entrust/:entrustId',entrust.queryEntrust);
    server.get('/api/entrustRoute',entrust.queryEntrustRoute);
    server.get('/api/entrustCar',entrust.queryEntrustCar);
    server.get('/api/entrustCarCount',entrust.queryEntrustCarCount);
    server.get('/api/entrustCarNotCount',entrust.queryEntrustCarNotCount);
    server.get('/api/entrustCar.csv',entrust.getEntrustCarCsv);
    server.get('/api/entrustNotCar.csv',entrust.getEntrustNotCarCsv);
    server.post({path:'/api/user/:userId/entrust',contentType: 'application/json'},entrust.createEntrust);
    server.get('/api/settleCarBatch',entrust.createSettleCarBatch);
    server.put({path:'/api/user/:userId/entrust/:entrustId',contentType: 'application/json'} ,entrust.updateEntrust);
    server.put({path:'/api/user/:userId/entrust/:entrustId/entrustCarParkingFee',contentType: 'application/json'} ,entrust.updateEntrustCarParkingFee);

    /**
     * EntrustContacts Module
     */
    server.get('/api/entrust/:entrustId/contacts',entrustContacts.queryEntrustContacts);
    server.post({path:'/api/user/:userId/entrust/:entrustId/contacts',contentType: 'application/json'},entrustContacts.createEntrustContacts);
    server.put({path:'/api/user/:userId/entrustContacts/:entrustContactsId',contentType: 'application/json'} ,entrustContacts.updateEntrustContacts);
    server.del('/api/user/:userId/entrustContacts/:entrustContactsId' , entrustContacts.removeContacts);

    /**
     * EntrustCityRouteRel Module
     */
    server.get('/api/entrustCityRouteRel',entrustCityRouteRel.queryEntrustCityRouteRel);
    server.post({path:'/api/user/:userId/entrustCityRouteRel',contentType: 'application/json'},entrustCityRouteRel.createEntrustCityRouteRel,sysRecord.saveEntrustRecord);
    server.put({path:'/api/user/:userId/entrust/:entrustId/cityRoute/:cityRouteId/make/:makeId',contentType: 'application/json'} ,entrustCityRouteRel.updateEntrustCityRouteRel,sysRecord.saveEntrustRecord);

    /**
    * EntrustMakeRel Module
    */
    server.get('/api/entrustMakeRel',entrustMakeRel.queryEntrustMakeRel);
    server.post({path:'/api/user/:userId/entrustMakeRel',contentType: 'application/json'},entrustMakeRel.createEntrustMakeRel);
    server.del('/api/user/:userId/entrust/:entrustId/make/:makeId' , entrustMakeRel.removeEntrustMakeRel);

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
    server.get('/api/storage/:storageId/makeStat',storageParking.queryStorageParkingMakeStat);
    server.put({path:'/api/user/:userId/storageParking/:parkingId',contentType: 'application/json'} ,storageParking.updateStorageParking,sysRecord.saveCarRecord);

    /**
     * Car Module
     */
    server.get('/api/carList',car.queryCarList);
    server.get('/api/car',car.queryCar);
    server.get('/api/carRouteEndCount',car.queryCarRouteEndCount);
    server.get('/api/carOrderDateCount',car.queryCarOrderDateCount);
    server.get('/api/carReceiveCount',car.queryCarReceiveCount);
    server.get('/api/carMonthStat',car.queryCarMonthStat);
    server.get('/api/carDayStat',car.queryCarDayStat);
    server.get('/api/carDamageDeclare',car.queryCarDamageDeclare);
    server.get('/api/carRel.csv',car.getCarRelCsv);
    server.get('/api/carList.csv',car.getCarListCsv);
    server.post({path:'/api/user/:userId/uploadCar',contentType: 'application/json'},car.createUploadCar);
    server.post({path:'/api/user/:userId/car',contentType: 'application/json'},car.createCar,sysRecord.saveCarRecord);
    server.post({path:'/api/user/:userId/entrustCar',contentType: 'application/json'},car.createEntrustCar,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId',contentType: 'application/json'} ,car.updateCar);
    server.put({path:'/api/user/:userId/car/:carId/vin',contentType: 'application/json'} ,car.updateCarVin,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId/carStatus/:carStatus',contentType: 'application/json'} ,car.updateCarStatus,sysRecord.saveCarRecord);
    server.del('/api/user/:userId/upload/:uploadId' , car.removeUploadCar);
    server.del('/api/user/:userId/car/:carId/car' , car.removeCar);

    /**
     * CarStorageRel Module
     */
    server.post({path:'/api/user/:userId/carStorageRel',contentType: 'application/json'},carStorageRel.createCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/car/:carId/carStorageRel',contentType: 'application/json'},carStorageRel.createAgainCarStorageRel,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/relStatus/:relStatus',contentType: 'application/json'} ,carStorageRel.updateRelStatus,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/carStorageRel/:relId/planOutTime',contentType: 'application/json'} ,carStorageRel.updateRelPlanOutTime);
    server.post({path:'/api/user/:userId/carExportsFile',contentType: 'multipart/form-data'},carStorageRel.uploadCarExportsFile);

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
     * CarVinMatch Module
     */
    server.get('/api/carVinMatch',carVinMatch.queryCarVinMatch);
    server.post({path:'/api/user/:userId/carVinMatch',contentType: 'application/json'},carVinMatch.createCarVinMatch);
    server.put({path:'/api/user/:userId/carVinMatch/:carVinMatchId',contentType: 'application/json'} ,carVinMatch.updateCarVinMatch);
    server.del('/api/user/:userId/carVinMatch/:carVinMatchId' , carVinMatch.removeCarVinMatch);

    /**
     * CarExceptionRel Module
     */
    server.post({path:'/api/user/:userId/carExceptionRel',contentType: 'application/json'},carExceptionRel.createCarExceptionRel);

    /**
     * DpDemand Module
     */
    server.get('/api/dpDemand',dpDemand.queryDpDemand);
    server.get('/api/dpDemandBase',dpDemand.queryDpDemandBase);
    server.get('/api/entrust/:entrustId/dpDemand',dpDemand.queryEntrustDpDemand);
    server.post({path:'/api/user/:userId/dpDemand',contentType: 'application/json'},dpDemand.createDpDemand);
    server.post({path:'/api/entrust/:entrustId/dpDemand',contentType: 'application/json'},dpDemand.createEntrustDpDemand);
    server.put({path:'/api/user/:userId/dpDemand/:dpDemandId/demandStatus/:demandStatus',contentType: 'application/json'} ,dpDemand.updateDpDemandStatus);
    server.put({path:'/api/entrust/:entrustId/dpDemand/:dpDemandId/demandStatus/:demandStatus',contentType: 'application/json'} ,dpDemand.updateEntrustDpDemandStatus);

    /**
     * DpTaskStat Module
     */
    server.get('/api/dpTaskStat' , dpTaskStat.queryDpTaskStat);
    server.get('/api/dpTaskStatBase' , dpTaskStat.queryDpTaskStatBase);
    server.get('/api/dpTaskStatCount' , dpTaskStat.queryDpTaskStatCount);
    server.post({path:'/api/user/:userId/dpTaskStat',contentType: 'application/json'},dpTaskStat.createDpTaskStat);
    server.put({path:'/api/user/:userId/taskStatStatus',contentType: 'application/json'} ,dpTaskStat.updateDpTaskStatStatus);

    /**
     * DpTransferDemand Module
     */
    server.get('/api/dpTransferDemand' , dpTransferDemand.queryDpTransferDemand);
    server.get('/api/dpTransferDemandStat' , dpTransferDemand.queryDpTransferDemandStat);

    /**
     * DpRouteTask Module
     */
    server.get('/api/dpRouteTask' , dpRouteTask.queryDpRouteTask);
    server.get('/api/dpRouteTaskList' , dpRouteTask.queryDpRouteTaskList);
    server.get('/api/dpRouteTaskBase' , dpRouteTask.queryDpRouteTaskBase);
    server.get('/api/driveDistanceMoney' , dpRouteTask.queryDriveDistanceMoney);
    server.get('/api/driveDistanceCount' , dpRouteTask.queryDriveDistanceCount);
    server.get('/api/driveDistanceLoadStat' , dpRouteTask.queryDriveDistanceLoadStat);
    server.get('/api/driveDistanceLoad' , dpRouteTask.queryDriveDistanceLoad);
    server.get('/api/driveDistanceLoadStat.csv', dpRouteTask.getDriveDistanceLoadStatCsv);
    server.get('/api/driveDistanceLoad.csv', dpRouteTask.getDriveDistanceLoadCsv);
    server.get('/api/distanceMonthStat' , dpRouteTask.queryRouteTaskMonthStat);
    server.get('/api/distanceWeekStat' , dpRouteTask.queryRouteTaskWeekStat);
    server.get('/api/distanceDayStat' , dpRouteTask.queryRouteTaskDayStat);
    server.get('/api/notCompletedTaskStatusCount' , dpRouteTask.queryNotCompletedTaskStatusCount);
    server.get('/api/taskStatusCount' , dpRouteTask.queryTaskStatusCount);
    server.get('/api/dpRouteTask.csv', dpRouteTask.getDpRouteTaskCsv);
    server.get('/api/driveCost', dpRouteTask.queryDriveCost);
    server.get('/api/driveCost.csv' , dpRouteTask.getDriveCostCsv);
    server.post({path:'/api/user/:userId/dpRouteTask',contentType: 'application/json'},dpRouteTask.createDpRouteTask,sysRecord.saveRouteRecord);
    server.post({path:'/api/user/:userId/dpRouteTaskBatch',contentType: 'application/json'},dpRouteTask.createDpRouteTaskBatch,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/taskStatus/:taskStatus',contentType: 'application/json'} ,dpRouteTask.updateDpRouteTaskStatus,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/taskStatusBack/:taskStatus',contentType: 'application/json'} ,dpRouteTask.updateDpRouteTaskStatusBack,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteLoadFlag',contentType: 'application/json'} ,dpRouteTask.updateDpRouteLoadFlag,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteOilLoadFlag',contentType: 'application/json'} ,dpRouteTask.updateDpRouteOilLoadFlag,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteReverseFlag',contentType: 'application/json'} ,dpRouteTask.updateDpRouteReverseFlag);
    server.del('/api/user/:userId/dpRouteTask/:dpRouteTaskId' , dpRouteTask.removeDpRouteTask,sysRecord.saveRouteRecord);

    /**
     * dpRouteTaskTmp Module
     */
    server.get('/api/dpRouteTaskTmp' , dpRouteTaskTmp.queryDpRouteTaskTmp);
    server.post({path:'/api/user/:userId/dpRouteTaskTmp',contentType: 'application/json'},dpRouteTaskTmp.createDpRouteTaskTmp);
    server.del('/api/user/:userId/dpRouteTaskTmp/:dpRouteTaskTmpId' , dpRouteTaskTmp.removeDpRouteTaskTmp);

    /**
     * DpRouteLoadTask Module
     */
    server.get('/api/dpRouteLoadTask',dpRouteLoadTask.queryDpRouteLoadTask);
    server.get('/api/dpRouteLoadTaskCount',dpRouteLoadTask.queryDpRouteLoadTaskCount);
    server.post({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteLoadTask',contentType: 'application/json'},dpRouteLoadTask.createDpRouteLoadTask);
    server.put({path:'/api/user/:userId/dpRouteLoadTask/:dpRouteLoadTaskId/loadTaskStatus/:loadTaskStatus',contentType: 'application/json'} ,dpRouteLoadTask.updateDpRouteLoadTaskStatus,sysRecord.saveRouteRecord);
    server.put({path:'/api/user/:userId/dpRouteLoadTask/:dpRouteLoadTaskId/loadTaskStatusBack/:loadTaskStatus',contentType: 'application/json'} ,dpRouteLoadTask.updateDpRouteLoadTaskStatusBack,sysRecord.saveRouteRecord);
    server.del('/api/user/:userId/dpRouteLoadTask/:dpRouteLoadTaskId' , dpRouteLoadTask.removeDpRouteLoadTask);

    /**
     * dpRouteLoadTaskTmp Module
     */
    server.get('/api/dpRouteLoadTaskTmp',dpRouteLoadTaskTmp.queryDpRouteLoadTaskTmp);
    server.post({path:'/api/user/:userId/dpRouteTaskTmp/:dpRouteTaskTmpId/dpRouteLoadTaskTmp',contentType: 'application/json'},dpRouteLoadTaskTmp.createDpRouteLoadTaskTmp);
    server.del('/api/user/:userId/dpRouteLoadTaskTmp/:dpRouteLoadTaskTmpId' , dpRouteLoadTaskTmp.removeDpRouteLoadTaskTmp);

    /**
     * DpRouteLoadTaskDetail Module
     */
    server.get('/api/dpRouteLoadTask/:dpRouteLoadTaskId/dpRouteLoadTaskDetail',dpRouteLoadTaskDetail.queryDpRouteLoadTaskDetail);
    server.get('/api/dpRouteLoadTaskDetailBase',dpRouteLoadTaskDetail.queryDpRouteLoadTaskDetailBase);
    server.get('/api/carLoadStatusCount',dpRouteLoadTaskDetail.queryCarLoadStatusCount);
    server.post({path:'/api/user/:userId/dpRouteLoadTask/:dpRouteLoadTaskId/dpRouteLoadTaskDetail',contentType: 'application/json'},dpRouteLoadTaskDetail.createDpRouteLoadTaskDetail,sysRecord.saveCarRecord);
    server.put({path:'/api/user/:userId/dpRouteTaskDetail/:dpRouteTaskDetailId/carLoadStatus/:carLoadStatus',contentType: 'application/json'} ,dpRouteLoadTaskDetail.updateDpRouteLoadTaskDetailStatus,sysRecord.saveCarRecord);
    server.del('/api/user/:userId/dpRouteTaskDetail/:dpRouteTaskDetailId' , dpRouteLoadTaskDetail.removeDpRouteLoadTaskDetail,sysRecord.saveCarRecord);

    /**
     * DpRouteLoadTaskCleanRel Module
     */
    server.get('/api/dpRouteLoadTaskCleanRel',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRel);
    server.get('/api/dpRouteLoadTaskCleanRelCount',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRelCount);
    server.get('/api/dpRouteLoadTaskCleanRelMonthStat',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRelMonthStat);
    server.get('/api/dpRouteLoadTaskCleanRelReceiveMonthStat',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRelReceiveMonthStat);
    server.get('/api/dpRouteLoadTaskCleanRelWeekStat',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRelWeekStat);
    server.get('/api/dpRouteLoadTaskCleanRelReceiveWeekStat',dpRouteLoadTaskCleanRel.queryDpRouteLoadTaskCleanRelReceiveWeekStat);
    server.get('/api/dpRouteLoadTaskCleanRel.csv',dpRouteLoadTaskCleanRel.getDpRouteLoadTaskCleanRelCsv);
    server.post({path:'/api/user/:userId/dpRouteLoadTaskCleanRel',contentType: 'application/json'},dpRouteLoadTaskCleanRel.createDpRouteLoadTaskCleanRel);
    server.put({path:'/api/user/:userId/loadTaskCleanRel/:loadTaskCleanRelId',contentType: 'application/json'} ,dpRouteLoadTaskCleanRel.updateDpRouteLoadTaskCleanRel);
    server.put({path:'/api/user/:userId/loadTaskCleanRel/:loadTaskCleanRelId/status/:status',contentType: 'application/json'} ,dpRouteLoadTaskCleanRel.updateDpRouteLoadTaskCleanRelStatus);
    server.put({path:'/api/user/:userId/dpRouteTask/:dpRouteTaskId/status/:status',contentType: 'application/json'} ,dpRouteLoadTaskCleanRel.updateCleanRelStatus);

    /**
     * DpRouteTaskLoan Module
     */
    server.get('/api/dpRouteTaskLoan',dpRouteTaskLoan.queryDpRouteTaskLoan);
    server.get('/api/dpRouteTaskLoanCount',dpRouteTaskLoan.queryDpRouteTaskLoanCount);
    server.get('/api/dpRouteTaskLoanMonthStat',dpRouteTaskLoan.queryDpRouteTaskLoanMonthStat);
    server.get('/api/dpRouteTaskLoanDayStat',dpRouteTaskLoan.queryDpRouteTaskLoanDayStat);
    server.get('/api/dpRouteTaskLoan.csv',dpRouteTaskLoan.getDpRouteTaskLoanCsv);
    server.get('/api/dpRouteTaskNotLoan',dpRouteTaskLoan.queryDpRouteTaskNotLoan);
    server.get('/api/dpRouteTaskNotLoanCount',dpRouteTaskLoan.queryDpRouteTaskNotLoanCount);
    server.post({path:'/api/user/:userId/dpRouteTaskLoan',contentType: 'application/json'},dpRouteTaskLoan.createDpRouteTaskLoan);
    server.put({path:'/api/user/:userId/dpRouteTaskLoanGrant/:dpRouteTaskLoanId',contentType: 'application/json'} ,dpRouteTaskLoan.updateDpRouteTaskLoanGrant);
    server.put({path:'/api/user/:userId/dpRouteTaskLoanRepayment/:dpRouteTaskLoanId',contentType: 'application/json'} ,dpRouteTaskLoan.updateDpRouteTaskLoanRepayment);
    server.put({path:'/api/user/:userId/dpRouteTaskLoan/:dpRouteTaskLoanId/taskLoanStatus/:taskLoanStatus',contentType: 'application/json'} ,dpRouteTaskLoan.updateDpRouteTaskLoanStatus);

    /**
     * DpRouteTaskLoanRel Module
     */
    server.get('/api/dpRouteTaskLoanRel',dpRouteTaskLoanRel.queryDpRouteTaskLoanRel);
    server.post({path:'/api/user/:userId/dpRouteTaskLoanRel',contentType: 'application/json'},dpRouteTaskLoanRel.createDpRouteTaskLoanRel);
    server.del('/api/user/:userId/dpRouteTaskLoan/:dpRouteTaskLoanId/dpRouteTask/:dpRouteTaskId' , dpRouteTaskLoanRel.removeDpRouteTaskLoanRel);
    server.del('/api/user/:userId/dpRouteTask/:dpRouteTaskId/dpRouteTaskLoanRel' , dpRouteTaskLoanRel.removeDpRouteTaskLoanRelAll);

    /**
     * DpRouteTaskOilRel Module
     */
    server.get('/api/dpRouteTaskOilRel',dpRouteTaskOilRel.queryDpRouteTaskOilRel);

    /**
     * DpRouteTaskFee Module
     */
    server.get('/api/dpRouteTaskFee',dpRouteTaskFee.queryDpRouteTaskFee);
    server.get('/api/dpRouteTaskFeeCount',dpRouteTaskFee.queryDpRouteTaskFeeCount);
    server.post({path:'/api/user/:userId/dpRouteTaskFee',contentType: 'application/json'},dpRouteTaskFee.createDpRouteTaskFee);
    server.put({path:'/api/user/:userId/dpRouteTaskFee/:dpRouteTaskFeeId',contentType: 'application/json'} ,dpRouteTaskFee.updateDpRouteTaskFee);
    server.put({path:'/api/user/:userId/dpRouteTaskFee/:dpRouteTaskFeeId/status/:status',contentType: 'application/json'} ,dpRouteTaskFee.updateDpRouteTaskFeeStatus);
    server.get('/api/dpRouteTaskFee.csv', dpRouteTaskFee.getDpRouteTaskFeeCsv);

    /**
     * Damage Module
     */
    server.get('/api/damage',damage.queryDamage);
    server.get('/api/damageBase',damage.queryDamageBase);
    server.get('/api/damageCheckCount',damage.queryDamageCheckCount);
    server.get('/api/damageNotCheckCount',damage.queryDamageNotCheckCount);
    server.get('/api/damageTotalCost',damage.queryDamageTotalCost);
    server.get('/api/damageTypeMonthStat',damage.queryDamageTypeMonthStat);
    server.get('/api/damageLinkTypeMonthStat',damage.queryDamageLinkTypeMonthStat);
    server.get('/api/damageTypeWeekStat',damage.queryDamageTypeWeekStat);
    server.get('/api/damageMakeMonthStat',damage.queryDamageMakeMonthStat);
    server.get('/api/damageReceiveMonthStat',damage.queryDamageReceiveMonthStat);
    server.get('/api/damageDaseAddrMonthStat',damage.queryDamageDaseAddrMonthStat);
    server.get('/api/damageMakeTopMonthStat',damage.queryDamageMakeTopMonthStat);
    server.get('/api/damageReceiveTopMonthStat',damage.queryDamageReceiveTopMonthStat);
    server.get('/api/damageDaseAddrTopMonthStat',damage.queryDamageDaseAddrTopMonthStat);
    server.get('/api/damage.csv', damage.getDamageCsv);
    server.get('/api/damageBase.csv', damage.getDamageBaseCsv);
    server.post({path:'/api/user/:userId/damage',contentType: 'application/json'},damage.createDamage,sysRecord.saveCarRecord);
    server.post({path:'/api/user/:userId/qualityAssurance',contentType: 'application/json'},damage.createQualityAssurance,sysRecord.saveCarRecord);
    server.post({path:'/api/user/:userId/damageFile',contentType: 'multipart/form-data'},damage.uploadDamageFile);
    server.put({path:'/api/user/:userId/damage/:damageId',contentType: 'application/json'} ,damage.updateDamage);
    server.put({path:'/api/user/:userId/damage/:damageId/damageStatus/:damageStatus',contentType: 'application/json'} ,damage.updateDamageStatus);
    server.put({path:'/api/user/:userId/damage/:damageId/hangStatus/:hangStatus',contentType: 'application/json'} ,damage.updateDamageHangStatus);

    /**
     * DamageCheck Module
     */
    server.get('/api/damageCheck',damageCheck.queryDamageCheck);
    server.get('/api/damageCheckMonthStat',damageCheck.queryDamageCheckMonthStat);
    server.get('/api/damageCheckWeekStat',damageCheck.queryDamageCheckWeekStat);
    server.get('/api/damageCheckUnderMonthStat',damageCheck.queryDamageCheckUnderMonthStat);
    server.get('/api/damageCheckUnderWeekStat',damageCheck.queryDamageCheckUnderWeekStat);
    server.post({path:'/api/user/:userId/damageCheck',contentType: 'application/json'},damageCheck.createDamageCheck);
    server.put({path:'/api/user/:userId/damageCheck/:damageCheckId',contentType: 'application/json'} ,damageCheck.updateDamageCheck);
    server.put({path:'/api/user/:userId/damageCheck/:damageCheckId/damageIndemnityStatus/:damageIndemnityStatus',contentType: 'application/json'} ,damageCheck.updateDamageCheckIndemnityStatus);

    /**
     * DamageCheckIndemnity Module
     */
    server.get('/api/damageCheckIndemnity',damageCheckIndemnity.queryDamageCheckIndemnity);
    server.get('/api/indemnityStatusCount' ,damageCheckIndemnity.queryIndemnityStatusCount);
    server.get('/api/indemnityMonthStat' ,damageCheckIndemnity.queryIndemnityMonthStat);
    server.get('/api/damageCheckIndemnity.csv', damageCheckIndemnity.getDamageCheckIndemnityCsv);
    server.post({path:'/api/user/:userId/damageCheckIndemnity',contentType: 'application/json'},damageCheckIndemnity.createDamageCheckIndemnity);
    server.put({path:'/api/user/:userId/damageCheckIndemnity/:indemnityId',contentType: 'application/json'} ,damageCheckIndemnity.updateDamageCheckIndemnity);
    server.put({path:'/api/user/:userId/damageCheckIndemnity/:indemnityId/image',contentType: 'application/json'} ,damageCheckIndemnity.updateDamageCheckIndemnityImage);
    server.put({path:'/api/user/:userId/indemnity/:indemnityId',contentType: 'application/json'} ,damageCheckIndemnity.updateIndemnity);
    server.put({path:'/api/user/:userId/indemnity/:indemnityId/indemnityStatus/:indemnityStatus',contentType: 'application/json'} ,damageCheckIndemnity.updateIndemnityStatus);

    /**
     * DamageInsure Module
     */
    server.get('/api/damageInsure',damageInsure.queryDamageInsure);
    server.get('/api/damageInsureMonthStat',damageInsure.queryDamageInsureMonthStat);
    server.get('/api/damageInsureWeekStat',damageInsure.queryDamageInsureWeekStat);
    server.post({path:'/api/user/:userId/insure',contentType: 'application/json'},damageInsure.createInsure);
    server.post({path:'/api/user/:userId/damageInsure',contentType: 'application/json'},damageInsure.createDamageInsure);
    server.put({path:'/api/user/:userId/damageInsure/:damageInsureId',contentType: 'application/json'} ,damageInsure.updateDamageInsure);
    server.put({path:'/api/user/:userId/damageInsure/:damageInsureId/insureStatus/:insureStatus',contentType: 'application/json'} ,damageInsure.updateDamageInsureStatus);

    /**
     * DamageInsureRel Module
     */
    server.get('/api/damageInsureRel.csv', damageInsureRel.getDamageInsureRelCsv);
    server.post({path:'/api/user/:userId/damageInsureRel',contentType: 'application/json'},damageInsureRel.createDamageInsureRel);
    server.del('/api/user/:userId/damageInsure/:damageInsureId/damage/:damageId' , damageInsureRel.removeDamageInsureRel);

    /**
     * DamageInsureLoan Module
     */
    server.get('/api/damageInsureLoan' ,damageInsureLoan.queryDamageInsureLoan);
    server.get('/api/damageInsureLoanStatusCount' ,damageInsureLoan.queryDamageInsureLoanStatusCount);
    server.get('/api/damageInsureLoanMonthStat' ,damageInsureLoan.queryDamageInsureLoanMonthStat);
    server.put({path:'/api/user/:userId/damageInsureLoan/:loanId',contentType: 'application/json'} ,damageInsureLoan.updateDamageInsureLoan);
    server.put({path:'/api/user/:userId/damageInsureRepayment/:loanId',contentType: 'application/json'} ,damageInsureLoan.updateDamageInsureRepayment);
    server.put({path:'/api/user/:userId/damageInsureLoan/:loanId/loanStatus/:loanStatus',contentType: 'application/json'} ,damageInsureLoan.updateDamageInsureLoanStatus);


    /**
     * RepairStation Module
     */
    server.get('/api/repairStation', repairStation.queryRepairStation);
    server.post({path:'/api/user/:userId/repairStation',contentType: 'application/json'},repairStation.createRepairStation);
    server.put({path:'/api/user/:userId/repairStation/:repairStationId',contentType: 'application/json'} ,repairStation.updateRepairStation);
    server.put({path:'/api/user/:userId/repairStation/:repairStationId/repairStationStatus/:repairStationStatus',contentType: 'application/json'} ,repairStation.updateRepairStationStatus);

    /**
     * SettleHandover Module
     */
    server.get('/api/settleHandover', settleHandover.querySettleHandover);
    server.get('/api/notSettleHandover', settleHandover.queryNotSettleHandover);
    server.get('/api/notSettleHandoverCarCount', settleHandover.queryNotSettleHandoverCarCount);
    server.get('/api/settleHandoverDayCount', settleHandover.querySettleHandoverDayCount);
    server.get('/api/settleHandoverMonthCount', settleHandover.querySettleHandoverMonthCount);
    server.get('/api/settleHandover.csv', settleHandover.getSettleHandoverCsv);
    server.get('/api/notSettleHandover.csv', settleHandover.getNotSettleHandoverCsv);
    server.get('/api/driveSettle' , settleHandover.queryDriveSettle);
    server.get('/api/driveSettle.csv' , settleHandover.getDriveSettleCsv);
    server.post({path:'/api/user/:userId/settleHandover',contentType: 'application/json'},settleHandover.createSettleHandover);
    server.put({path:'/api/user/:userId/settleHandover/:settleHandoverId',contentType: 'application/json'} ,settleHandover.updateSettleHandover);
    server.put({path:'/api/user/:userId/settleHandover/:settleHandoverId/image',contentType: 'application/json'} ,settleHandover.updateHandoveImage);

    /**
     * SettleHandoverCarRel Module
     */
    server.get('/api/settleHandoverCarRel', settleHandoverCarRel.querySettleHandoverCarRel);
    server.post({path:'/api/user/:userId/settleHandoverCarRel',contentType: 'application/json'},settleHandoverCarRel.createSettleHandoverCarRel,sysRecord.saveCarRecord);
    server.del('/api/user/:userId/settleHandover/:settleHandoverId/car/:carId' , settleHandoverCarRel.removeSettleHandoverCarRel);

    /**
     * SettleCar Module
     */
    server.get('/api/settleCar', settleCar.querySettleCar);
    server.get('/api/settleCarCount', settleCar.querySettleCarCount);
    server.get('/api/notSettleCarCount', settleCar.queryNotSettleCarCount);
    server.get('/api/settleCar.csv',settleCar.getSettleCarCsv);
    server.post({path:'/api/user/:userId/settleCar',contentType: 'application/json'},settleCar.createSettleCar);
    server.post({path:'/api/user/:userId/settleCarFile',contentType: 'multipart/form-data'},settleCar.uploadSettleCarFile);
    server.put({path:'/api/user/:userId/settleCar/:settleCarId',contentType: 'application/json'} ,settleCar.updateSettleCar);

    /**
     * MsgPush Module
     */
    server.get('/api/user/:userId/pushMsg' ,msgPush.pushMsg);
    /**
     * SMS Module
     */
    server.post({path:'/api/phone/:mobile/passwordSms',contentType: 'application/json'},sms.sendPswdSms);
    server.post({path:'/api/user/:userId/phone/:mobile/mobileSms',contentType: 'application/json'},sms.sendPhoneSms);
    /**
     * App Module
     */
    server.get('/api/app',app.queryApp);
    server.post({path:'/api/user/:userId/app',contentType: 'application/json'},app.createAppVersion);
    server.put({path:'/api/user/:userId/app/:appId',contentType: 'application/json'} ,app.updateAppVersion);


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