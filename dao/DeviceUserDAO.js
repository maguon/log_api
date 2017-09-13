/**
 * Created by zwl on 2017/9/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DeviceUserDAO.js');

function addDeviceUser(params,callback){
    var query = " insert into device_user (user_id,device_token,device_type) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i]=params.deviceType;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDeviceUser ');
        return callback(error,rows);
    });
}

function getDeviceUser(params,callback){
    var query = " select * from device_user where id is not null ";
    var paramsArray=[],i=0;
    if(params.deviceUserId){
        paramsArray[i++] = params.deviceUserId;
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
        logger.debug(' getDeviceUser ');
        return callback(error,rows);
    });
}

function deleteDeviceUser(params,callback){
    var query = " delete from device_user where id is not null ";
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
        logger.debug(' deleteDeviceUser ');
        return callback(error,rows);
    });
}


module.exports ={
    addDeviceUser : addDeviceUser,
    getDeviceUser : getDeviceUser,
    deleteDeviceUser : deleteDeviceUser
}