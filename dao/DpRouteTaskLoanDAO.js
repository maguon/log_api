/**
 * Created by zwl on 2018/2/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanDAO.js');

function addDpRouteTaskLoan(params,callback){
    var query = " insert into dp_route_task_loan(drive_id,grant_passing_cost,grant_fuel_cost,grant_protect_cost,grant_penalty_cost," +
        "grant_parking_cost,grant_taxi_cost,grant_explain,grant_user_id,grant_date) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.grantPassingCost;
    paramsArray[i++]=params.grantFuelCost;
    paramsArray[i++]=params.grantProtectCost;
    paramsArray[i++]=params.grantPenaltyCost;
    paramsArray[i++]=params.grantParkingCost;
    paramsArray[i++]=params.grantTaxiCost;
    paramsArray[i++]=params.grantExplain;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.grantDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskLoan ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoan(params,callback) {
    var query = " select dploan.* ,d.drive_name,t.id as truck_id,t.truck_num, " +
        " u2.real_name as grant_user_name,u3.real_name as refund_user_name " +
        " from dp_route_task_loan dploan " +
        " left join drive_info d on dploan.drive_id = d.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join user_info u2 on dploan.grant_user_id = u2.uid " +
        " left join user_info u3 on dploan.refund_user_id = u3.uid " +
        " left join dp_route_task_loan_rel dprel on dploan.id = dprel.dp_route_task_loan_id " +
        " where dploan.task_loan_status >0 and dploan.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dploan.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprel.dp_route_task_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dploan.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and t.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.taskLoanStatusArr){
        query = query + " and dploan.task_loan_status in ("+params.taskLoanStatusArr + ") "
    }
    if(params.taskLoanStatus){
        paramsArray[i++] = params.taskLoanStatus;
        query = query + " and dploan.task_loan_status = ? ";
    }
    if(params.grantDateStart){
        paramsArray[i++] = params.grantDateStart +" 00:00:00";
        query = query + " and dploan.grant_date >= ? ";
    }
    if(params.grantDateEnd){
        paramsArray[i++] = params.grantDateEnd +" 23:59:59";
        query = query + " and dploan.grant_date <= ? ";
    }
    if(params.refundDateStart){
        paramsArray[i++] = params.refundDateStart +" 00:00:00";
        query = query + " and dploan.refund_date >= ? ";
    }
    if(params.refundDateEnd){
        paramsArray[i++] = params.refundDateEnd +" 23:59:59";
        query = query + " and dploan.refund_date <= ? ";
    }
    query = query + ' group by dploan.id,t.id ';
    query = query + " order by dploan.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskLoan ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskLoanGrant(params,callback){
    var query = " update dp_route_task_loan set grant_passing_cost = ? , grant_fuel_cost = ? , grant_protect_cost = ? , grant_penalty_cost = ? , " +
        " grant_parking_cost = ? , grant_taxi_cost = ? , grant_explain = ? , grant_actual_money = ? , grant_user_id = ? , grant_date = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.grantPassingCost;
    paramsArray[i++] = params.grantFuelCost;
    paramsArray[i++] = params.grantProtectCost;
    paramsArray[i++] = params.grantPenaltyCost;
    paramsArray[i++] = params.grantParkingCost;
    paramsArray[i++] = params.grantTaxiCost;
    paramsArray[i++] = params.grantExplain;
    paramsArray[i++] = params.grantActualMoney;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.grantDate;
    paramsArray[i] = params.dpRouteTaskLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskLoanGrant ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskLoanRepayment(params,callback){
    var query = " update dp_route_task_loan set refund_passing_cost = ? , refund_fuel_cost = ? , refund_protect_cost = ? , " +
        "refund_penalty_cost = ? , refund_parking_cost = ? , refund_taxi_cost = ? , repayment_money = ? , refund_actual_money = ? , " +
        " profit = ? , refund_explain = ? , refund_user_id = ? , refund_date = ? , date_id = ?  where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.refundPassingCost;
    paramsArray[i++] = params.refundFuelCost;
    paramsArray[i++] = params.refundProtectCost;
    paramsArray[i++] = params.refundPenaltyCost;
    paramsArray[i++] = params.refundParkingCost;
    paramsArray[i++] = params.refundTaxiCost;
    paramsArray[i++] = params.repaymentMoney;
    paramsArray[i++] = params.refundActualMoney;
    paramsArray[i++] = params.profit;
    paramsArray[i++] = params.refundExplain;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.refundDate;
    paramsArray[i++] = params.dateId;
    paramsArray[i] = params.dpRouteTaskLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskLoanRepayment ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskLoanStatus(params,callback){
    var query = " update dp_route_task_loan set task_loan_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.taskLoanStatus;
    paramsArray[i] = params.dpRouteTaskLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskLoanStatus ');
        return callback(error,rows);
    });
}

function deleteDpRouteTaskLoan(params,callback){
    var query = " delete from dp_route_task_loan where task_loan_status = 1 and id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.dpRouteTaskLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteTaskLoan ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoanCount(params,callback){
    var query = " select count(dploan.id) as task_loan_count,sum(dploan.grant_actual_money) as grant_actual_money " +
        " from dp_route_task_loan dploan " +
        " where dploan.id is not null " ;
    var paramsArray=[],i=0;
    if(params.taskLoanStatus){
        paramsArray[i++] = params.taskLoanStatus;
        query = query + " and dploan.task_loan_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskLoanCount ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoanMonthStat(params,callback){
    var query = " select db.y_month,count(dploan.id) as refund_count, " +
        " sum(dploan.refund_actual_money) as refund_actual_money from date_base db " +
        " left join dp_route_task_loan dploan on db.id = dploan.date_id where db.id is not null " ;
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
        logger.debug(' getDpRouteTaskLoanMonthStat ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoanDayStat(params,callback){
    var query = " select db.id,count(dploan.id) as refund_count, " +
        " sum(dploan.refund_actual_money) as refund_actual_money from date_base db " +
        " left join dp_route_task_loan dploan on db.id = dploan.date_id where db.id is not null " ;
    var paramsArray=[],i=0;
    query = query + ' group by db.id ';
    query = query + ' order by db.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskLoanDayStat ');
        return callback(error,rows);
    });
}

function getDpRouteTaskNotLoan(params,callback) {
    var query = " select dpr.*,c.city_name as city_route_start,ce.city_name as city_route_end, " +
        " d.drive_name,t.truck_num,sum(dprl.plan_count) as plan_count,sum(dprl.real_count) as real_count " +
        "  from dp_route_task dpr " +
        " left join dp_route_task_loan_rel rel on dpr.id = rel.dp_route_task_id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info ce on dpr.route_end_id = ce.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " where rel.dp_route_task_id is null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
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
    if(params.taskStatusArr){
        query = query + " and dpr.task_status not in ("+params.taskStatusArr + ") "
    }
    query = query + ' group by dpr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskNotLoan ');
        return callback(error,rows);
    });
}

function getDpRouteTaskNotLoanCount(params,callback) {
    var query = " select count(dpr.id) as not_loan_count from dp_route_task dpr " +
        " left join dp_route_task_loan_rel rel on dpr.id = rel.dp_route_task_id " +
        " where rel.dp_route_task_id is null ";
    var paramsArray=[],i=0;
    if(params.taskStatusArr){
        query = query + " and dpr.task_status not in ("+params.taskStatusArr + ") "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskNotLoanCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskLoan : addDpRouteTaskLoan,
    getDpRouteTaskLoan : getDpRouteTaskLoan,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus,
    deleteDpRouteTaskLoan : deleteDpRouteTaskLoan,
    getDpRouteTaskLoanCount : getDpRouteTaskLoanCount,
    getDpRouteTaskLoanMonthStat : getDpRouteTaskLoanMonthStat,
    getDpRouteTaskLoanDayStat : getDpRouteTaskLoanDayStat,
    getDpRouteTaskNotLoan : getDpRouteTaskNotLoan,
    getDpRouteTaskNotLoanCount : getDpRouteTaskNotLoanCount
}