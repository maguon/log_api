/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckInsureDAO.js');

function addTruckInsure(params,callback){
    var query = " insert into truck_insure (insure_name)  values ( ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckInsure ');
        return callback(error,rows);
    });
}

function getTruckInsure(params,callback) {
    var query = " select * from truck_insure where id is not null ";
    var paramsArray=[],i=0;
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and id = ? ";
    }
    if(params.insureName){
        query = query + " and insure_name like '%"+params.insureName+"%'";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsure ');
        return callback(error,rows);
    });
}

function updateTruckInsure(params,callback){
    var query = " update truck_insure set insure_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureName;
    paramsArray[i]=params.insureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsure ');
        return callback(error,rows);
    });
}



module.exports ={
    addTruckInsure : addTruckInsure,
    getTruckInsure : getTruckInsure,
    updateTruckInsure : updateTruckInsure
}
