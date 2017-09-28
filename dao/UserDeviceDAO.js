/**
 * Created by zwl on 2017/9/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDeviceDAO.js');

function addUserDevice(params,callback){
    var query = " insert into user_device (user_id,device_token,version,app_type,device_type) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.appType;
    paramsArray[i]=params.deviceType;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUserDevice ');
        return callback(error,rows);
    });
}

function getUserDevice(params,callback){
    var query = " select * from user_device where id is not null ";
    var paramsArray=[],i=0;
    if(params.userDeviceId){
        paramsArray[i++] = params.userDeviceId;
        query = query + " and id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and device_token = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserDevice ');
        return callback(error,rows);
    });
}

function updateUserDevice(params,callback){
    var query = " update user_device set updated_on = ? where user_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.updatedOn;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserDevice ');
        return callback(error,rows);
    });
}

function deleteUserDevice(params,callback){
    var query = " delete from user_device where id is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and device_token = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteUserDevice ');
        return callback(error,rows);
    });
}


module.exports ={
    addUserDevice : addUserDevice,
    getUserDevice : getUserDevice,
    updateUserDevice : updateUserDevice,
    deleteUserDevice : deleteUserDevice
}