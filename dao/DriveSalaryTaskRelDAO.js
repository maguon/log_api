/**
 * Created by zwl on 2018/4/16.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryTaskRelDAO.js');

function addDriveSalaryTaskRel(params,callback){
    var query = " insert into drive_salary_task_rel (drive_salary_id,dp_route_task_id,distance_money,distance_total_money) " +
        " values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.distanceMoney;
    paramsArray[i]=params.distanceTotalMoney;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveSalaryTaskRel ');
        return callback(error,rows);
    });
}

function getDriveSalaryTaskRel(params,callback) {
    var query = " select datl.*,c.city_name as city_route_start,ce.city_name as city_route_end, " +
        " dpr.distance,dpr.car_count,dpr.task_end_date,t.truck_num,t.truck_type,tb.brand_name, " +
        " dpr.load_flag,dpr.truck_number, " +
        " sum(case when dpr.load_flag = 1 then dpr.distance end) as load_distance, " +
        " sum(case when dpr.load_flag = 0 then dpr.distance end) as no_load_distance " +
        " from drive_salary_task_rel datl " +
        " left join drive_salary ds on datl.drive_salary_id = ds.id " +
        " left join dp_route_task dpr on datl.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info ce on dpr.route_end_id = ce.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " where datl.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveSalaryId){
        paramsArray[i++] = params.driveSalaryId;
        query = query + " and datl.drive_salary_id = ? ";
    }
    query = query + ' group by datl.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveSalaryTaskRel ');
        return callback(error,rows);
    });
}

function deleteDriveSalaryTaskRel(params,callback){
    var query = " delete from drive_salary_task_rel where drive_salary_id = ? and dp_route_task_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveSalaryId;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveSalaryTaskRel ');
        return callback(error,rows);
    });
}



module.exports ={
    addDriveSalaryTaskRel : addDriveSalaryTaskRel,
    getDriveSalaryTaskRel : getDriveSalaryTaskRel,
    deleteDriveSalaryTaskRel : deleteDriveSalaryTaskRel
}