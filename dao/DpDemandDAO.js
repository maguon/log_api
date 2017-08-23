/**
 * Created by zwl on 2017/8/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpDemandDAO.js');

function addDpDemand(params,callback){
    var query = " insert into dp_demand_info (user_id,route_start_id,route_start,base_addr_id,route_end_id,route_end, " +
        " receive_id,pre_count,demand_date,date_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.preCount;
    paramsArray[i++]=params.demandDate;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpDemand ');
        return callback(error,rows);
    });
}

function getDpDemand(params,callback) {
    var query = " select dpd.*,u.real_name,ba.addr_name,r.short_name from dp_demand_info dpd " +
        " left join user_info u on dpd.user_id = u.uid " +
        " left join base_addr ba on dpd.base_addr_id = ba.id " +
        " left join receive_info r on dpd.receive_id = r.id where dpd.id is not null ";
    var paramsArray=[],i=0;
    if(params.demandDateStart){
        paramsArray[i++] = params.demandDateStart +" 00:00:00";
        query = query + " and dpd.demand_date >= ? ";
    }
    if(params.demandDateEnd){
        paramsArray[i++] = params.demandDateEnd +" 23:59:59";
        query = query + " and dpd.demand_date <= ? ";
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


module.exports ={
    addDpDemand : addDpDemand,
    getDpDemand : getDpDemand
}
