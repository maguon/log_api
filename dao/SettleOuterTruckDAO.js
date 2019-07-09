/**
 * Created by zwl on 2019/7/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruckDAO.js');

function addSettleOuterTruck(params,callback){
    var query = " insert into settle_outer_truck (make_id,make_name," +
        " route_start_id,route_start,route_end_id,route_end,distance,fee) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleOuterTruck ');
        return callback(error,rows);
    });
}

function getSettleOuterTruck(params,callback) {
    var query = " select sot.* from settle_outer_truck sot " +
        " where sot.id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and sot.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sot.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sot.route_end_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruck ');
        return callback(error,rows);
    });
}

function getSettleOuterTruckList(params,callback) {
    var query = " select dpr.id,dpr.truck_id,t.truck_num,dpr.drive_id,d.drive_name, " +
        " c.vin,c.make_name,e.short_name as e_short_name,c.route_start,ba.addr_name,c.route_end, " +
        " r.short_name as r_short_name,c.order_date,sot.distance,sot.fee " +
        " from dp_route_task dpr " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join dp_route_load_task_detail drltd on dpr.id = drltd.dp_route_task_id " +
        " left join car_info c on drltd.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id and c.route_end_id = sot.route_end_id " +
        " where dpr.id is not null and c.car_status=9 ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    query = query + '  order by dpr.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruckList ');
        return callback(error,rows);
    });
}

function updateSettleOuterTruck(params,callback){
    var query = " update settle_outer_truck set distance = ? , fee = ? " +
        " where make_id = ? and route_start_id = ? and route_end_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleOuterTruck ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleOuterTruck : addSettleOuterTruck,
    getSettleOuterTruck : getSettleOuterTruck,
    getSettleOuterTruckList : getSettleOuterTruckList,
    updateSettleOuterTruck : updateSettleOuterTruck
}
