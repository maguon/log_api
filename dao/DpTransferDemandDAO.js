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
    var query = " select dptd.*,c1.city_name as route_start_name,ba.addr_name,c2.city_name as route_end_name,r.short_name" +
        " from dp_transfer_demand_info dptd" +
        " left join city_info c1 on dptd.route_start_id = c1.id " +
        " left join city_info c2 on dptd.route_end_id = c2.id " +
        " left join base_addr ba on dptd.base_addr_id = ba.id " +
        " left join receive_info r on dptd.receive_id = r.id " +
        " where dptd.id is not null ";
    var paramsArray=[],i=0;
    if(params.transferAddrId){
        paramsArray[i++] = params.transferAddrId;
        query = query + " and dptd.transfer_addr_id = ? ";
    }
    if(params.transferStatus){
        paramsArray[i++] = params.transferStatus;
        query = query + " and dptd.transfer_status = ? ";
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
        " from dp_task_transfer_stat dptd " +
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

function updateDpTransferDemand(params,callback){
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
        logger.debug(' updateDpTransferDemand ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpTransferDemand : addDpTransferDemand,
    getDpTransferDemand : getDpTransferDemand,
    getDpTransferDemandStat : getDpTransferDemandStat,
    updateDpTransferDemand : updateDpTransferDemand
}
