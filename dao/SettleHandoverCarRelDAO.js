/**
 * Created by zwl on 2018/6/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverCarRelDAO.js');

function addSettleHandoverCarRel(params,callback){
    var query = " insert into settle_handover_car_rel (settle_handover_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleHandoverId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandoverCarRel ');
        return callback(error,rows);
    });
}

function getSettleHandoverCarRel(params,callback) {
    var query = " select shcr.* from settle_handover_car_rel shcr ";
    var paramsArray=[],i=0;
    if(params.settleHandoverId){
        paramsArray[i++] = params.settleHandoverId;
        query = query + " and shcr.settle_handover_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
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
