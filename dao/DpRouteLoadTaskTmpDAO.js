/**
 * Created by zwl on 2018/11/19.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskTmpDAO.js');

function addDpRouteLoadTaskTmp(params,callback){
    var query = " insert into dp_route_load_task_tmp (user_id,load_task_type,demand_id,transfer_demand_id, " +
        " dp_route_task_id,route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end,receive_id,short_name,date_id," +
        " plan_date,plan_count,transfer_flag,transfer_city_id,transfer_city,transfer_addr_id,transfer_addr_name) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loadTaskType;
    paramsArray[i++]=params.dpDemandId;
    paramsArray[i++]=params.transferDemandId;
    paramsArray[i++]=params.dpRouteTaskTmpId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.addrName;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.planDate;
    paramsArray[i++]=params.planCount;
    paramsArray[i++]=params.transferFlag;
    paramsArray[i++]=params.transferCityId;
    paramsArray[i++]=params.transferCity;
    paramsArray[i++]=params.transferAddrId;
    paramsArray[i++]=params.transferAddrName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskTmp ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskTmp : addDpRouteLoadTaskTmp
}
