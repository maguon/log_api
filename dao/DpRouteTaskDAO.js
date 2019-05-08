/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var sysConst = require('../util/SysConst.js');
var logger = serverLogger.createLogger('DpRouteTaskDAO.js');

function addDpRouteTask(params,callback){
    var query = " insert into dp_route_task (user_id,truck_id,drive_id,route_id,route_start_id,route_start,route_end_id,route_end, " +
        " distance,oil_distance,task_plan_date,task_start_date,task_end_date,date_id,truck_number,task_status) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    if(params.routeStartId>params.routeEndId){
        paramsArray[i++] = params.routeEndId+''+params.routeStartId;
    }else{
        paramsArray[i++] = params.routeStartId+''+params.routeEndId;
    }
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.oilDistance;
    paramsArray[i++]=params.taskPlanDate;
    paramsArray[i++]=params.taskStartDate;
    paramsArray[i++]=params.taskEndDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.truckNumber;
    paramsArray[i]=params.taskStatus;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTask ');
        return callback(error,rows);
    });
}

function getDpRouteTask(params,callback) {
    var query = " select dpr.*,dpr.route_start as city_route_start,dpr.route_end as city_route_end,u.real_name as route_op_name, " +
        " t.truck_num,tl.id as trail_id,tl.truck_num as trail_num,tl.number as trail_number,d.drive_name,u1.mobile, " +
        " (select sum(plan_count) from dp_route_load_task where dp_route_task_id=dpr.id and load_task_status!=8 )plan_count, " +
        " (select sum(real_count) from dp_route_load_task where dp_route_task_id=dpr.id and load_task_status!=8 )real_count, " +
        " tb.load_distance_oil,tb.no_load_distance_oil,tb.urea " +
        " from dp_route_task dpr " +
        " left join user_info u on dpr.user_id = u.uid " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_info tl on t.rel_id = tl.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join user_info u1 on d.user_id = u1.uid " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.routeOpName){
        paramsArray[i++] = params.routeOpName;
        query = query + " and u.real_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpr.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dprl.receive_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    if(params.taskStatusArr){
        query = query + " and dpr.task_status in ("+params.taskStatusArr + ") "
    }
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and dpr.task_status = ? ";
    }
    if(params.loadDistance){
        paramsArray[i++] = params.loadDistance;
        query = query + " and dpr.car_count >= ? ";
    }
    if(params.noLoadDistance){
        paramsArray[i++] = params.noLoadDistance;
        query = query + " and dpr.car_count < ? ";
    }
    if(params.loadFlag){
        paramsArray[i++] = params.loadFlag;
        query = query + " and dpr.load_flag = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query = query + " and dprl.load_task_status = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and dpr.stat_status = ? ";
    }
    query = query + ' group by dpr.id ';
    query = query + " order by dpr.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTask ');
        return callback(error,rows);
    });
}

function getDpRouteTaskList(params,callback) {
    var query = " select dpr.*,dpr.route_start as city_route_start,dpr.route_end as city_route_end,u.real_name as route_op_name, " +
        " t.truck_num,tl.id as trail_id,tl.truck_num as trail_num,tl.number as trail_number,d.drive_name,u1.mobile, " +
        " (select sum(plan_count) from dp_route_load_task where dp_route_task_id=dpr.id and load_task_status!=8 )plan_count, " +
        " (select sum(real_count) from dp_route_load_task where dp_route_task_id=dpr.id and load_task_status!=8 )real_count " +
        " from dp_route_task dpr " +
        " left join user_info u on dpr.user_id = u.uid " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_info tl on t.rel_id = tl.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join user_info u1 on d.user_id = u1.uid " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpr.route_end_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    if(params.taskStatusArr){
        query = query + " and dpr.task_status in ("+params.taskStatusArr + ") "
    }
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and dpr.task_status = ? ";
    }
    if(params.loadFlag){
        paramsArray[i++] = params.loadFlag;
        query = query + " and dpr.load_flag = ? ";
    }
    query = query + ' group by dpr.id ';
    query = query + " order by dpr.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskList ');
        return callback(error,rows);
    });
}

function getDpRouteTaskBase(params,callback) {
    var query = " select dpr.*,dpr.route_start as city_route_start,dpr.route_end as city_route_end, " +
        " u.real_name as route_op_name,t.truck_num,tb.brand_name, " +
        " sum(case when dpr.load_flag = 1 then dpr.distance end) as load_distance, " +
        " sum(case when dpr.load_flag = 0 then dpr.distance end) as no_load_distance " +
        " from dp_route_task dpr " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_brand tb on t.brand_id = tb.id " +
        " left join user_info u on dpr.user_id = u.uid " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.taskStatusArr){
        query = query + " and dpr.task_status in ("+params.taskStatusArr + ") "
    }
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and dpr.task_status = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and dpr.stat_status = ? ";
    }
    query = query + ' group by dpr.id ';
    query = query + " order by dpr.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskBase ');
        return callback(error,rows);
    });
}

function getDriveDistanceMoney(params,callback) {
    var query = " select dpr.* from dp_route_task dpr " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and dpr.task_status >= ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveDistanceMoney ');
        return callback(error,rows);
    });
}

function getDriveDistanceCount(params,callback) {
    var query = " select sum(dpr.distance) as distance,sum(dpr.car_count) as car_count " +
        " from dp_route_task dpr " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and dpr.task_status >= ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveDistanceCount ');
        return callback(error,rows);
    });
}

function getDriveDistanceLoadStat(params,callback) {
    var query = " select d.id as drive_id,d.drive_name,u.mobile,t.id as truck_id,t.truck_num," +
        " count(case when dpr.task_status >= " + params.taskStatus + " then dpr.id end) as complete_count, " +
        " sum(case when dpr.load_flag = 1 then dpr.distance end) as load_distance, " +
        " sum(case when dpr.load_flag = 0 then dpr.distance end) as no_load_distance " +
        " from dp_route_task dpr " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join user_info u on d.user_id = u.uid " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    if(params.loadFlag){
        paramsArray[i++] = params.loadFlag;
        query = query + " and dpr.load_flag = ? ";
    }
    query = query + ' group by d.id,t.id';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveDistanceLoadStat ');
        return callback(error,rows);
    });
}

function getNotCompletedTaskStatusCount(params,callback) {
    var query = " select count(id) as task_status_count from dp_route_task where id is not null ";
    var paramsArray=[],i=0;
    if(params.taskStatusArr){
        query = query + " and task_status in ("+params.taskStatusArr + ") "
    }
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and task_status = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and stat_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getNotCompletedTaskStatusCount ');
        return callback(error,rows);
    });
}

function getTaskStatusCount(params,callback) {
    var query = " select task_status,count(id) as task_status_count from dp_route_task where id is not null ";
    var paramsArray=[],i=0;
    if(params.taskStatusArr){
        query = query + " and task_status in ("+params.taskStatusArr + ") "
    }
    if(params.taskStatus){
        paramsArray[i++] = params.taskStatus;
        query = query + " and task_status = ? ";
    }
    if(params.taskEndDateStart){
        paramsArray[i++] = params.taskEndDateStart +" 00:00:00";
        query = query + " and task_end_date >= ? ";
    }
    if(params.taskEndDateEnd){
        paramsArray[i++] = params.taskEndDateEnd +" 23:59:59";
        query = query + " and task_end_date <= ? ";
    }
    query = query + ' group by task_status ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTaskStatusCount ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskStatus(params,callback){
    var query = " update dp_route_task set task_status = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.taskStatus;
    if(params.taskStartDate){
        paramsArray[i++] = params.taskStartDate;
        query = query + " ,task_start_date = ? ";
    }
    if(params.taskEndDate){
        paramsArray[i++] = params.taskEndDate;
        query = query + " ,task_end_date = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " ,date_id = ? ";
    }
    if(params.loadFlag){
        paramsArray[i++] = params.loadFlag;
        query = query + " ,load_flag = ? ";
    }
    query = query + ' where id = ' + params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskStatus ');
        return callback(error,rows);
    });
}

function updateDpRouteStatStatus(params,callback){
    var query = " update dp_route_task set stat_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.statStatus;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteStatStatus ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskCarCount(params,callback){
    var query = " update dp_route_task set car_count = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carCount;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskCarCount ');
        return callback(error,rows);
    });
}

function finishDpRouteTask (params,callback){
    var query = "UPDATE dp_route_task set task_status= "+ sysConst.TASK_STATUS.all_completed +
        " where id =   ?  and " +
        " (select count(*) from dp_route_load_task where load_task_status <>"+ sysConst.LOAD_TASK_STATUS.arrive+
        " and load_task_status<>"+sysConst.LOAD_TASK_STATUS.cancel+" and dp_route_task_id = ? ) =0 ;"
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' finishDpRouteTask ');
        return callback(error,rows);
    });

}

function getRouteTaskMonthStat(params,callback){
    var query = "select sum(case when drt.load_flag = 1 then drt.distance end) as load_distance ," +
        " sum(case when drt.load_flag = 0 then drt.distance end) as no_load_distance ,db.y_month " +
        " from date_base db left join dp_route_task drt on db.id=drt.date_id " +
        " where  drt.task_status= " + sysConst.TASK_STATUS.all_completed ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + ' and db.y_month >= ? '
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + ' and db.y_month <= ? '
    }
    query = query + " group by db.y_month  order by db.y_month desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRouteTaskMonthStat ');
        return callback(error,rows);
    });
}

function getRouteTaskWeekStat(params,callback){
    var query = "select sum(case when drt.load_flag = 1 then drt.distance end) as load_distance ," +
        " sum(case when drt.load_flag = 0 then drt.distance end) as no_load_distance ,db.y_week " +
        " from date_base db left join dp_route_task drt on db.id=drt.date_id " +
        " where  drt.task_status= " + sysConst.TASK_STATUS.all_completed ;
    var paramsArray=[],i=0;
    if(params.weekStart){
        paramsArray[i++] = params.weekStart;
        query = query + ' and db.y_week >= ? '
    }
    if(params.weekEnd){
        paramsArray[i++] = params.weekEnd;
        query = query + ' and db.y_week <= ? '
    }
    query = query + " group by db.y_week  order by db.y_week desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRouteTaskWeekStat ');
        return callback(error,rows);
    });
}

function getRouteTaskDayStat(params,callback){
    var query = "select sum(case when drt.load_flag = 1 then drt.distance end) as load_distance ," +
        " sum(case when drt.load_flag = 0 then drt.distance end) as no_load_distance ,db.id " +
        " from date_base db left join dp_route_task drt on db.id=drt.date_id " +
        " where  drt.task_status= " + sysConst.TASK_STATUS.all_completed ;
    var paramsArray=[],i=0;
    if(params.dayStart){
        paramsArray[i++] = params.dayStart;
        query = query + ' and db.id >= ? '
    }
    if(params.dayEnd){
        paramsArray[i++] = params.dayEnd;
        query = query + ' and db.id <= ? '
    }
    query = query + " group by db.id  order by db.id desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRouteTaskDayStat ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadFlag(params,callback){
    var query = " update dp_route_task set distance = ? , car_count = ? , load_flag = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.carCount;
    paramsArray[i++]=params.loadFlag;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadFlag ');
        return callback(error,rows);
    });
}

function updateDpRouteOilLoadFlag(params,callback){
    var query = " update dp_route_task set oil_distance = ? , oil_load_flag = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.oilDistance;
    paramsArray[i++]=params.oilLoadFlag;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteOilLoadFlag ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTask : addDpRouteTask,
    getDpRouteTask : getDpRouteTask,
    getDpRouteTaskList : getDpRouteTaskList,
    getDpRouteTaskBase : getDpRouteTaskBase,
    getNotCompletedTaskStatusCount : getNotCompletedTaskStatusCount,
    getDriveDistanceMoney : getDriveDistanceMoney,
    getDriveDistanceCount : getDriveDistanceCount,
    getDriveDistanceLoadStat : getDriveDistanceLoadStat,
    getTaskStatusCount : getTaskStatusCount,
    updateDpRouteTaskStatus : updateDpRouteTaskStatus,
    updateDpRouteStatStatus : updateDpRouteStatStatus,
    updateDpRouteTaskCarCount : updateDpRouteTaskCarCount ,
    finishDpRouteTask : finishDpRouteTask ,
    getRouteTaskMonthStat : getRouteTaskMonthStat ,
    getRouteTaskWeekStat : getRouteTaskWeekStat ,
    getRouteTaskDayStat : getRouteTaskDayStat,
    updateDpRouteLoadFlag : updateDpRouteLoadFlag,
    updateDpRouteOilLoadFlag : updateDpRouteOilLoadFlag
}