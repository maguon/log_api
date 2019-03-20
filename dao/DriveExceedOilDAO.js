/**
 * Created by zwl on 2018/6/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDAO.js');

function addDriveExceedOil(params,callback){
    var query = " insert into drive_exceed_oil (drive_id,oil_date,date_id) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.oilDate;
    paramsArray[i++]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOil ');
        return callback(error,rows);
    });
}

function getDriveExceedOil(params,callback) {
    var query = " select deo.*,d.drive_name " +
        " from drive_exceed_oil deo " +
        " left join drive_info d on deo.drive_id = d.id " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilId){
        paramsArray[i++] = params.exceedOilId;
        query = query + " and deo.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deo.drive_id = ? ";
    }
    if(params.oilDateStart){
        paramsArray[i++] = params.oilDateStart;
        query = query + " and deo.oil_date >= ? ";
    }
    if(params.oilDateEnd){
        paramsArray[i++] = params.oilDateEnd;
        query = query + " and deo.oil_date <= ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and deo.settle_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOil ');
        return callback(error,rows);
    });
}

function getDriveExceedOilCount(params,callback) {
    var query = " select stat_status,count(deo.id)as exceed_oil_count,sum(deo.actual_money)as actual_money " +
        " from drive_exceed_oil deo " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    query = query + ' group by deo.stat_status ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilCount ');
        return callback(error,rows);
    });
}

function updateDriveExceedOil(params,callback){
    var query = " update drive_exceed_oil set plan_oil = ? , plan_urea = ? , actual_oil = ? , actual_urea = ? , " +
        " exceed_oil = ? , exceed_urea = ? , actual_money = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.planOil;
    paramsArray[i++]=params.planUrea;
    paramsArray[i++]=params.actualOil;
    paramsArray[i++]=params.actualUrea;
    paramsArray[i++]=params.exceedOil;
    paramsArray[i++]=params.exceedUrea;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOil ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilStatus(params,callback){
    var query = " update drive_exceed_oil set settle_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleStatus;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilStatus ');
        return callback(error,rows);
    });
}

function updateDriveOilStatus(params,callback){
    var query = " update drive_exceed_oil set oil_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.oilStatus;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveOilStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOil : addDriveExceedOil,
    getDriveExceedOil : getDriveExceedOil,
    getDriveExceedOilCount : getDriveExceedOilCount,
    updateDriveExceedOil : updateDriveExceedOil,
    updateDriveExceedOilStatus : updateDriveExceedOilStatus,
    updateDriveOilStatus : updateDriveOilStatus
}
