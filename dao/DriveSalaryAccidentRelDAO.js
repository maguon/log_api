/**
 * Created by zwl on 2018/4/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryAccidentRelDAO.js');

function addDriveSalaryAccidentRel(params,callback){
    var query = " insert into drive_salary_accident_rel (drive_salary_id,accident_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.accidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryAccidentRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryAccidentRel(params,callback) {
    var query = " select daar.*,ta.accident_date,ta.accident_explain,tac.truck_accident_type,tac.under_cost,tac.company_cost," +
        " t.truck_num,t.truck_type,tb.brand_name,dpr.id as dp_route_task_id,c.city_name as city_route_start,c1.city_name as city_route_end " +
        " from drive_salary_accident_rel daar " +
        " left join drive_salary ds on daar.drive_salary_id = ds.id " +
        " left join truck_accident_info ta on daar.accident_id = ta.id " +
        " left join truck_accident_check tac on ta.id = tac.truck_accident_id " +
        " left join truck_info t on ta.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join dp_route_task dpr on ta.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info c1 on dpr.route_end_id = c1.id " +
        " where daar.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and dsdr.drive_salary_id = ? ";
    }
    query = query + ' group by daar.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryAccidentRel ');
        return callback(error,rows);
    });
}

function deleteDriveSalaryAccidentRel(params,callback){
    var query = " delete from drive_salary_accident_rel where drive_salary_id = ? and accident_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.accidentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveSalaryAccidentRel ');
        return callback(error,rows);
    });
}



module.exports ={
    addDriveSalaryAccidentRel : addDriveSalaryAccidentRel,
    getDriveSalaryAccidentRel : getDriveSalaryAccidentRel,
    deleteDriveSalaryAccidentRel : deleteDriveSalaryAccidentRel
}