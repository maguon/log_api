/**
 * Created by zwl on 2018/1/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('repairStationDAO.js');

function addRepairStation(params,callback){
    var query = " insert into repair_station_info (repair_station_name,address,lng,lat,remark) values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairStationName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addRepairStation ');
        return callback(error,rows);
    });
}

function getRepairStation(params,callback) {
    var query = " select * from repair_station_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.repairStationId){
        paramsArray[i++] = params.repairStationId;
        query = query + " and id = ? ";
    }
    if(params.repairStationName){
        paramsArray[i++] = params.repairStationName;
        query = query + " and repair_station_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRepairStation ');
        return callback(error,rows);
    });
}

function updateRepairStation(params,callback){
    var query = " update repair_station_info set repair_station_name = ?,address = ?, lng = ?,lat = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairStationName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.repairStationId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRepairStation ');
        return callback(error,rows);
    });
}

function updateRepairStationStatus(params,callback){
    var query = " update repair_station_info set repair_station_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairStationStatus;
    paramsArray[i]=params.repairStationId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRepairStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addRepairStation: addRepairStation,
    getRepairStation : getRepairStation,
    updateRepairStation : updateRepairStation,
    updateRepairStationStatus : updateRepairStationStatus
}
