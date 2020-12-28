/**
 * Created by yym on 2020/12/28.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysNotificationDAO.js');

function addSysNotification(params,callback){
    var query = "insert into sys_notification (user_id,title,content,status) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.title;
    paramsArray[i++]=params.content;
    paramsArray[i]=params.status;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addSysNotification ');
        return callback(error,rows);
    })
}

function getSysNotification(params,callback) {
    var query = " select * from sys_notification sn" +
        " where sn.id is not null ";
    var paramsArray=[],i=0;
    if(params.sysNotificationId){
        paramsArray[i++] = params.sysNotificationId;
        query = query + " and sn.id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and sn.status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and sn.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and sn.created_on <= ? ";
    }
    query = query + '  order by sn.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSysNotification ');
        return callback(error,rows);
    });
}

function updateSysNotificationStatus(params,callback){
    var query = " update sys_notification set status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.sysNotificationId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRepairStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addSysNotification : addSysNotification,
    getSysNotification : getSysNotification,
    updateSysNotificationStatus : updateSysNotificationStatus
}