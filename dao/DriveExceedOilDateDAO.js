/**
 * Created by zwl on 2019/5/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDateDAO.js');

function addDriveExceedOilDate(params,callback){
    var query = " insert into drive_exceed_oil_date (month_date_id,drive_id,truck_id,remark) values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function getDriveExceedOilDate(params,callback) {
    var query = " select deod.*,d.drive_name,t.truck_num " +
        " from drive_exceed_oil_date deod " +
        " left join drive_info d on deod.drive_id = d.id " +
        " left join truck_info t on deod.truck_id = t.id " +
        " where deod.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilDateId){
        paramsArray[i++] = params.exceedOilDateId;
        query = query + " and deod.id = ? ";
    }
    if(params.monthDateId){
        paramsArray[i++] = params.monthDateId;
        query = query + " and deod.month_date_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deod.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deod.truck_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilDate(params,callback){
    var query = " update drive_exceed_oil_date set actual_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilDate ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOilDate : addDriveExceedOilDate,
    getDriveExceedOilDate : getDriveExceedOilDate,
    updateDriveExceedOilDate : updateDriveExceedOilDate
}
