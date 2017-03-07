/**
 * Created by zwl on 2017/3/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDAO.js');

function addUser(params,callback){
    var query = " insert into user_info (user_name,real_name,password,sex,tel,fax,mobile,email) values (? , ? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.user_name;
    paramsArray[i++]=params.real_name;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.sex;
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
    if(params.email){
        paramsArray[i++] = params.email;
        query = query + " and email = ? ";
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
module.exports ={
    addUser : addUser,
    getUser : getUser
}