/**
 * Created by zwl on 2017/3/15.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDAO.js');

function getDrive(params,callback) {
    var query = " select * from drive_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and drive_name = ? ";
    }
    if(params.ascriptionType){
        paramsArray[i++] = params.ascriptionType;
        query = query + " and ascription_type = ? ";
    }
    if(params.driveType){
        paramsArray[i++] = params.driveType;
        query = query + " and drive_type = ? ";
    }
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and drive_status = ? ";
    }
    if(params.licenseLevel){
        paramsArray[i++] = params.licenseLevel;
        query = query + " and license_level = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrive ');
        return callback(error,rows);
    });
}

module.exports ={
    getDrive : getDrive
}