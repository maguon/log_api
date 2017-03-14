/**
 * Created by zwl on 2017/3/10.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserRoleDAO.js');

function addUserRole(params,callback){
    var query = " insert into user_role (role_name) values (?)";
    var paramsArray=[],i=0;
    paramsArray[i]=params.roleName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUserRole ');
        return callback(error,rows);
    });
}

function getUserRole(params,callback) {
    var query = " select * from user_role where role_id is not null ";
    var paramsArray=[],i=0;
    if(params.roleId){
        paramsArray[i++] = params.roleId;
        query = query + " and role_id = ? ";
    }
    if(params.roleName){
        paramsArray[i++] = params.roleName;
        query = query + " and role_name = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getUserRole ');
        return callback(error,rows);
    });
}

module.exports ={
    addUserRole : addUserRole,
    getUserRole : getUserRole
}