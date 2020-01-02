/**
 * Created by zwl on 2018/6/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverCarRelDAO.js');

function addSettleHandoverCarRel(params,callback){
    var query = " insert into settle_handover_car_rel (settle_handover_id,car_id,sequence_num) values ( ? , ?  , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleHandoverId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.sequenceNum;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandoverCarRel ');
        return callback(error,rows);
    });
}

function getSettleHandoverCarRel(params,callback) {
    var query = " select shcr.*,c.vin,c.make_name,c.receive_id,dpd.dp_route_task_id,dpd.arrive_date," +
        " dpdi.route_start,dpdi.route_end,d.drive_name,t.truck_num" +
        " from settle_handover_car_rel shcr" +
        " left join car_info c on shcr.car_id = c.id " +
        " left join dp_route_load_task_detail dpd on shcr.car_id = dpd.car_id " +
        " left join dp_route_task dpr on dpd.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task dprl on dpd.dp_route_load_task_id = dprl.id " +
        " left join dp_demand_info dpdi on dprl.demand_id = dpdi.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " where shcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.settleHandoverId){
        paramsArray[i++] = params.settleHandoverId;
        query = query + " and shcr.settle_handover_id = ? ";
    }
    if(params.transferFlag){
        paramsArray[i++] = params.transferFlag;
        query = query + " and dprl.transfer_flag = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandoverCarRel ');
        return callback(error,rows);
    });
}

function deleteSettleHandoverCarRel(params,callback){
    var query = " delete from settle_handover_car_rel where settle_handover_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleHandoverId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteSettleHandoverCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleHandoverCarRel : addSettleHandoverCarRel,
    getSettleHandoverCarRel : getSettleHandoverCarRel,
    deleteSettleHandoverCarRel : deleteSettleHandoverCarRel
}
