/**
 * Created by zwl on 2018/1/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRelDAO.js');

function addDpRouteLoadTaskCleanRel(params,callback){
    var query = " insert into dp_route_load_task_clean_rel (dp_route_task_id,dp_route_load_task_id," +
        " drive_id,truck_id,receive_id,small_single_price,big_single_price,small_car_count,big_car_count," +
        " trailer_fee,total_trailer_fee,actual_trailer_fee,car_parking_fee,run_fee,total_run_fee,actual_run_fee," +
        " lead_fee,actual_lead_fee,month_flag,total_price,actual_price,car_count,type,create_user_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.smallSinglePrice;
    paramsArray[i++]=params.bigSinglePrice;
    paramsArray[i++]=params.smallCarCount;
    paramsArray[i++]=params.bigCarCount;
    paramsArray[i++]=params.trailerFee;
    paramsArray[i++]=params.totalTrailerFee;
    paramsArray[i++]=params.actualTrailerFee;
    paramsArray[i++]=params.carParkingFee;
    paramsArray[i++]=params.runFee;
    paramsArray[i++]=params.totalRunFee;
    paramsArray[i++]=params.actualRunFee;
    paramsArray[i++]=params.leadFee;
    paramsArray[i++]=params.actualLeadFee;
    paramsArray[i++]=params.monthFlag;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.carCount;
    paramsArray[i++]=params.type;
    // 2019-11-14 表结构新加字段【create_user_id】对应
    paramsArray[i++] = params.type == 0 ? 0 : params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}

function addDpRouteLoadTaskCleanRelUnique(params,callback){
    var query = " insert into dp_route_load_task_clean_rel (dp_route_task_id,dp_route_load_task_id," +
        " drive_id,truck_id,receive_id,small_single_price,big_single_price,small_car_count,big_car_count," +
        " trailer_fee,total_trailer_fee,actual_trailer_fee,car_parking_fee,run_fee,total_run_fee,actual_run_fee," +
        " lead_fee,actual_lead_fee,month_flag,total_price,actual_price,car_count,type,create_user_id,remark) " +
        " SELECT ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? " +
        " from DUAL " +
        " where not exists(select id from dp_route_load_task_clean_rel where dp_route_load_task_id = ? and create_user_id = 0 ); " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.smallSinglePrice;
    paramsArray[i++]=params.bigSinglePrice;
    paramsArray[i++]=params.smallCarCount;
    paramsArray[i++]=params.bigCarCount;
    paramsArray[i++]=params.trailerFee;
    paramsArray[i++]=params.totalTrailerFee;
    paramsArray[i++]=params.actualTrailerFee;
    paramsArray[i++]=params.carParkingFee;
    paramsArray[i++]=params.runFee;
    paramsArray[i++]=params.totalRunFee;
    paramsArray[i++]=params.actualRunFee;
    paramsArray[i++]=params.leadFee;
    paramsArray[i++]=params.actualLeadFee;
    paramsArray[i++]=params.monthFlag;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.carCount;
    paramsArray[i++]=params.type;
    // 2019-11-14 表结构新加字段【create_user_id】对应
    paramsArray[i++] = params.type == 0 ? 0 : params.userId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.dpRouteLoadTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskCleanRelUnique ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRel(params,callback) {
    var query = " select dpcr.*,d.drive_name,d.bank_number,d.bank_name,d.bank_user_name,u3.mobile,t.truck_num,u.real_name as field_op_name,dprl.load_date, " +
        " dprl.route_start as route_start_name,ba.addr_name,dprl.route_end as route_end_name,c.company_name, " +
        " r.short_name,r.make_name,u1.real_name as grant_user_name,u2.real_name as drive_user_name " +
        " from dp_route_load_task_clean_rel dpcr " +
        " left join drive_info d on dpcr.drive_id = d.id " +
        " left join truck_info t on dpcr.truck_id = t.id " +
        " left join company_info c on c.id = t.company_id " +
        " left join receive_info r on dpcr.receive_id = r.id " +
        " left join dp_route_load_task dprl on dpcr.dp_route_load_task_id = dprl.id " +
        " left join user_info u on dprl.field_op_id = u.uid " +
        " left join user_info u1 on dpcr.grant_user_id = u1.uid " +
        " left join user_info u2 on dpcr.drive_user_id = u2.uid " +
        " left join user_info u3 on d.user_id = u3.uid " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
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
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpcr.dp_route_load_task_id = ? ";
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
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpcr.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
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
    if(params.loadDateStart){
        paramsArray[i++] = params.loadDateStart +" 00:00:00";
        query = query + " and dprl.load_date >= ? ";
    }
    if(params.loadDateEnd){
        paramsArray[i++] = params.loadDateEnd +" 23:59:59";
        query = query + " and dprl.load_date <= ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and dpcr.type = ? ";
    }
    if(params.monthFlag){
        paramsArray[i++] = params.monthFlag;
        query = query + " and dpcr.month_flag = ? ";
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

function getDpRouteLoadTaskCleanRelBase(params,callback) {
    var query = " select dpcr.* " +
        " from dp_route_load_task_clean_rel dpcr " +
        " where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.loadTaskCleanRelId){
        paramsArray[i++] = params.loadTaskCleanRelId;
        query = query + " and dpcr.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpcr.dp_route_task_id = ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpcr.dp_route_load_task_id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and dpcr.status = ? ";
    }
    query = query + ' group by dpcr.id ';
    query = query + ' order by dpcr.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelBase ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelCount(params,callback) {
    var query = " select sum(dpcr.car_count) as car_count ,sum(dpcr.total_price) as total_clean_fee,sum(dpcr.total_trailer_fee) as total_trailer_fee, " +
        " sum(dpcr.car_parking_fee) as car_parking_fee,sum(dpcr.total_run_fee) as total_run_fee,sum(dpcr.lead_fee) as lead_fee " +
        " from dp_route_load_task_clean_rel dpcr " +
        " left join dp_route_load_task dprl on dpcr.dp_route_load_task_id = dprl.id " +
        " left join truck_info t on dpcr.truck_id = t.id " +
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
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpcr.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpcr.truck_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
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
    if(params.loadDateStart){
        paramsArray[i++] = params.loadDateStart +" 00:00:00";
        query = query + " and dprl.load_date >= ? ";
    }
    if(params.loadDateEnd){
        paramsArray[i++] = params.loadDateEnd +" 23:59:59";
        query = query + " and dprl.load_date <= ? ";
    }
    if(params.monthFlag){
        paramsArray[i++] = params.monthFlag;
        query = query + " and dpcr.month_flag = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRelCount ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskCleanRelMonthStat(params,callback) {
    var query = " select DISTINCT(db.y_month), " ;
    var paramsArray=[],i=0;
    if(params.makeId){
        query = query + " sum(case when r.make_id = "+params.makeId+" then dpcr.total_price end) as total_price, " +
            " count(case when r.make_id = "+params.makeId+" then dpcr.id end) as clean_count, " +
            " sum(case when r.make_id = "+params.makeId+" then dpcr.car_count end) as car_count ";
    }else{
        query = query + " sum(dpcr.total_price) as total_price, " +
            " count(dpcr.id) as clean_count, " +
            " sum(dpcr.car_count) as car_count ";
    }
    query = query + " from date_base db " +
        " left join dp_route_load_task_clean_rel dpcr on db.id = dpcr.date_id "+
        " left join receive_info r on dpcr.receive_id = r.id " +
        " where db.id is not null ";

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
    var query = " select dpcr.receive_id,r.short_name,sum(dpcr.total_price) as total_price from dp_route_load_task_clean_rel dpcr " +
        " left join date_base db on dpcr.date_id = db.id " +
        " left join receive_info r on dpcr.receive_id = r.id where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and r.make_id = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by dpcr.receive_id,r.short_name ';
    query = query + ' order by total_price desc ';
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
    var query = " select db.y_week, ";
    var paramsArray=[],i=0;
    if(params.makeId){
        query = query + " sum(case when r.make_id = "+params.makeId+" then dpcr.total_price end) as total_price ";
    }else{
        query = query + " sum(dpcr.total_price) as total_price ";
    }
    query = query + " from date_base db " +
        " left join dp_route_load_task_clean_rel dpcr on db.id = dpcr.date_id " +
        " left join receive_info r on dpcr.receive_id = r.id " +
        " where db.id is not null ";
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
    var query = " select dpcr.receive_id,r.short_name,sum(dpcr.total_price) as total_price from dp_route_load_task_clean_rel dpcr " +
        " left join date_base db on dpcr.date_id = db.id " +
        " left join receive_info r on dpcr.receive_id = r.id where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and r.make_id = ? ";
    }
    if(params.yWeek){
        paramsArray[i++] = params.yWeek;
        query = query + " and db.y_week = ? ";
    }
    query = query + '  group by dpcr.receive_id,r.short_name ';
    query = query + '  order by total_price desc ';
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
    var query = " update dp_route_load_task_clean_rel set actual_price = ? , actual_guard_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++] = params.actualPrice;
    paramsArray[i++] = params.actualGuardFee;
    paramsArray[i] = params.loadTaskCleanRelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskCleanRelStatus(params,callback){
    if(params.status==2){
        var query = " update dp_route_load_task_clean_rel set grant_user_id = ? , clean_date = ? , date_id = ? , status = ? where id = ? ";
    }else{
        var query = " update dp_route_load_task_clean_rel set grant_user_id = ? , status = ? where id = ? ";
    }
    var paramsArray=[],i=0;
    paramsArray[i++] = params.userId;
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

function deleteDpRouteLoadTaskCleanRel(params,callback){    //装车回退删除洗车费
    var query = " delete from dp_route_load_task_clean_rel where id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dp_route_load_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskCleanRel : addDpRouteLoadTaskCleanRel,
    addDpRouteLoadTaskCleanRelUnique : addDpRouteLoadTaskCleanRelUnique,
    getDpRouteLoadTaskCleanRel : getDpRouteLoadTaskCleanRel,
    getDpRouteLoadTaskCleanRelBase : getDpRouteLoadTaskCleanRelBase,
    getDpRouteLoadTaskCleanRelCount : getDpRouteLoadTaskCleanRelCount,
    getDpRouteLoadTaskCleanRelMonthStat : getDpRouteLoadTaskCleanRelMonthStat,
    getDpRouteLoadTaskCleanRelReceiveMonthStat : getDpRouteLoadTaskCleanRelReceiveMonthStat,
    getDpRouteLoadTaskCleanRelWeekStat  : getDpRouteLoadTaskCleanRelWeekStat,
    getDpRouteLoadTaskCleanRelReceiveWeekStat : getDpRouteLoadTaskCleanRelReceiveWeekStat,
    updateDpRouteLoadTaskCleanRel : updateDpRouteLoadTaskCleanRel,
    updateDpRouteLoadTaskCleanRelStatus : updateDpRouteLoadTaskCleanRelStatus,
    updateCleanRelStatus : updateCleanRelStatus,
    deleteDpRouteLoadTaskCleanRel : deleteDpRouteLoadTaskCleanRel
}