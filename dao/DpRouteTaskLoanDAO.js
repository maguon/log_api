/**
 * Created by zwl on 2018/2/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanDAO.js');

function addDpRouteTaskLoan(params,callback){
    var query = " insert into dp_route_task_loan(drive_id,apply_passing_cost,apply_fuel_cost,apply_protect_cost,apply_penalty_cost," +
        "apply_parking_cost,apply_taxi_cost,apply_explain,apply_plan_money,apply_user_id,apply_date) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.applyPassingCost;
    paramsArray[i++]=params.applyFuelCost;
    paramsArray[i++]=params.applyProtectCost;
    paramsArray[i++]=params.applyPenaltyCost;
    paramsArray[i++]=params.applyParkingCost;
    paramsArray[i++]=params.applyTaxiCost;
    paramsArray[i++]=params.applyExplain;
    paramsArray[i++]=params.applyPlanMoney;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.applyDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskLoan ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoan(params,callback) {
    var query = " select dploan.* ,d.drive_name,t.id as truck_id,t.truck_num,u1.real_name as appl_user_name, " +
        " u2.real_name as grant_user_name,u3.real_name as refund_user_name from dp_route_task_loan dploan " +
        " left join drive_info d on dploan.drive_id = d.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join user_info u1 on dploan.apply_user_id = u1.uid " +
        " left join user_info u2 on dploan.grant_user_id = u2.uid " +
        " left join user_info u3 on dploan.refund_user_id = u3.uid " +
        " left join dp_route_task_loan_rel dprel on dploan.id = dprel.dp_route_task_loan_id " +
        " where dploan.id is not null ";
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
    if(params.taskLoanStatus){
        paramsArray[i++] = params.taskLoanStatus;
        query = query + " and dploan.task_loan_status = ? ";
    }
    if(params.applyDateStart){
        paramsArray[i++] = params.applyDateStart +" 00:00:00";
        query = query + " and dploan.apply_date >= ? ";
    }
    if(params.applyDateEnd){
        paramsArray[i++] = params.applyDateEnd +" 23:59:59";
        query = query + " and dploan.apply_date <= ? ";
    }
    if(params.applyPlanMoneyStart){
        paramsArray[i++] = params.applyPlanMoneyStart;
        query = query + " and dploan.apply_plan_money >= ? ";
    }
    if(params.applyPlanMoneyEnd){
        paramsArray[i++] = params.applyPlanMoneyEnd;
        query = query + " and dploan.apply_plan_money <= ? ";
    }
    if(params.applyUserId){
        paramsArray[i++] = params.applyUserId;
        query = query + " and dploan.apply_user_id = ? ";
    }
    if(params.applyUserName){
        paramsArray[i++] = params.applyUserName;
        query = query + " and u1.real_name = ? ";
    }
    if(params.grantDateStart){
        paramsArray[i++] = params.grantDateStart +" 00:00:00";
        query = query + " and dploan.grant_date >= ? ";
    }
    if(params.grantDateEnd){
        paramsArray[i++] = params.grantDateEnd +" 23:59:59";
        query = query + " and dploan.grant_date <= ? ";
    }
    query = query + ' group by dploan.id,t.id ';
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
    addDpRouteTaskLoan : addDpRouteTaskLoan,
    getDpRouteTaskLoan : getDpRouteTaskLoan,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus
}