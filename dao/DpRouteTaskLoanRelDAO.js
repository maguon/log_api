/**
 * Created by zwl on 2018/3/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanRelDAO.js');

function addDpRouteTaskLoanRel(params,callback){
    var query = " insert into dp_route_task_loan_rel (dp_route_task_loan_id,dp_route_task_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskLoanId;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskLoanRel ');
        return callback(error,rows);
    });
}

function getDpRouteTaskLoanRel(params,callback) {
    var query = " select dprel.*,c.city_name as city_route_start,ce.city_name as city_route_end,dpr.distance, " +
        " sum(dprl.plan_count) as plan_count,dpr.task_plan_date,dpr.task_status from dp_route_task_loan_rel dprel " +
        "  left join dp_route_task dpr on dprel.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info ce on dpr.route_end_id = ce.id " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " left join dp_route_task_loan dploan on dprel.dp_route_task_loan_id = dploan.id " +
        " left join drive_info d on dploan.drive_id = d.id " +
        " left join truck_info t on d.id = t.drive_id " +
        " where dprel.dp_route_task_loan_id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dprel.dp_route_task_loan_id = ? ";
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
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
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
    if(params.taskLoanStatusArr){
        query = query + " and dploan.task_loan_status in ("+params.taskLoanStatusArr + ") "
    }
    if(params.taskLoanStatus){
        paramsArray[i++] = params.taskLoanStatus;
        query = query + " and dploan.task_loan_status = ? ";
    }
    query = query + ' group by dprel.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskLoanRel ');
        return callback(error,rows);
    });
}

function deleteDpRouteTaskLoanRel(params,callback){
    var query = " delete from dp_route_task_loan_rel where dp_route_task_loan_id = ? and dp_route_task_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskLoanId;
    paramsArray[i]=params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteTaskLoanRel ');
        return callback(error,rows);
    });
}

function deleteDpRouteTaskLoanRelAll(params,callback){
    var query = " delete from dp_route_task_loan_rel where dp_route_task_loan_id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dp_route_task_loan_id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dp_route_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteTaskLoanRelAll ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskLoanRel : addDpRouteTaskLoanRel,
    getDpRouteTaskLoanRel : getDpRouteTaskLoanRel,
    deleteDpRouteTaskLoanRel : deleteDpRouteTaskLoanRel,
    deleteDpRouteTaskLoanRelAll : deleteDpRouteTaskLoanRelAll
}