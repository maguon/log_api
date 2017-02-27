

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AdminUserDAO.js');

function updatePassword(params,callback){
    var query = " update admin_user set password = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });

}

function updateInfo(params,callback){
    var query = " update admin_user set name = ? ,remark= ?,phone=? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.name;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}

function queryAdminUser(params,callback){
    var query = " select * from admin_user where id is not null ";
    var paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and id = ? ";
    }
    if(params.username){
        paramsArray[i++] = params.username;
        query = query + " and username = ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}

function queryAdminInfo(req,res,next){
    var query = " select * from admin_user where id is not null";
    var paramsArray=[],i=0;
    if(params.adminId){
        query = query + " and id = ? "
        paramsArray[i++]=params.adminId;
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryUser ');
        return callback(error,rows);
    });
}

module.exports = {
    updatePassword : updatePassword ,
    updateInfo : updateInfo ,
    queryAdminUser : queryAdminUser,
    queryAdminInfo : queryAdminInfo
}