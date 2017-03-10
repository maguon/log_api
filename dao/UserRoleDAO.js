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

module.exports ={
    addUserRole : addUserRole
}