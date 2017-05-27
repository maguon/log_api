var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AdminUserDAO.js');

function queryAdminUser(params,callback){
    var query = " select * from user_info where uid is not null ";
    var paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and real_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}

function queryAdminBase(params,callback){
    var query = " select uid,mobile,real_name,type,gender,status from user_info where sa = 1 and uid is not null ";
    var paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and real_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryAdminBase ');
        return callback(error,rows);
    });
}


module.exports = {
    queryAdminUser : queryAdminUser,
    queryAdminBase : queryAdminBase
}