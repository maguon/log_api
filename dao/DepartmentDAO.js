/**
 * Created by zwl on 2017/3/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DepartmentDAO.js');

function addDepartment(params,callback){
    var query = " insert into department (dept_name,tel,fax) values (? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.deptName;
    paramsArray[i++]=params.tel;
    paramsArray[i]=params.fax;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDepartment ');
        return callback(error,rows);
    });
}

function getDepartment(params,callback) {
    var query = " select * from department where dept_id is not null ";
    var paramsArray=[],i=0;
    if(params.deptId){
        paramsArray[i++] = params.deptId;
        query = query + " and dept_id = ? ";
    }
    if(params.deptName){
        paramsArray[i++] = params.deptName;
        query = query + " and dept_name = ? ";
    }
    if(params.tel){
        paramsArray[i++] = params.tel;
        query = query + " and tel = ? ";
    }
    if(params.fax){
        paramsArray[i++] = params.fax;
        query = query + " and fax = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDepartment ');
        return callback(error,rows);
    });
}

function updateDepartment(params,callback){
    var query = " update department set dept_name = ? ,tel = ? ,fax = ?  where dept_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.deptName;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.fax;
    paramsArray[i]=params.departmentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDepartment ');
        return callback(error,rows);
    });
}

function deleteDepartment(params,callback) {
    var query = " delete from department where dept_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.departmentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDepartment ');
        return callback(error,rows);
    });
}

module.exports ={
    addDepartment : addDepartment,
    getDepartment : getDepartment,
    updateDepartment : updateDepartment,
    deleteDepartment : deleteDepartment
}