/**
 * Created by zwl on 2017/3/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

function addUser(params,callback){
    var query = " insert into user_info (mobile,real_name,password,type,gender) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.mobile;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.type;
    paramsArray[i]=params.gender;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUser ');
        return callback(error,rows);
    });
}

function getUser(params,callback) {
    var query = " select u.* from user_info u left join drive_info d on u.uid = d.user_id where u.uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and u.uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and u.mobile = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and u.real_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and u.type = ? ";
    }
    if(params.sa){
        paramsArray[i++] = params.sa;
        query = query + " and u.sa = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and u.status = ? ";
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
    var query = " select u.uid,u.mobile,u.real_name,u.type,u.gender,u.avatar_image,u.status,d.id as drive_id from user_info u " +
        " left join drive_info d on u.uid = d.user_id where u.sa = 0 and u.uid is not null ";
    var paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and u.uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and u.mobile = ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and u.real_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and u.type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and u.status = ? ";
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
    var query = " update user_info set mobile = ? , real_name = ? , type = ? , gender = ? where uid = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.mobile;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.gender;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserInfo ');
        return callback(error,rows);
    });
}

function updateUserStatus(params,callback){
    var query = " update user_info set status = ? where uid = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserStatus ');
        return callback(error,rows);
    });
}

function updateUserPassword(params,callback){
    var query = " update user_info set password = ? where uid is not null ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uid = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and mobile = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserPassword ');
        return callback(error,rows);
    });
}

function updateUserAvatarImage(params,callback){
    var query = " update user_info set avatar_image = ? where uid = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.avatarImage;
    paramsArray[i]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUserAvatarImage ');
        return callback(error,rows);
    });
}


module.exports ={
    addUser : addUser,
    getUser : getUser,
    getUserBase : getUserBase,
    updateUserInfo : updateUserInfo,
    updateUserStatus : updateUserStatus,
    updateUserPassword : updateUserPassword,
    updateUserAvatarImage : updateUserAvatarImage
}