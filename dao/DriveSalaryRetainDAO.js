/**
 * Created by zwl on 2018/4/16.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryRetainDAO.js');

function addDriveSalaryRetain(params,callback){
    var query = " insert into drive_salary_retain (y_month,user_id,drive_id,damage_retain_fee,damage_op_fee,type,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.yearMonth;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.damageRetainFee;
    paramsArray[i++]=params.damageOpFee;
    paramsArray[i++]=params.type;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryRetain ');
        return callback(error,rows);
    });
}

function getDriveSalaryRetain(params,callback) {
    var query = " select dsr.*,di.drive_name,di.tel " +
        " from drive_salary_retain dsr " +
        " left join drive_info di on dsr.drive_id = di.id " +
        " where dsr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dsr.drive_id = ? ";
    }
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and dsr.y_month = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and dsr.type = ? ";
    }
    query = query + ' group by dsr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryRetain ');
        return callback(error,rows);
    });
}

module.exports ={
    addDriveSalaryRetain : addDriveSalaryRetain,
    getDriveSalaryRetain : getDriveSalaryRetain
}