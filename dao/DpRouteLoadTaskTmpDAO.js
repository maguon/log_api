/**
 * Created by zwl on 2018/11/19.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskTmpDAO.js');

function addDpRouteLoadTaskTmp(params,callback){
    var query = " insert into dp_route_load_task_tmp (user_id,load_task_type,demand_id,transfer_demand_id, " +
        " dp_route_task_id,route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end," +
        " receive_id,short_name,receive_flag,date_id," +
        " plan_date,plan_count,transfer_flag,transfer_city_id,transfer_city,transfer_addr_id,transfer_addr_name) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
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
    paramsArray[i++]=params.receiveFlag;
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

function getDpRouteLoadTaskTmp(params,callback) {
    var query = " select dprltmp.*,dprltmp.route_start as city_start_name,dprltmp.route_end as city_name,dprltmp.transfer_city as transfer_city_name, " +
        " dpd.route_start as demand_route_start,ba2.addr_name as demand_addr_name,dpd.route_end as demand_route_end " +
        " from dp_route_load_task_tmp dprltmp " +
        " left join dp_demand_info dpd on dprltmp.demand_id = dpd.id " +
        " left join base_addr ba2 on dpd.base_addr_id = ba2.id " +
        " where dprltmp.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskTmpId){
        paramsArray[i++] = params.dpRouteTaskTmpId;
        query = query + " and dprltmp.dp_route_task_id = ? ";
    }
    if(params.dpRouteLoadTaskTmpId){
        paramsArray[i++] = params.dpRouteLoadTaskTmpId;
        query = query + " and dprltmp.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskTmp ');
        return callback(error,rows);
    });
}

function deleteDpRouteLoadTaskTmp(params,callback){
    var query = " delete from dp_route_load_task_tmp where id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteLoadTaskTmpId){
        paramsArray[i++] = params.dpRouteLoadTaskTmpId;
        query = query + " and id = ? ";
    }
    if(params.dpRouteTaskTmpId){
        paramsArray[i++] = params.dpRouteTaskTmpId;
        query = query + " and dp_route_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteLoadTaskTmp ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskTmp : addDpRouteLoadTaskTmp,
    getDpRouteLoadTaskTmp : getDpRouteLoadTaskTmp,
    deleteDpRouteLoadTaskTmp : deleteDpRouteLoadTaskTmp
}
