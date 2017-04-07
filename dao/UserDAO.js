/**
 * Created by zwl on 2017/3/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

function addUser(params,callback){
    var query = " insert into user_info (mobile,real_name,password,dept_id,gender) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.mobile;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.deptId;
    paramsArray[i++]=params.gender;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUser ');
        return callback(error,rows);
    });
}

function getUser(params,callback) {
    var query = " select u.*,d.dept_name from user_info u left join department d on u.dept_id = d.dept_id where uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
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
    var query = " select u.uid,u.mobile,u.real_name,u.password,u.dept_id,u.gender," +
        " u.status,d.dept_name from user_info u left join department d on u.dept_id = d.dept_id " +
        " where uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
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
        logger.debug(' getUserBase ');
        return callback(error,rows);
    });
}

function updateUserInfo(params,callback){
    var query = " update user_info set real_name = ? , dept_id = ? , gender = ? , mobile = ? ,status = ?  where uid = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.deptId;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.mobile;
    paramsArray[i++] = params.status;
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