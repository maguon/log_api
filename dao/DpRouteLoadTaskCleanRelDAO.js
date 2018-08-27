/**
 * Created by zwl on 2018/1/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRelDAO.js');

function addDpRouteLoadTaskCleanRel(params,callback){
    var query = " insert into dp_route_load_task_clean_rel (dp_route_task_id,dp_route_load_task_id," +
        " drive_id,truck_id,receive_id,single_price,total_price,car_count) values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i]=params.carCount;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRel(params,callback) {
    var query = " select dpcr.*,d.drive_name,t.truck_num,u.real_name as field_op_name,dprl.load_date, " +
        " cs.city_name as route_start_name,ba.addr_name,ci.city_name as route_end_name, " +
        " r.short_name,u1.real_name as grant_user_name,u2.real_name as drive_user_name " +
        " from dp_route_load_task_clean_rel dpcr " +
        " left join drive_info d on dpcr.drive_id = d.id " +
        " left join truck_info t on dpcr.truck_id = t.id " +
        " left join receive_info r on dpcr.receive_id = r.id " +
        " left join dp_route_load_task dprl on dpcr.dp_route_load_task_id = dprl.id " +
        " left join user_info u on dprl.field_op_id = u.uid " +
        " left join user_info u1 on dpcr.grant_user_id = u1.uid " +
        " left join user_info u2 on dpcr.drive_user_id = u2.uid " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
        " left join city_info cs on dprl.route_start_id = cs.id " +
        " left join city_info ci on dprl.route_end_id = ci.id " +
        " left join dp_route_task_loan_rel dplr on dpcr.dp_route_task_id = dplr.dp_route_task_id " +
        " where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.loadTaskCleanRelId){
        paramsArray[i++] = params.loadTaskCleanRelId;
        query = query + " and dpcr.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dplr.dp_route_task_loan_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpcr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dprl.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dpcr.receive_id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and dpcr.status = ? ";
    }
    if(params.statusArr){
        query = query + " and dpcr.status in ("+params.statusArr + ") "
    }
    if(params.cleanDateStart){
        paramsArray[i++] = params.cleanDateStart +" 00:00:00";
        query = query + " and dpcr.clean_date >= ? ";
    }
    if(params.cleanDateEnd){
        paramsArray[i++] = params.cleanDateEnd +" 23:59:59";
        query = query + " and dpcr.clean_date <= ? ";
    }
    query = query + ' group by dpcr.id ';
    query = query + ' order by dpcr.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelMonthStat(params,callback) {
        var query = " select DISTINCT(db.y_month),sum(dpcr.actual_price) as actual_price,count(dpcr.id) as clean_count, " +
            " sum(dpcr.car_count) as car_count from date_base db " +
            " left join dp_route_load_task_clean_rel dpcr on db.id = dpcr.date_id where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelMonthStat ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelReceiveMonthStat(params,callback) {
    var query = " select db.y_month,dpcr.receive_id,r.short_name,sum(dpcr.actual_price) as actual_price from dp_route_load_task_clean_rel dpcr " +
        " left join date_base db on dpcr.date_id = db.id " +
        " left join receive_info r on dpcr.receive_id = r.id where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + '  group by db.y_month,dpcr.receive_id,r.short_name ';
    query = query + ' order by actual_price desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelReceiveMonthStat ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelWeekStat(params,callback) {
    var query = " select db.y_week,sum(dpcr.actual_price) as actual_price from date_base db " +
        " left join dp_route_load_task_clean_rel dpcr on db.id = dpcr.date_id where db.id is not null ";
    var paramsArray=[],i=0;
    query = query + ' group by db.y_week ';
    query = query + ' order by db.y_week desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelWeekStat ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelReceiveWeekStat(params,callback) {
    var query = " select db.y_week,dpcr.receive_id,r.short_name,sum(dpcr.actual_price) as actual_price from dp_route_load_task_clean_rel dpcr " +
        " left join date_base db on dpcr.date_id = db.id " +
        " left join receive_info r on dpcr.receive_id = r.id where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.yWeek){
        paramsArray[i++] = params.yWeek;
        query = query + " and db.y_week = ? ";
    }
    query = query + '  group by db.y_week,dpcr.receive_id,r.short_name ';
    query = query + '  order by actual_price desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelReceiveWeekStat ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskCleanRel(params,callback){
    var query = " update dp_route_load_task_clean_rel set actual_price = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++] = params.actualPrice;
    paramsArray[i] = params.loadTaskCleanRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskCleanRelStatus(params,callback){
    if(params.status==2){
        var query = " update dp_route_load_task_clean_rel set grant_user_id = ? , actual_price = ? , clean_date = ? , date_id = ? , status = ? where id = ? ";
    }else{
        var query = " update dp_route_load_task_clean_rel set grant_user_id = ? , actual_price = ? , status = ? where id = ? ";
    }
    var paramsArray=[],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.actualPrice;
    if(params.cleanDate){
        paramsArray[i++] = params.cleanDate;
        paramsArray[i++] = params.dateId;
    }
    paramsArray[i++] = params.status;
    paramsArray[i] = params.loadTaskCleanRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskCleanRelStatus ');
        return callback(error,rows);
    });
}

function updateCleanRelStatus(params,callback){
    var query = " update dp_route_load_task_clean_rel set grant_user_id = ? , clean_date = ? , date_id = ? , status = ? where dp_route_task_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.userId;
    if(params.cleanDate){
        paramsArray[i++] = params.cleanDate;
        paramsArray[i++] = params.dateId;
    }
    paramsArray[i++] = params.status;
    paramsArray[i] = params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCleanRelStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskCleanRel : addDpRouteLoadTaskCleanRel,
    getDpRouteLoadTaskCleanRel : getDpRouteLoadTaskCleanRel,
    getDpRouteLoadTaskCleanRelMonthStat : getDpRouteLoadTaskCleanRelMonthStat,
    getDpRouteLoadTaskCleanRelReceiveMonthStat : getDpRouteLoadTaskCleanRelReceiveMonthStat,
    getDpRouteLoadTaskCleanRelWeekStat  : getDpRouteLoadTaskCleanRelWeekStat,
    getDpRouteLoadTaskCleanRelReceiveWeekStat : getDpRouteLoadTaskCleanRelReceiveWeekStat,
    updateDpRouteLoadTaskCleanRel : updateDpRouteLoadTaskCleanRel,
    updateDpRouteLoadTaskCleanRelStatus : updateDpRouteLoadTaskCleanRelStatus,
    updateCleanRelStatus : updateCleanRelStatus
}