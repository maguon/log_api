/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskStatDAO.js');

function addDpTaskStat(params,callback){
    var query = " insert into dp_task_stat (route_start_id,base_addr_id,route_end_id,receive_id,pre_count,date_id) " +
        " values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.preCount;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpTaskStat ');
        return callback(error,rows);
    });
}

function getDpTaskStat(params,callback) {
    var query = " select sum(dpt.pre_count) as pre_count,sum(dpt.plan_count) as plan_count,sum(dpt.transfer_count) as transfer_count, " +
        " dpt.route_start_id,dpt.route_start as city_route_start,dpt.route_end_id,dpt.route_end as city_route_end,dpt.date_id from dp_task_stat dpt " +
        " where dpt.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpTaskStatId){
        paramsArray[i++] = params.dpTaskStatId;
        query = query + " and dpt.id = ? ";
    }
    if(params.dpTaskStatStatus){
        paramsArray[i++] = params.dpTaskStatStatus;
        query = query + " and dpt.task_stat_status = ? ";
    }
    query = query + ' group by dpt.route_start_id,dpt.route_start,dpt.route_end_id,dpt.route_end,dpt.date_id ';
    query = query + ' order by dpt.date_id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskStat ');
        return callback(error,rows);
    });
}

function getDpTaskStatBase(params,callback) {
    var query = " select dpt.*,dpt.route_start as city_route_start,dpt.route_end as city_route_end,r.short_name " +
        " from dp_task_stat dpt " +
        " left join receive_info r on dpt.receive_id = r.id" +
        " where dpt.pre_count > 0 and dpt.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpTaskStatId){
        paramsArray[i++] = params.dpTaskStatId;
        query = query + " and dpt.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpt.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dpt.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpt.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dpt.receive_id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and dpt.date_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskStatBase ');
        return callback(error,rows);
    });
}

function getDpTaskStatCount(params,callback) {
    var query = " select sum(pre_count) as pre_count,sum(plan_count) as plan_count from dp_task_stat " +
        " where id is not null and task_stat_status = 1 ";
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTaskStatCount ');
        return callback(error,rows);
    });
}

function updateDpTaskStatStatus(params,callback){
    var query = " update dp_task_stat set task_stat_status = ? where route_start_id = ? and route_end_id = ? and date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.taskStatStatus;
    paramsArray[i++] = params.routeStartId;
    paramsArray[i++] = params.routeEndId;
    paramsArray[i] = params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTaskStatStatus ');
        return callback(error,rows);
    });
}

function updateDpTaskStatPreCountMinus(params,callback){
    var query = " update dp_task_stat set pre_count = pre_count - 1 " +
        " where route_start_id = ? and base_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTaskStatPreCountMinus ');
        return callback(error,rows);
    });
}

function updateDpTaskStatPreCountPlus(params,callback){
    var query = " update dp_task_stat set pre_count = pre_count + 1 " +
        " where route_start_id = ? and base_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTaskStatPreCountPlus ');
        return callback(error,rows);
    });
}

function updateDpTaskStatPlanCountMinus(params,callback){
    var query = " update dp_task_stat set plan_count = "+params.planCount+" - ("+params.realCount+"-plan_count) " +
        " where route_start_id = ? and base_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTaskStatPlanCountMinus ');
        return callback(error,rows);
    });
}

function updateDpTaskStatTransferCountMinus(params,callback){
    var query = " update dp_task_stat set transfer_count = "+params.planCount+" - ("+params.realCount+"-plan_count) " +
        " where route_start_id = ? and base_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTaskStatTransferCountMinus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpTaskStat : addDpTaskStat,
    getDpTaskStat : getDpTaskStat,
    getDpTaskStatBase : getDpTaskStatBase,
    getDpTaskStatCount : getDpTaskStatCount,
    updateDpTaskStatStatus : updateDpTaskStatStatus,
    updateDpTaskStatPreCountMinus : updateDpTaskStatPreCountMinus,
    updateDpTaskStatPreCountPlus : updateDpTaskStatPreCountPlus,
    updateDpTaskStatPlanCountMinus : updateDpTaskStatPlanCountMinus,
    updateDpTaskStatTransferCountMinus : updateDpTaskStatTransferCountMinus
}