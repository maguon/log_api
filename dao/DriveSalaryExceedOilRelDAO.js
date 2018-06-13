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
    var query = " select dseor.*,deo.exceed_oil_quantity,deo.exceed_oil_money,deo.dp_route_task_id,dpr.task_plan_date,dpr.truck_id,t.truck_num " +
        " from drive_salary_exceed_oil_rel dseor " +
        " left join drive_exceed_oil deo on dseor.exceed_oil_id = deo.id " +
        " left join dp_route_task dpr on deo.dp_route_task_id = dpr.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
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


module.exports ={
    addDriveSalaryExceedOilRel : addDriveSalaryExceedOilRel,
    getDriveSalaryExceedOilRel : getDriveSalaryExceedOilRel
}