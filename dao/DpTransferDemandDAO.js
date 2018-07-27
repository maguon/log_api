/**
 * Created by zwl on 2018/7/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTransferDemandDAO.js');

function addDpTransferDemand(params,callback){
    var query = " insert into dp_transfer_demand_info (demand_id,route_start_id,base_addr_id,transfer_city_id,transfer_addr_id,route_end_id, " +
        " receive_id,transfer_count,date_id) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.demandId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.receiveId;
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


module.exports ={
    addDpTransferDemand : addDpTransferDemand,
    getDpTransferDemand : getDpTransferDemand
}
