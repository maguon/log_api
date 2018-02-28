/**
 * Created by zwl on 2018/2/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanDAO.js');

function getDpRouteTaskLoan(params,callback) {
    var query = " select dploan.*,u1.real_name as appl_user_name,u2.real_name as grant_user_name, " +
        " dpr.drive_id,d.drive_name,dpr.truck_id,t.truck_num,dpr.route_start_id,c1.city_name as route_start_name, " +
        " dpr.route_end_id,c2.city_name as route_end_name,dpr.distance,dpr.task_plan_date from dp_route_task_loan dploan " +
        " left join dp_route_task dpr on dploan.dp_route_task_id = dpr.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join city_info c1 on dpr.route_start_id = c1.id " +
        " left join city_info c2 on dpr.route_end_id = c2.id " +
        " left join user_info u1 on dploan.apply_user_id = u1.uid " +
        " left join user_info u2 on dploan.grant_user_id = u2.uid " +
        " where dploan.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dploan.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dploan.dp_route_task_id = ? ";
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
    var query = " update dp_route_task_loan set passing_cost = ? , fuel_cost = ? , protect_cost = ? , penalty_cost = ? , parking_cost = ? , taxi_cost = ? , " +
        " plan_money = ? , actual_money = ? , grant_user_id = ? , grant_date = ? , grant_explain = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.passingCost;
    paramsArray[i++] = params.fuelCost;
    paramsArray[i++] = params.protectCost;
    paramsArray[i++] = params.penaltyCost;
    paramsArray[i++] = params.parkingCost;
    paramsArray[i++] = params.taxiCost;
    paramsArray[i++] = params.planMoney;
    paramsArray[i++] = params.actualMoney;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.grantDate;
    paramsArray[i++] = params.grantExplain;
    paramsArray[i] = params.dpRouteTaskLoanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskLoanGrant ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskLoanRepayment(params,callback){
    var query = " update dp_route_task_loan set repayment_money = ? , refund_money = ? , refund_user_id = ? , refund_date = ? , refund_explain = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.repaymentMoney;
    paramsArray[i++] = params.refundMoney;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.refundDate;
    paramsArray[i++] = params.refundExplain;
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


module.exports ={
    getDpRouteTaskLoan : getDpRouteTaskLoan,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus
}