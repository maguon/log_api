/**
 * Created by zwl on 2017/3/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

function addUser(params,callback){
    var query = " insert into user_info (user_name,real_name,password,gender,tel,fax,mobile,email) values (? , ? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.fax;
    paramsArray[i++]=params.mobile;
    paramsArray[i]=params.email;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUser ');
        return callback(error,rows);
    });
}

function getUser(params,callback) {
    var query = " select * from user_info where uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUser ');
        return callback(error,rows);
    });
}

function getUserBase(params,callback){
    var query = " select uid,user_name,real_name,password,gender,tel,fax,mobile,email from user_info where uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.email){
        paramsArray[i++] = params.email;
        query = query + " and email = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserBase ');
        return callback(error,rows);
    });
}

function updateUserInfo(params,callback){
    var query = " update user_info set real_name = ? ,gender = ? ,tel = ? ,fax = ? ,mobile = ? ,email = ?  where uid = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.tel;
    paramsArray[i++] = params.fax;
    paramsArray[i++] = params.mobile;
    paramsArray[i++] = params.email;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserInfo ');
        return callback(error,rows);
    });
}

function updateUserPassword(params,callback){
    var query = " update user_info set password = ? where uid = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserPassword ');
        return callback(error,rows);
    });

}

module.exports ={
    addUser : addUser,
    getUser : getUser,
    getUserBase : getUserBase,
    updateUserInfo : updateUserInfo,
    updateUserPassword : updateUserPassword
}