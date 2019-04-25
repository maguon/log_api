/**
 * Created by zwl on 2018/6/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryPeccancyRelDAO.js');

function addDriveSalaryPeccancyRel(params,callback){
    var query = " insert into drive_salary_peccancy_rel (drive_salary_id,peccancy_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.peccancyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryPeccancyRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryPeccancyRel(params,callback) {
    var query = " select dspr.*,dp.fine_score,dp.fine_money,dp.under_money,dp.under_money,company_money,dp.start_date,dp.end_date,dp.truck_id,t.truck_num " +
        " from drive_salary_peccancy_rel dspr " +
        " left join drive_peccancy dp on dspr.peccancy_id = dp.id " +
        " left join truck_info t on dp.truck_id = t.id " +
        " where dspr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and dspr.drive_salary_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryPeccancyRel ');
        return callback(error,rows);
    });
}

function deleteDriveSalaryPeccancyRel(params,callback){
    var query = " delete from drive_salary_peccancy_rel where drive_salary_id = ? and peccancy_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.peccancyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveSalaryPeccancyRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveSalaryPeccancyRel : addDriveSalaryPeccancyRel,
    getDriveSalaryPeccancyRel : getDriveSalaryPeccancyRel,
    deleteDriveSalaryPeccancyRel : deleteDriveSalaryPeccancyRel
}