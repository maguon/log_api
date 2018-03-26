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
        " where dprel.dp_route_task_loan_id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskLoanId){
        paramsArray[i++] = params.dpRouteTaskLoanId;
        query = query + " and dprel.dp_route_task_loan_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    query = query + ' group by dprel.dp_route_task_id,dprel.dp_route_task_loan_id ';
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
    var query = " delete from dp_route_task_loan_rel where dp_route_task_loan_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskLoanId;
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