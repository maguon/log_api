/**
 * Created by zwl on 2018/6/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryExceedOilRelDAO.js');

function addDriveSalaryExceedOilRel(params,callback){
    var query = " insert into drive_salary_exceed_oil_rel (drive_salary_id,exceed_oil_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryExceedOilRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryExceedOilRel(params,callback) {
    var query = " select dseor.*,t.truck_num,dpror.route_start,dpror.route_end,dpror.distance,dpror.load_flag, " +
        " deo.exceed_oil,deo.exceed_urea,deo.actual_money,deo.oil_date,deo.settle_status " +
        " from drive_salary_exceed_oil_rel dseor " +
        " left join drive_exceed_oil deo on dseor.exceed_oil_id = deo.id " +
        " left join drive_dp_route_task_oil_rel dor on deo.id = dor.drive_exceed_oil_id " +
        " left join dp_route_task_oil_rel dpror on dor.dp_route_task_oil_rel_id = dpror.id" +
        " left join truck_info t on dpror.truck_id = t.id " +
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
    var query = " delete from drive_salary_exceed_oil_rel where drive_salary_id = ? and exceed_oil_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.exceedOilId;
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