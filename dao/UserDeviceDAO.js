/**
 * Created by zwl on 2017/9/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDeviceDAO.js');

function addUserDevice(params,callback){
    var query = " insert into user_device (user_id,device_id,version,app_type,device_type) " +
        " values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.deviceId;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.appType;
    paramsArray[i]=params.deviceType;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUserDevice ');
        return callback(error,rows);
    });
}

function getUserDevice(params,callback){
    var query = " select ud.* from user_device ud " +
        " left join user_info u on ud.user_id = u.uid where ud.id is not null ";
    var paramsArray=[],i=0;
    if(params.userDeviceId){
        paramsArray[i++] = params.userDeviceId;
        query = query + " and ud.id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ud.user_id = ? ";
    }
    if(params.deviceId){
        paramsArray[i++] = params.deviceId;
        query = query + " and ud.device_id = ? ";
    }
    if(params.appType){
        paramsArray[i++] = params.appType;
        query = query + " and ud.app_type = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and ud.device_token = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserDevice ');
        return callback(error,rows);
    });
}

function updateUserDevice(params,callback){
    var query = " update user_device set version = ? , updated_on = ? " +
        " where user_id = ? and device_id = ? and app_type = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.version;
    paramsArray[i++] = params.updatedOn;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.deviceId;
    paramsArray[i++] = params.appType;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserDevice ');
        return callback(error,rows);
    });
}

function updateUserDeviceToken(params,callback){
    var query = " update user_device set device_token = ? " +
        " where user_id = ? and device_id = ? and app_type = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.deviceId;
    paramsArray[i++] = params.appType;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserDeviceToken ');
        return callback(error,rows);
    });
}

function updateDeviceUpdatedOn(params,callback){
    var query = " update user_device set version = ? , updated_on = ? " +
        " where user_id = ? and device_id = ? and app_type = ? and device_token = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.version;
    paramsArray[i++] = params.updatedOn;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.deviceId;
    paramsArray[i++] = params.appType;
    paramsArray[i++] = params.token;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDeviceUpdatedOn ');
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
    updateUserDeviceToken : updateUserDeviceToken,
    updateDeviceUpdatedOn : updateDeviceUpdatedOn,
    deleteUserDevice : deleteUserDevice
}