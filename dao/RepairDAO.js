/**
 * Created by zwl on 2018/1/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('RepairDAO.js');

function addRepair(params,callback){
    var query = " insert into repair_info (repair_name,address,lng,lat,remark) values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addRepair ');
        return callback(error,rows);
    });
}

function getRepair(params,callback) {
    var query = " select * from repair_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.repairId){
        paramsArray[i++] = params.repairId;
        query = query + " and id = ? ";
    }
    if(params.repairName){
        paramsArray[i++] = params.repairName;
        query = query + " and repair_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRepair ');
        return callback(error,rows);
    });
}


module.exports ={
    addRepair: addRepair,
    getRepair : getRepair
}
