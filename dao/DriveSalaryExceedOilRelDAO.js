/**
 * Created by zwl on 2018/6/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryExceedOilRelDAO.js');

function addDriveSalaryExceedOilRel(params,callback){
    var query = " insert into drive_salary_exceed_oil_rel (drive_salary_id,exceed_oil_date_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryExceedOilRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryExceedOilRel(params,callback) {
    var query = " select dseor.*,deod.month_date_id,deod.plan_oil_total,deod.plan_urea_total," +
        " deod.actual_oil_total,deod.actual_urea_total,deod.actual_money,deod.settle_status " +
        " from drive_salary_exceed_oil_rel dseor " +
        " left join drive_exceed_oil_date deod on dseor.exceed_oil_date_id = deod.id " +
        " where dseor.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and dseor.drive_salary_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryExceedOilRel ');
        return callback(error,rows);
    });
}

function deleteDriveSalaryExceedOilRel(params,callback){
    var query = " delete from drive_salary_exceed_oil_rel where drive_salary_id = ? and exceed_oil_date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveSalaryExceedOilRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveSalaryExceedOilRel : addDriveSalaryExceedOilRel,
    getDriveSalaryExceedOilRel : getDriveSalaryExceedOilRel,
    deleteDriveSalaryExceedOilRel : deleteDriveSalaryExceedOilRel
}