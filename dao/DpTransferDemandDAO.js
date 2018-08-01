/**
 * Created by zwl on 2018/7/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTransferDemandDAO.js');

function addDpTransferDemand(params,callback){
    var query = " insert into dp_transfer_demand_info (demand_id,route_start_id,base_addr_id,transfer_city_id,transfer_addr_id,route_end_id, " +
        " receive_id,pre_count,transfer_count,date_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.demandId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.preCount;
    paramsArray[i++]=params.transferCount;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpTransferDemand ');
        return callback(error,rows);
    });
}

function getDpTransferDemand(params,callback) {
    var query = " select dptd.*,c1.city_name as route_start_name,ba.addr_name, " +
        " c3.city_name as transfer_city_name,ba1.addr_name as transfer_addr_name, " +
        " c2.city_name as route_end_name,r.short_name, " +
        " dpd.route_start as demand_route_start,ba2.addr_name as demand_addr_name " +
        " from dp_transfer_demand_info dptd " +
        " left join city_info c1 on dptd.route_start_id = c1.id " +
        " left join city_info c2 on dptd.route_end_id = c2.id " +
        " left join city_info c3 on dptd.transfer_city_id = c3.id " +
        " left join base_addr ba on dptd.base_addr_id = ba.id " +
        " left join base_addr ba1 on dptd.transfer_addr_id = ba1.id " +
        " left join receive_info r on dptd.receive_id = r.id " +
        " left join dp_demand_info dpd on dptd.demand_id = dpd.id " +
        " left join base_addr ba2 on dpd.base_addr_id = ba2.id " +
        " where dptd.id is not null ";
    var paramsArray=[],i=0;
    if(params.transferDemandId){
        paramsArray[i++] = params.transferDemandId;
        query = query + " and dptd.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dptd.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dptd.base_addr_id = ? ";
    }
    if(params.transferCityId){
        paramsArray[i++] = params.transferCityId;
        query = query + " and dptd.transfer_city_id = ? ";
    }
    if(params.transferAddrId){
        paramsArray[i++] = params.transferAddrId;
        query = query + " and dptd.transfer_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dptd.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dptd.receive_id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and dptd.date_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dptd.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dptd.date_id <= ? ";
    }
    if(params.transferStatus){
        paramsArray[i++] = params.transferStatus;
        query = query + " and dptd.transfer_status = ? ";
    }
    query = query + ' order by dptd.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTransferDemand ');
        return callback(error,rows);
    });
}

function getDpTransferDemandStat(params,callback) {
    var query = " select sum(dptd.pre_count) as pre_count,sum(dptd.arrive_count) as arrive_count," +
        "sum(dptd.transfer_count) as transfer_count,sum(dptd.plan_count) as plan_count, " +
        " dptd.route_start_id,c2.city_name as route_start_name, " +
        " dptd.transfer_city_id,c.city_name as transfer_city_name, " +
        " dptd.route_end_id,c1.city_name as route_end_name,dptd.date_id " +
        " from dp_transfer_demand_info dptd " +
        " left join city_info c2 on dptd.route_start_id = c2.id " +
        " left join city_info c on dptd.transfer_city_id = c.id " +
        " left join city_info c1 on dptd.route_end_id = c1.id " +
        " where dptd.id is not null ";
    var paramsArray=[],i=0;
    if(params.transferStatus){
        paramsArray[i++] = params.transferStatus;
        query = query + " and dptd.transfer_status = ? ";
    }
    query = query + ' group by dptd.route_start_id,dptd.transfer_city_id,c.city_name,dptd.route_end_id,c1.city_name,dptd.date_id ';
    query = query + ' order by dptd.date_id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpTransferDemandStat ');
        return callback(error,rows);
    });
}

function updateDpTransferDemandPreCount(params,callback){
    var query = " update dp_transfer_demand_info set pre_count = pre_count + ? , transfer_count = transfer_count + ? " +
        " where route_start_id = ? and base_addr_id = ? and transfer_city_id = ? and transfer_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.preCount;
    paramsArray[i++]=params.transferCount;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTransferDemandPreCount ');
        return callback(error,rows);
    });
}

function updateDpTransferDemandArriveCount(params,callback){
    var query = " update dp_transfer_demand_info set transfer_count = transfer_count - ? , arrive_count = arrive_count + ? " +
        " where route_start_id = ? and base_addr_id = ? and transfer_city_id = ? and transfer_addr_id = ? and route_end_id = ? and receive_id = ? and date_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.transferCount;
    paramsArray[i++]=params.arriveCount;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpTransferDemandArriveCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpTransferDemand : addDpTransferDemand,
    getDpTransferDemand : getDpTransferDemand,
    getDpTransferDemandStat : getDpTransferDemandStat,
    updateDpTransferDemandPreCount : updateDpTransferDemandPreCount,
    updateDpTransferDemandArriveCount : updateDpTransferDemandArriveCount
}
