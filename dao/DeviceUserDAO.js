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


module.exports ={
    addDeviceUser : addDeviceUser
}