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
    deleteDpRouteTaskLoanRel : deleteDpRouteTaskLoanRel,
    deleteDpRouteTaskLoanRelAll : deleteDpRouteTaskLoanRelAll
}