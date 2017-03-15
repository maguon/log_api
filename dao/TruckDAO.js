/**
 * Created by zwl on 2017/3/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDAO.js');

function getTruck(params,callback) {
    var query = " select * from truck_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and truck_num = ? ";
    }
    if(params.brand){
        paramsArray[i++] = params.brand;
        query = query + " and brand = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and operate_type = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and truck_type = ? ";
    }
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and truck_status = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and number = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruck ');
        return callback(error,rows);
    });
}

module.exports ={
    getTruck : getTruck
}