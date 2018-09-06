/**
 * Created by zwl on 2017/8/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpDemandDAO.js');

function addDpDemand(params,callback){
    var query = " insert into dp_demand_info (user_id,route_id,route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end, " +
        " receive_id,short_name,pre_count,date_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    if(params.routeStartId>params.routeEndId){
        paramsArray[i++] = params.routeEndId+''+params.routeStartId;
    }else{
        paramsArray[i++] = params.routeStartId+''+params.routeEndId;
    }
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.addrName;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.preCount;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpDemand ');
        return callback(error,rows);
    });
}

function getDpDemand(params,callback) {
    var query = " select dpd.*,u.real_name as demand_op_name from dp_demand_info dpd " +
        " left join user_info u on dpd.user_id = u.uid " +
        " where dpd.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpDemandId){
        paramsArray[i++] = params.dpDemandId;
        query = query + " and dpd.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and dpd.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and dpd.created_on <= ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpd.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpd.date_id <= ? ";
    }
    if(params.realName){
        paramsArray[i++] = params.realName;
        query = query + " and u.real_name = ? ";
    }
    if(params.preCountStart){
        paramsArray[i++] = params.preCountStart;
        query = query + " and dpd.pre_count >= ? ";
    }
    if(params.preCountEnd){
        paramsArray[i++] = params.preCountEnd;
        query = query + " and dpd.pre_count <= ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpd.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dpd.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpd.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dpd.receive_id = ? ";
    }
    if(params.demandStatus){
        paramsArray[i++] = params.demandStatus;
        query = query + " and dpd.demand_status = ? ";
    }
    query = query + ' order by dpd.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpDemand ');
        return callback(error,rows);
    });
}

function getDpDemandBase(params,callback) {
    var query = " select dpd.*,u.real_name as demand_op_name from dp_demand_info dpd " +
        " left join user_info u on dpd.user_id = u.uid " +
        " where dpd.demand_status >0 and dpd.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpDemandId){
        paramsArray[i++] = params.dpDemandId;
        query = query + " and dpd.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpd.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dpd.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpd.route_end_id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and dpd.date_id = ? ";
    }
    if(params.demandStatus){
        paramsArray[i++] = params.demandStatus;
        query = query + " and dpd.demand_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpDemandBase ');
        return callback(error,rows);
    });
}

function updateDpDemandPlanCount(params,callback){
    if(params.loadTaskStatus==8){
        var query = " update dp_demand_info set plan_count = plan_count - ? where id = ? ";
    }else{
        var query = " update dp_demand_info set plan_count = plan_count + ? where id = ? ";
    }
    var paramsArray=[],i=0;
    paramsArray[i++] = params.planCount;
    paramsArray[i] = params.dpDemandId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpDemandPlanCount ');
        return callback(error,rows);
    });
}

function updateDpDemandStatus(params,callback){
    var query = " update dp_demand_info set demand_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.demandStatus;
    paramsArray[i] = params.dpDemandId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpDemandStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpDemand : addDpDemand,
    getDpDemand : getDpDemand,
    getDpDemandBase : getDpDemandBase,
    updateDpDemandPlanCount : updateDpDemandPlanCount,
    updateDpDemandStatus : updateDpDemandStatus
}
