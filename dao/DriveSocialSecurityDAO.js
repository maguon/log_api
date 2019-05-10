/**
 * Created by zwl on 2019/5/10.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSocialSecurityDAO.js');

function addDriveSocialSecurity(params,callback){
    var query = "insert into drive_social_security (drive_id,drive_name,mobile,y_month, " +
        " social_security_fee) values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.mobile;
    paramsArray[i++]=params.yMonth;
    paramsArray[i++]=params.socialSecurityFee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addDriveSocialSecurity ');
        return callback(error,rows);
    })
}

function getDriveSocialSecurity(params,callback) {
    var query = " select dss.* from drive_social_security dss " +
        " where dss.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSocialSecurityId){
        paramsArray[i++] = params.driveSocialSecurityId;
        query = query + " and dss.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dss.drive_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dss.drive_id = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and dss.mobile = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and dss.y_month = ? ";
    }
    query = query + ' order by dss.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSocialSecurity ');
        return callback(error,rows);
    });
}

function updateDriveSocialSecurity(params,callback){
    var query = " update drive_social_security set social_security_fee = ? where id is not null " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.socialSecurityFee;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and y_month = ? ";
    }
    if(params.driveSocialSecurityId){
        paramsArray[i++] = params.driveSocialSecurityId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveSocialSecurity ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveSocialSecurity : addDriveSocialSecurity,
    getDriveSocialSecurity : getDriveSocialSecurity,
    updateDriveSocialSecurity : updateDriveSocialSecurity
}