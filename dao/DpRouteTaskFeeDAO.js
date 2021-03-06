/**
 * Created by zwl on 2019/5/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskFeeDAO.js');

function addDpRouteTaskFee(params,callback){
    var query = " insert into dp_route_task_fee (drive_id,drive_name,truck_id,truck_num,dp_route_task_id," +
        " day_count,single_price,total_price,car_day_count,car_single_price,car_total_price,car_oil_fee," +
        " other_fee,remark, create_user_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i++]=params.carDayCount;
    paramsArray[i++]=params.carSinglePrice;
    paramsArray[i++]=params.carTotalPrice;
    paramsArray[i++]=params.carOilFee;
    paramsArray[i++]=params.otherFee;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function getDpRouteTaskFee(params,callback) {
    var query = " select dprtf.*,d.bank_number,d.bank_name,d.bank_user_name,dpr.route_start,dpr.route_end  " +
        " from dp_route_task_fee dprtf " +
        " left join drive_info d on dprtf.drive_id = d.id " +
        " left join dp_route_task dpr on dprtf.dp_route_task_id = dpr.id " +
        " where dprtf.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskFeeId){
        paramsArray[i++] = params.dpRouteTaskFeeId;
        query = query + " and dprtf.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprtf.dp_route_task_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dprtf.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dprtf.truck_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and dprtf.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and dprtf.created_on <= ? ";
    }
    if(params.grantDateStart){
        paramsArray[i++] = params.grantDateStart +" 00:00:00";
        query = query + " and dprtf.grant_date >= ? ";
    }
    if(params.grantDateEnd){
        paramsArray[i++] = params.grantDateEnd +" 23:59:59";
        query = query + " and dprtf.grant_date <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and dprtf.status = ? ";
    }
    query = query + ' order by dprtf.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function getDpRouteTaskFeeCount(params,callback) {
    var query = " select sum(total_price) as truck_parking_fee,sum(car_oil_fee) as car_oil_fee, " +
        " sum(car_total_price) as car_total_price,sum(other_fee) as other_fee " +
        " from dp_route_task_fee where id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and created_on <= ? ";
    }
    if(params.grantDateStart){
        paramsArray[i++] = params.grantDateStart +" 00:00:00";
        query = query + " and grant_date >= ? ";
    }
    if(params.grantDateEnd){
        paramsArray[i++] = params.grantDateEnd +" 23:59:59";
        query = query + " and grant_date <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskFeeCount ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskFee(params,callback){
    var query = " update dp_route_task_fee set day_count = ? , single_price = ? , total_price = ? , " +
        " car_day_count = ? , car_single_price = ? , car_total_price = ? , car_oil_fee = ? , " +
        " other_fee = ? , remark = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i++]=params.carDayCount;
    paramsArray[i++]=params.carSinglePrice;
    paramsArray[i++]=params.carTotalPrice;
    paramsArray[i++]=params.carOilFee;
    paramsArray[i++]=params.otherFee;
    paramsArray[i++]=params.remark;
    paramsArray[i++] = params.dpRouteTaskFeeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskFee ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskFeeStatus(params,callback){
    if(params.status==2){
        var query = " update dp_route_task_fee set status = ? , grant_user_id = ? , grant_date = ? , date_id = ? where id = ? ";
    }else{
        var query = " update dp_route_task_fee set status = ? , grant_user_id = ? where id = ? ";
    }
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    if(params.status==2){
        paramsArray[i++] = params.grantDate;
        paramsArray[i++] = params.dateId;
    }
    paramsArray[i] = params.dpRouteTaskFeeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskFeeStatus ');
        return callback(error,rows);
    });
}

function getDpRouteTaskFeeMonthStat(params,callback){
    var query = " select db.y_month, " +
        " count(case when dprtf.status = "+params.status+" then dprtf.id end) refund_count, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.total_price end)total_price, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.car_total_price end)car_total_price, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.car_oil_fee end)car_oil_fee, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.other_fee end)other_fee " +
        " from date_base db " +
        " left join dp_route_task_fee dprtf on db.id = dprtf.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
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
        logger.debug(' getDpRouteTaskFeeMonthStat ');
        return callback(error,rows);
    });
}

function getDpRouteTaskFeeDayStat(params,callback){
    var query = " select db.id, " +
        " count(case when dprtf.status = "+params.status+" then dprtf.id end) refund_count, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.total_price end)total_price, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.car_total_price end)car_total_price, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.car_oil_fee end)car_oil_fee, " +
        " sum(case when dprtf.status = "+params.status+" then dprtf.other_fee end)other_fee " +
        " from date_base db " +
        " left join dp_route_task_fee dprtf on db.id = dprtf.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    query = query + ' group by db.id ';
    query = query + ' order by db.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskFeeDayStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskFee : addDpRouteTaskFee,
    getDpRouteTaskFee : getDpRouteTaskFee,
    getDpRouteTaskFeeCount : getDpRouteTaskFeeCount,
    updateDpRouteTaskFee : updateDpRouteTaskFee,
    updateDpRouteTaskFeeStatus : updateDpRouteTaskFeeStatus,
    getDpRouteTaskFeeMonthStat : getDpRouteTaskFeeMonthStat,
    getDpRouteTaskFeeDayStat : getDpRouteTaskFeeDayStat
}