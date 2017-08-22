/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskSatatDAO.js');

function addDpTaskSatat(params,callback){
    var query = " insert into dp_task_satat (route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,pre_count,date_id) " +
        " values ( ? , ? , ? , ? , ? ,? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.preCount;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpTaskSatat ');
        return callback(error,rows);
    });
}

function getDpTaskSatat(params,callback) {
    var query = " select sum(dpt.pre_count) as pre_count,sum(dpt.plan_count) as plan_count, " +
        " dpt.route_start_id,dpt.route_start,dpt.route_end_id,dpt.route_end,dpt.date_id from dp_task_satat dpt where dpt.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpTaskSatatId){
        paramsArray[i++] = params.dpTaskSatatId;
        query = query + " and dpt.id = ? ";
    }
    query = query + ' group by dpt.route_start_id,dpt.route_start,dpt.route_end_id,dpt.route_end,dpt.date_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskSatat ');
        return callback(error,rows);
    });
}

function getDpTaskSatatBase(params,callback) {
    var query = " select dpt.*,r.short_name from dp_task_satat dpt " +
        " left join receive_info r on dpt.receive_id = r.id where dpt.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpTaskSatatId){
        paramsArray[i++] = params.dpTaskSatatId;
        query = query + " and dpt.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpt.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpt.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dpt.receive_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskSatatBase ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpTaskSatat : addDpTaskSatat,
    getDpTaskSatat : getDpTaskSatat,
    getDpTaskSatatBase : getDpTaskSatatBase
}